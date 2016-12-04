package hci.voladeacapp;

import android.os.Bundle;
import android.support.design.widget.TextInputLayout;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.RatingBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.mobsandgeeks.saripaar.ValidationError;
import com.mobsandgeeks.saripaar.Validator;
import com.mobsandgeeks.saripaar.annotation.NotEmpty;

import org.adw.library.widgets.discreteseekbar.DiscreteSeekBar;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AddReviewActivity extends AppCompatActivity implements Validator.ValidationListener{

    final private static String RECOMMENDED_BOOLEAN = "voladeacapp.RECOMMENDED_BOOLEAN";

    private Map<String, String> airlineIdMap;

    @NotEmpty
    private AutoCompleteTextView airline;

    @NotEmpty
    private EditText flightNumber;

    private Validator validator;

    private ScrollView scrollView;

    private String aerolinea;
    private String comentario;
    private Integer numeroVuelo;
    private DiscreteSeekBar amabilidad;
    private DiscreteSeekBar confort;
    private DiscreteSeekBar comida;
    private DiscreteSeekBar preciocalidad;
    private DiscreteSeekBar puntualidad;
    private DiscreteSeekBar viajerosFrec;

    private Boolean recommended;
    private RatingBar stars;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTitle(R.string.title_dejar_resena);  // Así se llega a traducir
        setContentView(R.layout.activity_add_review);

        scrollView = (ScrollView) findViewById(R.id.activity_add_review);

        airlineIdMap = StorageHelper.getAirlineIdMap(this);

        validator = new Validator(this);
        validator.setValidationListener(this);

        validator.setValidationMode(Validator.Mode.BURST);

        airline = (AutoCompleteTextView) findViewById(R.id.airline_input);
        flightNumber = (EditText) findViewById(R.id.flight_number_input);

        ArrayAdapter adapter = new ArrayAdapter(this,R.layout.review_dropdown,StorageHelper.getAirlineIdMap(this).keySet().toArray());
        airline.setAdapter(adapter);
        airline.setThreshold(1);

        /* Lo mas feo que vi en mi vida */

        amabilidad = (DiscreteSeekBar) findViewById(R.id.amabilidad_bar);
        confort = (DiscreteSeekBar) findViewById(R.id.confort_bar);
        comida = (DiscreteSeekBar) findViewById(R.id.comida_bar);
        preciocalidad = (DiscreteSeekBar) findViewById(R.id.precio_calidad_bar);
        puntualidad = (DiscreteSeekBar) findViewById(R.id.puntualidad_bar);
        viajerosFrec = (DiscreteSeekBar) findViewById(R.id.viajeros_frecuentes_bar);
        stars = (RatingBar) findViewById(R.id.ratingBar);

        HashMap<DiscreteSeekBar,TextView> map = new HashMap<>();
        map.put(amabilidad,(TextView)findViewById(R.id.amabilidad_data));
        map.put(confort,(TextView)findViewById(R.id.confort_data));
        map.put(comida,(TextView)findViewById(R.id.comida_data));
        map.put(preciocalidad,(TextView)findViewById(R.id.precio_calidad_data));
        map.put(puntualidad,(TextView)findViewById(R.id.puntualidad_data));
        map.put(viajerosFrec,(TextView)findViewById(R.id.viajeros_fecuentes_data));
        /* --- */

        /* Agrega los listeners de los bars */
        addCommonMethods(map,stars);
        final ImageButton happyBtn = (ImageButton) findViewById(R.id.happy_button);
        final ImageButton sadBtn = (ImageButton) findViewById(R.id.sad_button) ;
        Button submitButtom = (Button)findViewById(R.id.send_review_button);

        submitButtom.setOnClickListener(new View.OnClickListener(){

            @Override
            public void onClick(View view) {
                //Aca se tienen que chequear cosas
                EditText aerolineaText = (EditText)findViewById(R.id.airline_input);
                EditText numeroVueloText = (EditText)findViewById(R.id.flight_number_input);

                try {
                    numeroVuelo = new Integer(numeroVueloText.getText().toString());
                }catch(NumberFormatException e){
                    numeroVuelo = null;
                }

                aerolinea = aerolineaText.getText().toString();

                EditText comentarioText = (EditText) findViewById(R.id.comment_data);
                comentario = comentarioText.getText().toString();

                validator.validate(); // Se llama a onValidationSucceded o OnValidationFailed.
                                      // Se valida los EditText que tienen las anotaciones @NotEmpty


            }
        });

        happyBtn.setOnClickListener( new View.OnClickListener(){

            @Override
            public void onClick(View view) {
                happyBtn.setBackgroundColor(ContextCompat.getColor(AddReviewActivity.this, R.color.green));
                sadBtn.setBackgroundColor(ContextCompat.getColor(AddReviewActivity.this, R.color.grey));
                recommended = true;
            }
        });

        if (savedInstanceState == null)
            happyBtn.performClick();

        sadBtn.setOnClickListener( new View.OnClickListener(){

            @Override
            public void onClick(View view) {
                sadBtn.setBackgroundColor(ContextCompat.getColor(AddReviewActivity.this, R.color.red));
                happyBtn.setBackgroundColor(ContextCompat.getColor(AddReviewActivity.this, R.color.grey));
                recommended = false;
            }
        });

        if (savedInstanceState != null && savedInstanceState.containsKey(RECOMMENDED_BOOLEAN)) {
            recommended = savedInstanceState.getBoolean(RECOMMENDED_BOOLEAN);
            if (recommended)
                happyBtn.setBackgroundColor(ContextCompat.getColor(AddReviewActivity.this, R.color.green));
            else
                sadBtn.setBackgroundColor(ContextCompat.getColor(AddReviewActivity.this, R.color.red));
        }

        setOnFocusChangeListeners();
    }

    private void setOnFocusChangeListeners() {
        final TextInputLayout airlineTextInputLayout = findTextInputLayout(airline);
        TextInputLayout flightNumberTextInputLayout = findTextInputLayout(flightNumber);

        airline.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View view, boolean focused) {
                EditText editText = (EditText) view;

                if (focused) {
                    airlineTextInputLayout.setError(null);
                    editText.setCursorVisible(true);
                }
                else if (editText.getText().length() < 1) {
                    airlineTextInputLayout.setError(getString(R.string.error_required_airline));
                }
                else if (!airlineIdMap.containsKey(editText.getText().toString())) {
                    airlineTextInputLayout.setError(getString(R.string.error_invalid_airline));
                }
                else {
                    airlineTextInputLayout.setError(null);
                }
            }
        });

        flightNumber.setOnFocusChangeListener(new NotEmptyOnFocusChangeListener(flightNumberTextInputLayout, getString(R.string.error_required_flight_number)));
    }

    private static class NotEmptyOnFocusChangeListener implements View.OnFocusChangeListener {

        private TextInputLayout textInputLayout;
        private String errorMsg;

        public NotEmptyOnFocusChangeListener(TextInputLayout textInputLayout, String errorMsg) {
            this.textInputLayout = textInputLayout;
            this.errorMsg = errorMsg;
        }

        @Override
        public void onFocusChange(View view, boolean focused) {
            EditText editText = (EditText) view;
            if (focused) {
                hideErrorMessage();
                editText.setCursorVisible(true);
            }
            else {
                if (editText.getText().length() < 1) // Input vacío
                    textInputLayout.setError(errorMsg);
                else
                    hideErrorMessage();
            }
        }

        private void hideErrorMessage() {
            textInputLayout.setError(null);
        }
    }


    private void addCommonMethods(final HashMap<DiscreteSeekBar,TextView> map, final RatingBar stars) {
        /*Seteo las estrellas al inicio */
        setStars();

        for(final DiscreteSeekBar ds : map.keySet() ){
            ds.setProgress(1);
            ds.setOnProgressChangeListener(new DiscreteSeekBar.OnProgressChangeListener() {
                @Override
                public void onProgressChanged(DiscreteSeekBar seekBar, int value, boolean fromUser) {
                    setStars();
                    map.get(ds).setText(String.valueOf(value));
                }

                @Override
                public void onStartTrackingTouch(DiscreteSeekBar seekBar) {

                }

                @Override
                public void onStopTrackingTouch(DiscreteSeekBar seekBar) {

                }
            });
        }
    }
    public void setStars(){
        float sum = amabilidad.getProgress() + confort.getProgress() +
                comida.getProgress() + preciocalidad.getProgress() + puntualidad.getProgress() +
                viajerosFrec.getProgress() ;
        stars.setRating(((sum-6.0f) / 54.0f) * 5.0f);

    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (recommended != null)
            outState.putBoolean(RECOMMENDED_BOOLEAN, recommended.booleanValue());
    }

    @Override
    public void onValidationSucceeded() {
        if (airlineIdMap.containsKey(aerolinea)) {
            String airlineId = airlineIdMap.get(aerolinea);
            ReviewGson res = new ReviewGson(airlineId, numeroVuelo, comentario, amabilidad.getProgress(), confort.getProgress(), comida.getProgress(),
                    preciocalidad.getProgress(), puntualidad.getProgress(), viajerosFrec.getProgress(), recommended.booleanValue());

            ApiService.startActionSendReview(this, res);
            Toast.makeText(getApplication(), getString(R.string.review_sent), Toast.LENGTH_SHORT).show();
            finish();
        }
    }

    @Override
    public void onValidationFailed(List<ValidationError> errors) {
        for (ValidationError error : errors) {
            View v = error.getView();
            TextInputLayout til = findTextInputLayout(v);
            if (v.getId() == R.id.airline_input)
                til.setError(getString(R.string.error_required_airline));
            else if (v.getId() == R.id.flight_number_input)
                til.setError(getString(R.string.error_required_flight_number));
        }

        scrollView.fullScroll(ScrollView.FOCUS_UP);
    }

    /**
     * Devuelve el TextInputLayout padre de un view. Si no existe dicho padre explota todo.
     * @param v Vista hija del TextInputLayout
     * @return TextInputLayout padre del View v.
     */
    private TextInputLayout findTextInputLayout(View v) {
        while (!((v = (View) v.getParent()) instanceof TextInputLayout))
            ;
        return (TextInputLayout) v;
    }
}
