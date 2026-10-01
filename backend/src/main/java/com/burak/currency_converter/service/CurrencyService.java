package com.burak.currencyconverter.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class CurrencyService {

    // Frankfurter API adresi (Örn: Baz para birimine göre güncel kurlar)
    private final String API_URL = "https://api.frankfurter.app/latest?from=";

    @Cacheable("exchangeRates") //  Kurları bellekte tutar, her istekte tekrar dış API'ye gitmez
    public Map<String, Object> getRates(String baseCurrency) {
        RestTemplate restTemplate = new RestTemplate();
        String url = API_URL + baseCurrency.toUpperCase();

        // Dış API'den gelen JSON yanıtını Map olarak döndürür
        return restTemplate.getForObject(url, Map.class);
    }
}