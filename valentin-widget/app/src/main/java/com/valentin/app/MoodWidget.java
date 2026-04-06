package com.valentin.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.view.View;
import android.widget.RemoteViews;

public class MoodWidget extends AppWidgetProvider {

    public static final String PREFS      = "ValentinPrefs";
    public static final String KEY_EMOJI  = "partner_emoji";
    public static final String KEY_LABEL  = "partner_label";
    public static final String KEY_TIME   = "partner_time";
    public static final String KEY_SENDER = "partner_sender";
    public static final String KEY_COLOR  = "partner_color";

    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) updateWidget(ctx, mgr, id);
    }

    public static void updateWidget(Context ctx, AppWidgetManager mgr, int widgetId) {
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);

        // Datos del estado
        String emoji  = prefs.getString(KEY_EMOJI,  "💕");
        String label  = prefs.getString(KEY_LABEL,  "Esperando...");
        String time   = prefs.getString(KEY_TIME,   "");
        String sender = prefs.getString(KEY_SENDER, "");

        // Preferencias del widget individual
        String size       = prefs.getString (WidgetConfigActivity.PREF_SIZE   + widgetId, "2x2");
        String bg         = prefs.getString (WidgetConfigActivity.PREF_BG     + widgetId, "transparent");
        boolean showTime  = prefs.getBoolean(WidgetConfigActivity.PREF_TIME   + widgetId, true);
        boolean showSender= prefs.getBoolean(WidgetConfigActivity.PREF_SENDER + widgetId, true);

        // Elegir layout según tamaño
        int layoutId; // outer wrapper
        switch (size) {
            case "1x1": layoutId = R.layout.widget_1x1; break;
            case "2x1": layoutId = R.layout.widget_2x1; break;
            case "4x2": layoutId = R.layout.widget_4x2; break;
            default:    layoutId = R.layout.widget_2x2; break;
        }

        RemoteViews views = new RemoteViews(ctx.getPackageName(), layoutId);

        // Elegir fondo
        int bgDrawable;
        switch (bg) {
            case "dark":  bgDrawable = R.drawable.widget_bg_dark;  break;
            case "rose":  bgDrawable = R.drawable.widget_bg_rose;  break;
            case "light": bgDrawable = R.drawable.widget_bg_light; break;
            default:      bgDrawable = R.drawable.widget_bg_rounded; break;
        }
        views.setInt(getLayoutRoot(size), "setBackgroundResource", bgDrawable);

        // Setear datos
        views.setTextViewText(R.id.widget_emoji, emoji);

        // label — no existe en 1x1
        if (!size.equals("1x1")) {
            views.setTextViewText(R.id.widget_label, label);
        }

        // sender — solo en 2x1, 2x2, 4x2
        if (!size.equals("1x1")) {
            views.setTextViewText(R.id.widget_sender, showSender ? sender : "");
            views.setViewVisibility(R.id.widget_sender,
                showSender && !sender.isEmpty() ? View.VISIBLE : View.GONE);
        }

        // time — solo en 2x2 y 4x2
        if (size.equals("2x2") || size.equals("4x2")) {
            views.setTextViewText(R.id.widget_time, showTime ? time : "");
            views.setViewVisibility(R.id.widget_time,
                showTime && !time.isEmpty() ? View.VISIBLE : View.GONE);
        }

        // Click abre la app
        Intent intent = new Intent(ctx, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pi = PendingIntent.getActivity(ctx, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_emoji, pi);

        mgr.updateAppWidget(widgetId, views);
    }

    // Devuelve el id del root layout según tamaño para cambiar el fondo
    private static int getLayoutRoot(String size) {
        // Todos los layouts tienen android:id en el root para poder cambiar el bg
        return R.id.widget_root;
    }

    // Llamado desde JS vía AndroidWidget.updateMood(...)
    public static void updateAll(Context ctx, String emoji, String label, String time, String sender) {
        SharedPreferences.Editor ed = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit();
        ed.putString(KEY_EMOJI,  emoji);
        ed.putString(KEY_LABEL,  label);
        ed.putString(KEY_TIME,   time);
        ed.putString(KEY_SENDER, sender);
        ed.apply();

        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        int[] ids = mgr.getAppWidgetIds(new ComponentName(ctx, MoodWidget.class));
        for (int id : ids) updateWidget(ctx, mgr, id);
    }

    // Compatibilidad con llamada sin sender
    public static void updateAll(Context ctx, String emoji, String label, String time) {
        updateAll(ctx, emoji, label, time, "");
    }
}
