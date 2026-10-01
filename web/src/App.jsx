import { useEffect, useState } from "react";

function App() {
	const [amount, setAmount] = useState(1);
	const [fromCurrency, setFromCurrency] = useState("USD");
	const [toCurrency, setToCurrency] = useState("TRY");
	const [currencies, setCurrencies] = useState([]);
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// 1. Desteklenen para birimi listesini almak için ilk açılışta backend'e istek atıyoruz
	useEffect(() => {
		fetch("http://localhost:8080/api/currency/latest?base=USD")
			.then((res) => res.json())
			.then((data) => {
				if (data && data.rates) {
					setCurrencies(["USD", ...Object.keys(data.rates)]);
				}
			})
			.catch((err) => {
				console.error("Kurlar yüklenirken hata oluştu:", err);
				setError(
					"Backend bağlantısı kurulamadı. Lütfen sunucunun açık olduğundan emin olun."
				);
			});
	}, []);

	// 2. Dönüştürme işlemini yapan fonksiyon
	const handleConvert = (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		fetch(
			`http://localhost:8080/api/currency/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
		)
			.then((res) => res.json())
			.then((data) => {
				setResult(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Çeviri sırasında hata oluştu:", err);
				setError("Çeviri işlemi sırasında bir hata oluştu.");
				setLoading(false);
			});
	};

	// 3. Para birimlerini karşılıklı yer değiştirme fonksiyonu
	const handleSwap = () => {
		setFromCurrency(toCurrency);
		setToCurrency(fromCurrency);
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-slate-950">
			<div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-800 relative overflow-hidden">
				{/* Dekoratif Arka Plan Işıkları */}
				<div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
				<div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

				{/* Başlık */}
				<div className="text-center mb-8 relative z-10">
					<h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
						Döviz Çevirici
					</h1>
					<p className="text-slate-400 text-sm mt-1">
						Spring Boot & React Full-Stack Projesi
					</p>
				</div>

				{/* Hata Mesajı */}
				{error && (
					<div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center relative z-10">
						{error}
					</div>
				)}

				{/* Form Alanı */}
				<form onSubmit={handleConvert} className="space-y-5 relative z-10">
					{/* Miktar Girişi */}
					<div>
						<label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
							Tutar
						</label>
						<input
							type="number"
							step="any"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
							placeholder="Miktar giriniz..."
							required
						/>
					</div>

					{/* Para Birimleri ve Swap Alanı */}
					<div className="relative grid grid-cols-2 gap-3 items-center">
						{/* Kaynak (From) */}
						<div>
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
								Kaynak
							</label>
							<select
								value={fromCurrency}
								onChange={(e) => setFromCurrency(e.target.value)}
								className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium cursor-pointer"
							>
								{currencies.map((curr) => (
									<option
										key={curr}
										value={curr}
										className="bg-slate-900"
									>
										{curr}
									</option>
								))}
							</select>
						</div>

						{/* Hedef (To) */}
						<div>
							<label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
								Hedef
							</label>
							<select
								value={toCurrency}
								onChange={(e) => setToCurrency(e.target.value)}
								className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium cursor-pointer"
							>
								{currencies.map((curr) => (
									<option
										key={curr}
										value={curr}
										className="bg-slate-900"
									>
										{curr}
									</option>
								))}
							</select>
						</div>

						{/* Ortadaki Swap (Yer Değiştirme) Butonu */}
						<div className="absolute left-1/2 top-[62%] -translate-x-1/2 -translate-y-1/2">
							<button
								type="button"
								onClick={handleSwap}
								className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center group"
								title="Para Birimlerini Değiştir"
							>
								<svg
									className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
									/>
								</svg>
							</button>
						</div>
					</div>

					{/* Çevir Butonu */}
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 mt-2 cursor-pointer"
					>
						{loading ? "Hesaplanıyor..." : "Hemen Çevir"}
					</button>
				</form>

				{/* Sonuç Alanı */}
				{result && result.rates && (
					<div className="mt-6 p-5 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-center relative z-10">
						<p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
							Dönüşüm Sonucu
						</p>
						<div className="text-2xl font-black text-emerald-400 mt-2">
							{amount} {fromCurrency} = {result.rates[toCurrency]}{" "}
							{toCurrency}
						</div>
						<div className="mt-3 pt-3 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-500">
							<span>Güncelleme: {result.date}</span>
							<span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
								Canlı Kur
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
