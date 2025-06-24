const cars = [
  {
    id: 1,
    name: "Toyota Avanza",
    price: 500000,
    image: "Asset/avanza toyota.jpg",
  },
  {
    id: 2,
    name: "Toyota Kijang Innova",
    price: 700000,
    image: "Asset/kijang inova.jpg",
  },
  {
    id: 3,
    name: "Honda HRV",
    price: 600000,
    image: "Asset/hrv.jpg",
  },
  {
    id: 4,
    name: "Daihatsu Sigra",
    price: 450000,
    image: "Asset/sigra.jpeg",
  },
];

let currentBooking = {
  customerName: "",
  items: [],
  total: 0,
  timestamp: "",
};

function displayCars() {
  const carListElement = document.getElementById("carList");
  carListElement.innerHTML = "";

  cars.forEach((car) => {
    const carCard = document.createElement("div");
    carCard.className = "car-card";
    carCard.innerHTML = `
                    <img src="${car.image}" alt="${car.name}">
                    <div class="checkbox-container">
                        <input type="checkbox" class="car-checkbox" data-id="${car.id}" id="checkbox-${car.id}">
                        <h3><label for="checkbox-${car.id}">${car.name}</label></h3>
                    </div>
                    <p class="price">Rp ${car.price.toLocaleString()} / hari</p>
                    <div class="form-group">
                        <label for="startDate-${car.id}">Tanggal Mulai Sewa</label>
                        <input type="date" id="startDate-${car.id}" class="start-date">
                        <div class="error-message" id="startDateError-${car.id}">Tanggal mulai sewa harus diisi</div>
                    </div>
                    <div class="form-group">
                        <label for="duration-${car.id}">Durasi Sewa (hari)</label>
                        <input type="number" id="duration-${car.id}" class="duration" min="1" value="1">
                        <div class="error-message" id="durationError-${car.id}">Durasi sewa minimal 1 hari</div>
                    </div>
                `;
    carListElement.appendChild(carCard);
  });
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.display = "block";
  const inputElement = document.getElementById(elementId.replace("Error", ""));
  inputElement.classList.add("error");
}

function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  errorElement.style.display = "none";
  const inputElement = document.getElementById(elementId.replace("Error", ""));
  inputElement.classList.remove("error");
}

function showValidationSummary(messages) {
  const validationSummary = document.getElementById("validationSummary");
  if (messages.length > 0) {
    validationSummary.innerHTML = messages.map((msg) => `<li>${msg}</li>`).join("") + "</ul>";
    validationSummary.style.display = "block";
  } else {
    validationSummary.style.display = "none";
  }
}

// Fungsi validasi form
function validateForm() {
  let isValid = true;
  const errorMessages = [];

  const customerName = document.getElementById("customerName").value.trim();
  if (!customerName) {
    showError("customerNameError", "Nama pelanggan harus diisi");
    errorMessages.push("Nama pelanggan harus diisi");
    isValid = false;
  } else {
    hideError("customerNameError");
  }

  const checkboxes = document.querySelectorAll(".car-checkbox:checked");
  if (checkboxes.length === 0) {
    errorMessages.push("Pilih minimal 1 mobil");
    isValid = false;
  }

  checkboxes.forEach((checkbox) => {
    const carId = parseInt(checkbox.getAttribute("data-id"));
    const startDate = document.getElementById(`startDate-${carId}`).value;
    const duration = parseInt(document.getElementById(`duration-${carId}`).value);
    const car = cars.find((c) => c.id === carId);

    if (!startDate) {
      showError(`startDateError-${carId}`, "Tanggal mulai sewa harus diisi");
      errorMessages.push(`Tanggal mulai sewa untuk ${car.name} harus diisi`);
      isValid = false;
    } else {
      hideError(`startDateError-${carId}`);
    }

    if (duration < 1) {
      showError(`durationError-${carId}`, "Durasi sewa minimal 1 hari");
      errorMessages.push(`Durasi sewa untuk ${car.name} minimal 1 hari`);
      isValid = false;
    } else {
      hideError(`durationError-${carId}`);
    }
  });

  showValidationSummary(errorMessages);
  return isValid;
}

