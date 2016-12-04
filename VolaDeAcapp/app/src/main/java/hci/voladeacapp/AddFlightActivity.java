package hci.voladeacapp;

import android.Manifest;
import android.app.Dialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.design.widget.TextInputLayout;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.CardView;
import android.text.Editable;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

import static hci.voladeacapp.MisVuelosFragment.ACTION_GET_FLIGHT;
import static hci.voladeacapp.MisVuelosFragment.DETAILS_REQUEST_CODE;
import static hci.voladeacapp.MisVuelosFragment.FLIGHT_IDENTIFIER;
import static hci.voladeacapp.MisVuelosFragment.FLIGHT_REMOVED;

public class AddFlightActivity extends AppCompatActivity implements Validator.ValidationListener{


    public static final String NEW_FLIGHT_ADDED = "hci.voladeacapp.AddFlightActivity.NEW_FLIGHT_ADDED";

    private final static String SEARCH_DONE = "hci.voladeacapp.AddFlightActivity.SEARCH_DONE";
    private final static String FLIGHT_GSON = "hci.voladeacapp.AddFlightActivity.FLIGHT_GSON";

    public final static String PARENTSHIP = "hci.voladeacapp.AddFlightActivity.PARENTSHIP";

    private final static String FLIGHT_NUMBER_REGEX = "[A-Z]{2} [0-9]+";

    @NotEmpty
    private EditText flightNumberEdit;

    @NotEmpty
    private AutoCompleteTextView airline;

    private Validator validator; // Valida los campos

    private AdderReceiver adder;

    private TextInputLayout numberInputLayout;
    private TextInputLayout airlineInputLayout;

    private IntentIntegrator qrIntegrator;

    private FlightStatusGson flightGson; // Se guarda para el savedInstanceState

    @Override
    public void onValidationSucceeded() {
        String airlineData = airline.getText().toString();
        String numberData = flightNumberEdit.getText().toString();
        String airlineId = StorageHelper.getAirlineIdMap(this).get(airlineData);
        /* Ver si se valida esto */
        if(airlineId == null)
            Toast.makeText(this,"No existe esa aerolinea",Toast.LENGTH_SHORT).show();

        airlineInputLayout.setErrorEnabled(false);
        numberInputLayout.setErrorEnabled(false);

        FlightIdentifier identifier = new FlightIdentifier(airlineId, numberData);

        findViewById(R.id.in_search_layout).setVisibility(View.VISIBLE);
        findViewById(R.id.not_exists_result).setVisibility(View.GONE);
        ApiService.startActionGetFlightStatus(this, identifier, ACTION_GET_FLIGHT);
    }

    @Override
    public void onValidationFailed(List<ValidationError> errors) {
        Toast.makeText(this, "Hay errores", Toast.LENGTH_SHORT).show();
        CardView resultCardView = (CardView) findViewById(R.id.card_view);
        View notExists = findViewById(R.id.not_exists_result);
        resultCardView.setVisibility(View.GONE);
        notExists.setVisibility(View.GONE);

        for(ValidationError error : errors){
            View v = error.getView();
            Log.d("test", String.valueOf(v.getId()) + String.valueOf(R.id.fl_num_data));
            if(v.getId() == R.id.fl_num_data){
                //Es el numero
                numberInputLayout.setErrorEnabled(true);
                numberInputLayout.setError(getString(R.string.error_required_flight_number));
            } else {
                //es la aerolinea
                airlineInputLayout.setErrorEnabled(true);
                airlineInputLayout.setError(getString(R.string.error_required_airline));
            }
        }
    }

    private class AdderReceiver extends BroadcastReceiver{

        AddFlightActivity parent;

        public AdderReceiver(AddFlightActivity parent){
            super();
            this.parent = parent;
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            if(intent.getBooleanExtra(ApiService.API_REQUEST_ERROR, false)){
                ErrorHelper.connectionErrorShow(context);
            }
            else{
                FlightStatusGson flGson = (FlightStatusGson)intent.getSerializableExtra(ApiService.DATA_FLIGHT_GSON);
                parent.addFlight(flGson);
            }
            findViewById(R.id.in_search_layout).setVisibility(View.GONE);
         }
    }

