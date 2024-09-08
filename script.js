let calculationHistory = [];
let chart; // Chart.js grafiğini tutacak değişken

// Atık türlerine göre veri setleri
let wasteDataSets = {
    "Organik Atık": {
        label: "Organik Atık",
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)'
    },
    "Plastik": {
        label: "Plastik",
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)'
    },
    "Kağıt": {
        label: "Kağıt",
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)'
    }
};

// Ay isimlerini almak için bir liste
const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

function calculateEmissions() {
    let wasteType = document.getElementById("waste-type").options[document.getElementById("waste-type").selectedIndex].text;
    let wasteTypeFactor = parseFloat(document.getElementById("waste-type").value);
    let disposalMethodFactor = parseFloat(document.getElementById("disposal-method").value);
    let wasteAmount = parseFloat(document.getElementById("waste-amount").value);

    let errorMessage = document.getElementById("error-message");
    let wasteInput = document.getElementById("waste-amount");

    // Hata mesajlarını temizleme
    errorMessage.textContent = "";
    wasteInput.classList.remove("error");

    // Giriş doğrulama
    if (isNaN(wasteAmount) || wasteAmount <= 0) {
        errorMessage.textContent = "Lütfen geçerli bir atık miktarı girin.";
        wasteInput.classList.add("error");
        document.getElementById("result").classList.remove("show");
        return;
    }

    // Hesaplama
    let emissions = wasteAmount * wasteTypeFactor * disposalMethodFactor;

    // Tarih ve ay bilgisi almak için JavaScript Date nesnesini kullanıyoruz
    let currentDate = new Date();
    let currentMonth = monthNames[currentDate.getMonth()]; // Mevcut ay ismi
    
    // Hesaplama geçmişine ekleme
    calculationHistory.push({
        wasteType: wasteType,
        disposalMethod: document.getElementById("disposal-method").options[document.getElementById("disposal-method").selectedIndex].text,
        wasteAmount: wasteAmount,
        emissions: emissions.toFixed(2),
        month: currentMonth // Hesaplama için ay bilgisi ekleme
    });

    // Atık türüne göre emisyon verisini ilgili veri setine ekleme
    wasteDataSets[wasteType].data.push(emissions.toFixed(2));

    // Sonucun gösterimi
    document.getElementById("result").textContent = "Tahmini Emisyon: " + emissions.toFixed(2) + " kg CO2";
    document.getElementById("result").classList.add("show");

    // Hesaplama geçmişini göster
    showHistory();

    // Grafiği güncelle
    updateChart();
}

function showHistory() {
    let historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "<strong>Hesaplama Geçmişi:</strong><br>";
    calculationHistory.forEach(function(entry, index) {
        historyDiv.innerHTML += (index + 1) + ". Atık Türü: " + entry.wasteType + ", Bertaraf Yöntemi: " + entry.disposalMethod + ", Miktar: " + entry.wasteAmount + " ton, Emisyon: " + entry.emissions + " kg CO2, Ay: " + entry.month + "<br>";
    });
    historyDiv.classList.add("show");
}

function resetForm() {
    document.getElementById("waste-type").selectedIndex = 0;
    document.getElementById("disposal-method").selectedIndex = 0;
    document.getElementById("waste-amount").value = "";
    document.getElementById("result").classList.remove("show");
    document.getElementById("history").classList.remove("show");
    document.getElementById("error-message").textContent = "";
    document.getElementById("waste-amount").classList.remove("error");

    // Grafiği sıfırla
    if (chart) {
        chart.destroy();
    }
}

function updateChart() {
    // Hesaplama geçmişindeki ayları etiket olarak kullanıyoruz
    let labels = calculationHistory.map(function(entry) {
        return entry.month; // Ay bilgilerini etiket olarak kullanıyoruz
    });

    let ctx = document.getElementById('emissionChart').getContext('2d');

    if (chart) {
        chart.destroy();  // Mevcut grafiği güncellemeden önce yok et
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, // Ay bilgilerini grafik etiketlerine ekliyoruz
            datasets: [wasteDataSets["Organik Atık"], wasteDataSets["Plastik"], wasteDataSets["Kağıt"]]
        },
        options: {
            animation: {
                duration: 1500, // Grafik animasyonu süresi
                easing: 'easeOutBounce' // Grafik yüklenme animasyonu
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
