// Datos de los hoteles
const hotels = {
  Lakewood: {
    name: "Lakewood",
    rating: 3,
    rates: {
      weekday: { regular: 110, rewards: 80 },
      weekend: { regular: 90, rewards: 80 },
    },
    image: "./assets/img/lakewood.jpeg",
    image1: "./assets/img/lakewood2.jpeg",
    image2: "./assets/img/lakewood3.jpeg",
    image3: "./assets/img/lakewood4.jpg",
  },
  Bridgewood: {
    name: "Bridgewood",
    rating: 4,
    rates: {
      weekday: { regular: 160, rewards: 110 },
      weekend: { regular: 60, rewards: 50 },
    },
    image: "./assets/img/bridgewood.jpeg",
    image1: "./assets/img/bridgewood1.jpeg",
    image2: "./assets/img/bridgewood2.jpeg",
    image3: "./assets/img/bridgewood3.jpeg",
  },
  Ridgewood: {
    name: "Ridgewood",
    rating: 5,
    rates: {
      weekday: { regular: 220, rewards: 100 },
      weekend: { regular: 150, rewards: 40 },
    },
    image: "./assets/img/ridgewood.jpeg",
    image1: "./assets/img/ridgewood1.jpeg",
    image2: "./assets/img/ridgewood2.jpeg",
    image3: "./assets/img/ridgewood3.jpeg",
  },
};

// Función para determinar si una fecha es día de semana o fin de semana
function getDayType(date) {
  const day = new Date(date).getUTCDay(); // Usar getUTCDay para evitar problemas de zona horaria
  return day === 0 || day === 6 ? "weekend" : "weekday";
}

// Función para calcular el costo total de una reserva
function calculateTotalCost(hotel, customerType, dates) {
  let totalCost = 0;

  dates.forEach((date) => {
    const dayType = getDayType(date);
    totalCost += hotel.rates[dayType][customerType];
  });

  return totalCost;
}

// Función para encontrar el hotel más barato
function findHotelsWithPrices(customerType, dates) {
  const hotelsWithPrices = [];

  for (const hotelKey in hotels) {
    const hotel = hotels[hotelKey];
    const totalCost = calculateTotalCost(hotel, customerType, dates);
    hotelsWithPrices.push({ ...hotel, totalCost });
  }

  // Ordenar los hoteles por costo total (ascendente) y calificación (descendente) en caso de empate
  hotelsWithPrices.sort(
    (a, b) => a.totalCost - b.totalCost || b.rating - a.rating
  );

  return hotelsWithPrices;
}

// Función para mostrar información de los hoteles
function displayHotelInfo() {
  const hotelInfoDiv = document.getElementById("hotelInfo");
  hotelInfoDiv.innerHTML = "";
  for (const hotelKey in hotels) {
    const hotel = hotels[hotelKey];
    hotelInfoDiv.innerHTML += `
            <div class="hotel-card">
              <div class="hotel-info">
                <h3>${hotel.name}</h3>
                <p>Calificación: ${"⭐".repeat(hotel.rating)}</p>
                <p>Tarifas:</p>
                <ul>
                    <li>Días de semana (Regular): $${
                      hotel.rates.weekday.regular
                    }</li>
                    <li>Días de semana (Recompensas): $${
                      hotel.rates.weekday.rewards
                    }</li>
                    <li>Fines de semana (Regular): $${
                      hotel.rates.weekend.regular
                    }</li>
                    <li>Fines de semana (Recompensas):$${
                      hotel.rates.weekend.rewards
                    } </li>
                </ul>
            </div>
                <div class="carousel">
                 <div class="carousel-wrapper">
                    <div class="carousel-item"><img src="${
                      hotel.image
                    }" alt="Imagen 1"></div>
                   <div class="carousel-item"><img src="${
                     hotel.image1
                   }" alt="Imagen 2"></div>
                   <div class="carousel-item"><img src="${
                     hotel.image2
                   }" alt="Imagen 3"></div>
                   <div class="carousel-item"><img src="${
                     hotel.image3
                   }" alt="Imagen 4"></div>
                  
               </div>
         </div>
             
        `;
  }
}

//  formulario de envío
document
  .getElementById("hotelForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const customerType = document.getElementById("customerTypeToggle").checked
      ? "rewards"
      : "regular";
    const dates = document
      .getElementById("dates")
      ._flatpickr.selectedDates.map((date) => date.toISOString().split("T")[0]);

    if (dates.length === 0) {
      alert("Por favor, selecciona al menos una fecha.");
      return;
    }
    const hotelsWithPrices = findHotelsWithPrices(customerType, dates);
    const cheapestHotel = hotelsWithPrices[0];

    const resultDiv = document.getElementById("result");
    const hotelListDiv = document.getElementById("hotelList");

    if (cheapestHotel) {
      resultDiv.innerHTML = `
       <div class="hotel-card">
            <h2>LA MEJOR OFERTA: ${cheapestHotel.name}</h2>
            <p>Calificación: ${"⭐".repeat(cheapestHotel.rating)}</p>
            <p>Costo total: $${cheapestHotel.totalCost}</p>
        </div>
        `;

      hotelListDiv.innerHTML = "<h3>Más opciones para ti</h3>";
      hotelsWithPrices.forEach((hotel) => {
        hotelListDiv.innerHTML += `
                <div class="hotel-card">
                    <h2>${hotel.name}</h2>
                    <p>Calificación: ${"⭐".repeat(hotel.rating)}</p>
                    <p>Costo total: $${hotel.totalCost}</p>
                </div>
            `;
      });
    } else {
      resultDiv.innerHTML = "<p>No se encontró ningún hotel.</p>";
    }
  });

// Inicializar flatpickr
flatpickr("#dates", {
  mode: "multiple",
  dateFormat: "Y-m-d",
  onChange: function (selectedDates) {
    selectedDates.forEach((date) => {
      const day = new Date(date).getUTCDay();
    });
  },
});

// Mostrar información de los hoteles al cargar la página
displayHotelInfo();

// Actualizar el texto del toggle al cambiar su estado
document
  .getElementById("customerTypeToggle")
  .addEventListener("change", function () {
    const toggleLabel = document.querySelector(".toggle-label");
    if (this.checked) {
      toggleLabel.textContent = "Recompensas";
    } else {
      toggleLabel.textContent = "Regular";
    }
  });