    private void addFlight(final FlightStatusGson flGson) {
        /* ACA SE LLENAN LOS DATOS DE LA TARJETA */
        //TextView text = (TextView) findViewById(R.id.flight_info);
        Button actionButton = (Button) findViewById(R.id.add_btn);
        Button detailsButton = (Button) findViewById(R.id.details_btn);
        ((LinearLayout)findViewById(R.id.buttons)).setVisibility(View.VISIBLE);
        LinearLayout resultCardView = (LinearLayout) findViewById(R.id.result_card);
        View notExists = findViewById(R.id.not_exists_result);

        flightGson = flGson;

        if(flGson != null) {
            notExists.setVisibility(View.GONE);
            //text.setText(flGson.toString());
            fillData(flGson);
            resultCardView.setVisibility(View.VISIBLE);

            final FlightIdentifier flightIdentifier = new FlightIdentifier(flGson);

            if (!StorageHelper.flightExists(this, flightIdentifier)) {  // Se coloca el botón de agregar pues vuelo no pertenece a Mis Vuelos
                actionButton.setText(getString(R.string.add_to_my_flights));
                actionButton.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        setResult(MisVuelosFragment.GET_FLIGHT, new Intent().putExtra(ApiService.DATA_FLIGHT_GSON, flGson));
                        Toast.makeText(getApplicationContext(), R.string.flight_added, Toast.LENGTH_SHORT).show();
                        finish();
                    }
                });
            }
            else { // Se coloca el botón de borrar pues vuelo pertence a Mis Vuelos
                actionButton.setText(getString(R.string.remove_from_my_flights));
                actionButton.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        AlertDialog.Builder builder = new AlertDialog.Builder(AddFlightActivity.this);
                        builder.setMessage(getString(R.string.dialog_remove_flight_body, flightIdentifier.getAirline() + " " +  flightIdentifier.getNumber()))
                                .setTitle(R.string.dialog_remove_flight_title)
                                .setPositiveButton(R.string.dialog_remove_flight_yes, new Dialog.OnClickListener() {

                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {

                                        Toast.makeText(getApplicationContext(), R.string.singular_eliminado, Toast.LENGTH_SHORT).show();

                                        Intent intent = new Intent();

                                        intent.putExtra(MisVuelosFragment.FLIGHT_IDENTIFIER, flightIdentifier).putExtra(MisVuelosFragment.FLIGHT_REMOVED, true);

                                        setResult(MisVuelosFragment.DELETE_FLIGHT, intent);

                                        AddFlightActivity.this.finish();
                                    }

                                });

                        builder.setNegativeButton(R.string.dialog_remove_flight_no, new Dialog.OnClickListener() {

                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.cancel();
                            }

                        });

                        builder.show();
                    }
                });
            }

            View.OnClickListener detailsClickListener = new View.OnClickListener(){
                public void onClick(View view) {

                    Flight flight = new Flight(flGson);
                    Intent intent = new Intent(getApplication(),FlightDetails.class);
                    intent.putExtra("Flight", flight);
                    intent.putExtra(FLIGHT_IDENTIFIER, flight.getIdentifier());
                    intent.putExtra(FlightDetails.PARENT_ACTIVITY, PARENTSHIP); // Indica a FlightDetails que esta actividad es la padre
                    startActivityForResult(intent, DETAILS_REQUEST_CODE);
                }
            };

            detailsButton.setOnClickListener(detailsClickListener);
            resultCardView.setOnClickListener(detailsClickListener);

        }
        else {
            resultCardView.setVisibility(View.GONE);
            notExists.setVisibility(View.VISIBLE);
        }
    }

    private void fillData(FlightStatusGson flGson) {
        TextView origAirView = (TextView) findViewById(R.id.card_departure_airport_id);
        TextView origCityView = (TextView) findViewById(R.id.card_depart_city);
        TextView destAirView = (TextView) findViewById(R.id.card_arrival_airport_id);
        TextView destCityView = (TextView)findViewById(R.id.card_arrival_city);
        ImageView stateView = (ImageView) findViewById(R.id.card_status_badge);
        TextView flnumberView = (TextView) findViewById(R.id.card_flight_number);
        TextView departDateView = (TextView) findViewById(R.id.card_depart_date);

        flnumberView.setText(flGson.airline.id + " " + flGson.number);
        origAirView.setText(flGson.departure.airport.id);
        destAirView.setText(flGson.arrival.airport.id);
        origCityView.setText(flGson.departure.airport.city.name.split(",")[0]);
        destCityView.setText(flGson.arrival.airport.city.name.split(",")[0]);
        Flight.FlightDate date = new Flight.FlightDate(flGson.departure.scheduled_time);
        departDateView.setText(new SimpleDateFormat("dd-MM-yyyy").format(date.date));
        stateView.setImageResource(StatusInterpreter.getStateImage(getCorrectedStatus(flGson)));

    }

    private String getCorrectedStatus(FlightStatusGson flGson) {
        if(flGson.status.equals("S") && (flGson.departure.gate_delay != null || flGson.departure.runway_delay != null)){
            return "D";
        } else {
            return flGson.status;
        }


    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTitle(getString(R.string.search_flight_title));

        setContentView(R.layout.activity_add_flight);

        Map<String,String> airlineMap = StorageHelper.getAirlineIdMap(this);

        flightNumberEdit = (EditText) findViewById(R.id.fl_num_data);
        airline = (AutoCompleteTextView) findViewById(R.id.airline_id_data);

        airlineInputLayout = (TextInputLayout) findViewById(R.id.airline_inputLayout);
        numberInputLayout = (TextInputLayout) findViewById(R.id.number_inputLayout);

        validator = new Validator(this);
        validator.setValidationListener(this);

        ArrayAdapter adapter = new ArrayAdapter(this,android.R.layout.select_dialog_item,airlineMap.keySet().toArray());
        airline.setAdapter(adapter);
        airline.setThreshold(1);

        flightNumberEdit.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int actionId, KeyEvent keyEvent) {
                if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                    AddFlightActivity.this.findViewById(R.id.fl_search_btn).performClick();
                    return true;
                }

                return false;
            }
        });

        Button search = (Button)findViewById(R.id.fl_search_btn);

        search.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v) {
                validator.validate();
                hideKeyboard(v);
            }
        });

        qrIntegrator = new IntentIntegrator(AddFlightActivity.this)
                .setOrientationLocked(false)
                .setBeepEnabled(false)
                .setBarcodeImageEnabled(false)
                .setPrompt(getString(R.string.prompt_QR))
                .setDesiredBarcodeFormats(IntentIntegrator.QR_CODE_TYPES);

        findViewById(R.id.QR_code_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!hasCameraPermissions()) {
                    requestCameraPermissions();
                } else {
                    qrIntegrator.initiateScan();
                }
            }
        });

        setFocusChangeListeners();

        if (savedInstanceState != null && savedInstanceState.getBoolean(SEARCH_DONE))
            addFlight((FlightStatusGson) savedInstanceState.getSerializable(FLIGHT_GSON));
    }

    private void hideKeyboard(View view) {
        InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.hideSoftInputFromWindow(getWindow().getCurrentFocus().getWindowToken(), 0);
    }
    /**
     * En cambio de foco se validan los campos y se pone el mensaje de error correspondiente
     */
    private void setFocusChangeListeners() {
        flightNumberEdit.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                numberInputLayout.setErrorEnabled(false);
                if(hasFocus){
                    numberInputLayout.setErrorEnabled(false);
                }else{
                    numberInputLayout.setErrorEnabled(false);
                    if (!validateEditText(((EditText) v).getText())){
                        numberInputLayout.setErrorEnabled(true);
                        numberInputLayout.setError(getString(R.string.error_required_flight_number));
                    } else {
                        numberInputLayout.setErrorEnabled(false);
                    }
                }

            }
        });

        airline.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                airlineInputLayout.setErrorEnabled(false);
                if(hasFocus){
                    airlineInputLayout.setErrorEnabled(false);
                } else {
                    airlineInputLayout.setErrorEnabled(false);
                    if(!validateEditText(((EditText) v).getText())){
                        airlineInputLayout.setErrorEnabled(true);
                        airlineInputLayout.setError(getString(R.string.error_required_airline));
                    } else {
                        airlineInputLayout.setErrorEnabled(false);
                    }
                }
            }
        });
    }

    /**
     * Retorna true si el campo está lleno y false si el campo está vacío
     * @param text
     * @return
     */
    private boolean validateEditText(Editable text) {
        if (TextUtils.isEmpty(text))
            return false;
        return true;
    }



    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);

        if(result != null && result.getContents() != null) {
            Toast.makeText(this, getString(R.string.found_QR, result.getContents()) , Toast.LENGTH_SHORT).show();
            processQRData(result.getContents());

        }
        else if (requestCode == DETAILS_REQUEST_CODE) {
            boolean addedNew = data.getBooleanExtra(NEW_FLIGHT_ADDED, false);
            boolean deleted = data.getBooleanExtra(FLIGHT_REMOVED, false);
            if (deleted) {
                //Borró y hay que borrarlo de la lista
                FlightIdentifier identifier = (FlightIdentifier)data.getSerializableExtra(FLIGHT_IDENTIFIER);
                StorageHelper.deleteFlight(this, identifier);
                addFlight(flightGson);  // Actualiza la tarjeta
            }
            else if (addedNew) {
                addFlight(flightGson);  // Actualiza la tarjeta
            }
        }
    }

    private boolean hasCameraPermissions() {
        return ContextCompat.checkSelfPermission(this,
                Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED;
    }

    private void requestCameraPermissions() {
        if (!hasCameraPermissions()) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA},
                    Voladeacapp.CAMERA_PERMISSION_REQUEST_CODE);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[], int[] grantResults) {
        if (requestCode == Voladeacapp.CAMERA_PERMISSION_REQUEST_CODE && grantResults.length > 0) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED)
                qrIntegrator.initiateScan();
            else
                Toast.makeText(this, getString(R.string.we_cant_scan_wo_camera), Toast.LENGTH_SHORT).show();
        }
    }

    private void processQRData(String data) {
        if (!isAFlightNumber(data)) {
            Toast.makeText(this, getString(R.string.invalid_QR), Toast.LENGTH_SHORT).show();
        } else { // Es un número de vuelo
            String[] splitData = data.split(" ");
            FlightIdentifier identifier = new FlightIdentifier(splitData[0], splitData[1]);
            findViewById(R.id.in_search_layout).setVisibility(View.VISIBLE);
            findViewById(R.id.not_exists_result).setVisibility(View.GONE);

            Map<String, String> nameMap = StorageHelper.getAirlineNameMap(this);
            if(nameMap.keySet().contains(identifier.getAirline())) {
                ((EditText) findViewById(R.id.airline_id_data)).setText(nameMap.get(identifier.getAirline()));
            } else {
                ((EditText) findViewById(R.id.airline_id_data)).setText(identifier.getAirline());
            }
            ((EditText)findViewById(R.id.fl_num_data)).setText(identifier.getNumber());

            ((AutoCompleteTextView) findViewById(R.id.airline_id_data)).dismissDropDown();

            // ApiService.startActionGetFlightStatus(this, identifier, ACTION_GET_FLIGHT);
            ((Button)findViewById(R.id.fl_search_btn)).performClick();

        }
    }

    private boolean isAFlightNumber(String str) {
        return str != null && str.matches(FLIGHT_NUMBER_REGEX);
    }


    @Override
    protected void onResume(){
        super.onResume();
        if(adder == null) {
            adder = new AdderReceiver(this);
        }
        registerReceiver(adder, new IntentFilter(ACTION_GET_FLIGHT));
    }

    @Override
    protected void onPause(){
        super.onPause();
        unregisterReceiver(adder);
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        LinearLayout resultCardView = (LinearLayout) findViewById(R.id.result_card);
        View notExists = findViewById(R.id.not_exists_result);

        // Se muestra tarjeta o vuelo no encontrado. Entonces se realizó la búsqueda.
        if (resultCardView.getVisibility() == View.VISIBLE || notExists.getVisibility() == View.VISIBLE) {
            outState.putBoolean(SEARCH_DONE, true);
            outState.putSerializable(FLIGHT_GSON, flightGson);
        }
    }
}
