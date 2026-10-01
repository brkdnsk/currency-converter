package com.burak.currency_converter.controller;

import com.burak.currency_converter.service.CurrencyService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/currency")
@CrossOrigin(origins = "*")
public class CurrencyController {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    // Tüm kurları getiren endpoint
    @GetMapping("/latest")
    public Map<String, Object> getLatestRates(@RequestParam(defaultValue = "USD") String base) {
        return currencyService.getRates(base);
    }

    // 📌 YENİ: İki para birimi arasında çeviri yapan endpoint
    // Örnek kullanım: http://localhost:8080/api/currency/convert?from=USD&to=TRY&amount=50
    @GetMapping("/convert")
    public Map<String, Object> convertCurrency(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam double amount) {
        return currencyService.convertCurrency(from, to, amount);
    }
}