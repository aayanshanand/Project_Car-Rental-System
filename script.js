// Initial car data
let cars = [
    { id: 'C001', brand: 'Toyota', model: 'Camry', basePricePerDay: 60.0, isAvailable: true },
    { id: 'C002', brand: 'Honda', model: 'Accord', basePricePerDay: 70.0, isAvailable: true },
    { id: 'C003', brand: 'Mahindra', model: 'Thar', basePricePerDay: 150.0, isAvailable: true }
];

let rentals = [];
let customers = [];

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Refresh the displays
    updateCarList();
    updateRentedCars();
    updateCarSelect();
}

// Update car list display
function updateCarList() {
    const carList = document.getElementById('car-list');
    carList.innerHTML = '';

    cars.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <h3>${car.brand} ${car.model}</h3>
            <div class="car-info">
                <p>ID: ${car.id}</p>
                <p>Price per day: $${car.basePricePerDay}</p>
            </div>
            <span class="status ${car.isAvailable ? 'available' : 'rented'}">
                ${car.isAvailable ? 'Available' : 'Rented'}
            </span>
        `;
        carList.appendChild(carCard);
    });
}

// Update car select options
function updateCarSelect() {
    const carSelect = document.getElementById('carSelect');
    carSelect.innerHTML = '<option value="">Select a car</option>';

    cars.filter(car => car.isAvailable).forEach(car => {
        const option = document.createElement('option');
        option.value = car.id;
        option.textContent = `${car.brand} ${car.model} - $${car.basePricePerDay}/day`;
        carSelect.appendChild(option);
    });
}

// Update rented cars display
function updateRentedCars() {
    const rentedCarsDiv = document.getElementById('rented-cars');
    rentedCarsDiv.innerHTML = '';

    rentals.forEach(rental => {
        const car = cars.find(c => c.id === rental.carId);
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
            <h3>${car.brand} ${car.model}</h3>
            <div class="car-info">
                <p>Customer: ${rental.customer.name}</p>
                <p>Days: ${rental.days}</p>
                <p>Total Price: $${rental.totalPrice}</p>
            </div>
            <button onclick="returnCar('${car.id}')" class="btn return">Return Car</button>
        `;
        rentedCarsDiv.appendChild(carCard);
    });

    if (rentals.length === 0) {
        rentedCarsDiv.innerHTML = '<p>No cars are currently rented.</p>';
    }
}

// Handle rent car form submission
function handleRentCar(event) {
    event.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const carId = document.getElementById('carSelect').value;
    const days = parseInt(document.getElementById('days').value);

    const car = cars.find(c => c.id === carId);
    if (!car || !car.isAvailable) {
        alert('Selected car is not available');
        return;
    }

    const customer = {
        id: `CUS${Date.now()}`,
        name: customerName
    };

    const rental = {
        carId: carId,
        customer: customer,
        days: days,
        totalPrice: car.basePricePerDay * days
    };

    // Update car availability
    car.isAvailable = false;
    
    // Add rental and customer records
    rentals.push(rental);
    customers.push(customer);

    // Reset form
    event.target.reset();

    // Show available cars section
    showSection('available-cars');
}

// Handle car return
function returnCar(carId) {
    const car = cars.find(c => c.id === carId);
    if (car) {
        car.isAvailable = true;
        rentals = rentals.filter(rental => rental.carId !== carId);
        updateCarList();
        updateRentedCars();
        updateCarSelect();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    updateCarList();
    updateRentedCars();
    updateCarSelect();
});