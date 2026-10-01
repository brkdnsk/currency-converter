import { useState, useEffect } from 'react';

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('TRY');
  const [currencies, setCurrencies] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Desteklenen para birimi listesini almak için ilk açılışta backend'e istek atıyoruz
  useEffect(() => {
    fetch('http://localhost:8080/api/currency/latest?base=USD')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          // USD ve gelen diğer tüm kur anahtarlarını listeye ekliyoruz
          setCurrencies(['USD', ...Object.keys(data.rates)]);
        }
      })
      .catch((err) => console.error("Kurlar yüklenirken hata oluştu:", err));
  }, []);

  // 2. Dönüştürme işlemini yapan fonksiyon
  const handleConvert = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch(`http://localhost:8080/api/currency/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`)
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Çeviri sırasında hata oluştu:", err);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Döviz Çevirici
          </h1>
          <p className="text-slate-400 text-sm mt-1">Spring Boot & React Portfolyo Projesi</p>
        </div>

        {/* Form Alanı */}
        <form onSubmit={handleConvert} className="space-y-6">
          
          {/* Miktar Girişi */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Miktar</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Miktar giriniz..."
              required
            />
          </div>

          {/* Para Birimleri Seçimi (Grid Yapısı) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Kimden (From) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Kaynak</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>

            {/* Kime (To) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Hedef</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Çevir Butonu */}
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-emerald-500/20"
          >
            {loading ? "Hesaplanıyor..." : "Çevir"}
          </button>
        </form>

        {/* Sonuç Alanı */}
        {result && result.rates && (
          <div className="mt-8 p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl text-center">
            <p className="text-slate-400 text-sm">Sonuç</p>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {amount} {fromCurrency} = {result.rates[toCurrency]} {toCurrency}
            </div>
            <p className="text-xs text-slate-500 mt-2">Güncelleme Tarihi: {result.date}</p>
          </div>
        )}

      </div>
    </div>
  );
}

AltExport default App;