package com.valentin.app;

import android.appwidget.AppWidgetManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.RadioGroup;
import androidx.appcompat.app.AppCompatActivity;

public class WidgetConfigActivity extends AppCompatActivity {

    private int widgetId = AppWidgetManager.INVALID_APPWIDGET_ID;

    // Claves de preferencias
    public static final String PREF_SIZE   = "widget_size_";    // + widgetId
    public static final String PREF_BG     = "widget_bg_";
    public static final String PREF_TIME   = "widget_time_";
    public static final String PREF_SENDER = "widget_sender_";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.widget_config);

        // Resultado por defecto: cancelado
        setResult(RESULT_CANCELED);

        // Obtener el widget ID del intent
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            widgetId = extras.getInt(AppWidgetManager.EXTRA_APPWIDGET_ID,
                                     AppWidgetManager.INVALID_APPWIDGET_ID);
        }
        if (widgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish();
            return;
        }

        // Cargar preferencias guardadas para este widget
        SharedPreferences prefs = getSharedPreferences(MoodWidget.PREFS, MODE_PRIVATE);
        String savedSize   = prefs.getString(PREF_SIZE   + widgetId, "2x2");
        String savedBg     = prefs.getString(PREF_BG     + widgetId, "transparent");
        boolean savedTime  = prefs.getBoolean(PREF_TIME  + widgetId, true);
        boolean savedSender= prefs.getBoolean(PREF_SENDER+ widgetId, true);

        RadioGroup rgSize   = findViewById(R.id.rg_size);
        RadioGroup rgBg     = findViewById(R.id.rg_bg);
        CheckBox cbTime     = findViewById(R.id.cb_show_time);
        CheckBox cbSender   = findViewById(R.id.cb_show_sender);
        Button btnSave      = findViewById(R.id.btn_save);

        // Restaurar selección de tamaño
        switch (savedSize) {
            case "1x1": rgSize.check(R.id.rb_1x1); break;
            case "2x1": rgSize.check(R.id.rb_2x1); break;
            case "4x2": rgSize.check(R.id.rb_4x2); break;
            default:    rgSize.check(R.id.rb_2x2); break;
        }

        // Restaurar selección de fondo
        switch (savedBg) {
            case "dark":  rgBg.check(R.id.rb_bg_dark);  break;
            case "rose":  rgBg.check(R.id.rb_bg_rose);  break;
            case "light": rgBg.check(R.id.rb_bg_light); break;
            default:      rgBg.check(R.id.rb_bg_transparent); break;
        }

        cbTime.setChecked(savedTime);
        cbSender.setChecked(savedSender);

        btnSave.setOnClickListener(v -> {
            // Leer selecciones
            String size = "2x2";
            int sizeId = rgSize.getCheckedRadioButtonId();
            if      (sizeId == R.id.rb_1x1) size = "1x1";
            else if (sizeId == R.id.rb_2x1) size = "2x1";
            else if (sizeId == R.id.rb_4x2) size = "4x2";

            String bg = "transparent";
            int bgId = rgBg.getCheckedRadioButtonId();
            if      (bgId == R.id.rb_bg_dark)  bg = "dark";
            else if (bgId == R.id.rb_bg_rose)  bg = "rose";
            else if (bgId == R.id.rb_bg_light) bg = "light";

            boolean showTime   = cbTime.isChecked();
            boolean showSender = cbSender.isChecked();

            // Guardar preferencias
            SharedPreferences.Editor editor = getSharedPreferences(MoodWidget.PREFS, MODE_PRIVATE).edit();
            editor.putString (PREF_SIZE   + widgetId, size);
            editor.putString (PREF_BG     + widgetId, bg);
            editor.putBoolean(PREF_TIME   + widgetId, showTime);
            editor.putBoolean(PREF_SENDER + widgetId, showSender);
            editor.apply();

            // Actualizar el widget
            AppWidgetManager mgr = AppWidgetManager.getInstance(this);
            MoodWidget.updateWidget(this, mgr, widgetId);

            // Devolver resultado OK
            Intent result = new Intent();
            result.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, widgetId);
            setResult(RESULT_OK, result);
            finish();
        });
    }
}
