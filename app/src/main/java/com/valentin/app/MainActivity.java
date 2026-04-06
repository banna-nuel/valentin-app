package com.valentin.app;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.view.Window;
import android.view.WindowManager;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.Button;
import android.graphics.Color;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private LinearLayout errorView;
    private static final String APP_URL = "https://inquisitive-dieffenbachia-ae1c44.netlify.app";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );

        setContentView(R.layout.activity_main);
        webView   = findViewById(R.id.webview);
        errorView = findViewById(R.id.error_view);
        Button retryBtn = findViewById(R.id.retry_btn);
        retryBtn.setOnClickListener(v -> loadApp());

        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        s.setAllowFileAccess(true);
        s.setAllowContentAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.addJavascriptInterface(new WidgetBridge(), "AndroidWidget");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                view.loadUrl(req.getUrl().toString());
                return true;
            }
            @Override
            public void onPageFinished(WebView view, String url) {
                errorView.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
            }
            public void onReceivedError(WebView view, WebResourceError error, WebResourceRequest req) {
                if (req.isForMainFrame()) {
                    webView.setVisibility(View.GONE);
                    errorView.setVisibility(View.VISIBLE);
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient());
        webView.setBackgroundColor(Color.parseColor("#fff8f0"));
        loadApp();
    }

    private void loadApp() {
        errorView.setVisibility(View.GONE);
        webView.setVisibility(View.VISIBLE);
        webView.loadUrl(APP_URL);
    }

    class WidgetBridge {
        // Llamada básica (compatibilidad)
        @JavascriptInterface
        public void updateMood(String emoji, String label, String time) {
            MoodWidget.updateAll(MainActivity.this, emoji, label, time, "");
        }

        // Llamada completa con nombre del sender
        @JavascriptInterface
        public void updateMoodFull(String emoji, String label, String time, String sender) {
            MoodWidget.updateAll(MainActivity.this, emoji, label, time, sender);
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
}