// Menghitung total
function calculateTotal() {
  document.querySelectorAll(".error-message").forEach((el) => {
    el.style.display = "none";
  });
  document.querySelectorAll(".error").forEach((el) => {
    el.classList.remove("error");
  });
  document.getElementById("validationSummary").style.display = "none";

  if (!validateForm()) {
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const checkboxes = document.querySelectorAll(".car-checkbox:checked");

  currentBooking = {
    customerName: customerName,
    items: [],
    total: 0,
    timestamp: "",
  };

  checkboxes.forEach((checkbox) => {
    const carId = parseInt(checkbox.getAttribute("data-id"));
    const car = cars.find((c) => c.id === carId);
    const startDate = document.getElementById(`startDate-${carId}`).value;
    const duration = parseInt(document.getElementById(`duration-${carId}`).value);

    const subtotal = car.price * duration;

    currentBooking.items.push({
      carId: car.id,
      carName: car.name,
      pricePerDay: car.price,
      startDate: startDate,
      duration: duration,
      subtotal: subtotal,
    });

    currentBooking.total += subtotal;
  });

  displaySummary();
}

// Menampilkan ringkasan
function displaySummary() {
  const summaryElement = document.getElementById("summary");
  const summaryItemsElement = document.getElementById("summaryItems");
  const totalPriceElement = document.getElementById("totalPrice");
  const saveBtn = document.getElementById("saveBtn");

  summaryItemsElement.innerHTML = "";

  currentBooking.items.forEach((item) => {
    const summaryItem = document.createElement("div");
    summaryItem.className = "summary-item";
    summaryItem.innerHTML = `
                    <span>${item.carName} (${item.duration} hari @ Rp ${item.pricePerDay.toLocaleString()})</span>
                    <span>Rp ${item.subtotal.toLocaleString()}</span>
                `;
    summaryItemsElement.appendChild(summaryItem);
  });

  totalPriceElement.textContent = `Total: Rp ${currentBooking.total.toLocaleString()}`;
  summaryElement.style.display = "block";
  saveBtn.style.display = "inline-block";
}

// Menyimpan pemesanan
function saveBooking() {
  if (currentBooking.items.length === 0) {
    return;
  }

  const now = new Date();
  currentBooking.timestamp = now.toLocaleString();

  let bookings = JSON.parse(localStorage.getItem("carRentals")) || [];

  bookings.push(currentBooking);

  localStorage.setItem("carRentals", JSON.stringify(bookings));

  document.getElementById("customerName").value = "";
  document.querySelectorAll(".car-checkbox").forEach((cb) => (cb.checked = false));
  document.querySelectorAll(".start-date").forEach((input) => (input.value = ""));
  document.querySelectorAll(".duration").forEach((input) => (input.value = "1"));
  document.getElementById("summary").style.display = "none";
  document.getElementById("saveBtn").style.display = "none";

  displayBookings();

  const validationSummary = document.getElementById("validationSummary");
  validationSummary.innerHTML = '<strong style="color: #2a6496;">Pemesanan berhasil disimpan!</strong>';
  validationSummary.style.display = "block";
  validationSummary.style.backgroundColor = "#e9f7ef";

  setTimeout(() => {
    validationSummary.style.display = "none";
  }, 3000);
}

// Menampilkan riwayat pemesanan
function displayBookings() {
  const bookingListElement = document.getElementById("bookingList");
  bookingListElement.innerHTML = "";

  const bookings = JSON.parse(localStorage.getItem("carRentals")) || [];

  if (bookings.length === 0) {
    bookingListElement.innerHTML = "<p>Belum ada riwayat pemesanan.</p>";
    return;
  }

  bookings.reverse().forEach((booking, index) => {
    const bookingCard = document.createElement("div");
    bookingCard.className = "booking-card";
    bookingCard.innerHTML = `
                    <h3>Pemesanan oleh ${booking.customerName}</h3>
                    <p class="timestamp">${booking.timestamp}</p>
                    <hr>
                    ${booking.items
                      .map(
                        (item) => `
                        <p>${item.carName} - ${item.duration} hari (${item.startDate}) - Rp ${item.subtotal.toLocaleString()}</p>
                    `
                      )
                      .join("")}
                    <p><strong>Total: Rp ${booking.total.toLocaleString()}</strong></p>
                    <button class="delete-btn" data-index="${bookings.length - 1 - index}">Hapus</button>
                `;
    bookingListElement.appendChild(bookingCard);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      deleteBooking(index);
    });
  });
}

function deleteBooking(index) {
  let bookings = JSON.parse(localStorage.getItem("carRentals")) || [];

  if (index >= 0 && index < bookings.length) {
    if (confirm("Apakah Anda yakin ingin menghapus pemesanan ini?")) {
      bookings.splice(index, 1);
      localStorage.setItem("carRentals", JSON.stringify(bookings));
      displayBookings();
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  displayCars();
  displayBookings();

  document.getElementById("calculateBtn").addEventListener("click", calculateTotal);
  document.getElementById("saveBtn").addEventListener("click", saveBooking);

  document.getElementById("customerName").addEventListener("input", function () {
    if (this.value.trim()) {
      hideError("customerNameError");
    }
  });
});
