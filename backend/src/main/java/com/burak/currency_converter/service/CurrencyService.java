package com.burak.currency_converter.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class CurrencyService {

    private final RestTemplate restTemplate = new RestTemplate();

    // 1. Tüm kurları listelemek için (Eski fonksiyonumuz)
    @Cacheable("exchangeRates")
    public Map<String, Object> getRates(String baseCurrency) {
        String url = "https://api.frankfurter.app/latest?from=" + baseCurrency.toUpperCase();
        return restTemplate.getForObject(url, Map.class);
    }

    // 2. İki para birimi arasında doğrudan dönüşüm yapmak için yeni fonksiyon
    public Map<String, Object> convertCurrency(String from, String to, double amount) {
        // Frankfurter API'nin desteklediği akıllı URL yapısı
        String url = String.format("https://api.frankfurter.app/latest?amount=%.2f&from=%s&to=%s",
                amount, from.toUpperCase(), to.toUpperCase());

        return restTemplate.getForObject(url, Map.class);
    }
}