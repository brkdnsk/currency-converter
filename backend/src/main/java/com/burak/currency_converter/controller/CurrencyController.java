package com.burak.currencyconverter.controller;

import com.burak.currencyconverter.service.CurrencyService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/currency")
@CrossOrigin(origins = "*") // Frontend ile rahatça haberleşmesi için
public class CurrencyController {

    private final CurrencyService currencyService;

    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    // Örnek kullanım: http://localhost:8080/api/currency/latest?base=USD
    @GetMapping("/latest")
    public Map<String, Object> getLatestRates(@RequestParam(defaultValue = "USD") String base) {
        return currencyService.getRates(base);
    }
}