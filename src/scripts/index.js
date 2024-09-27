// Get the form and card content elements
const carContent = document.getElementById('card-content');
const searchForm = document.querySelector('form');
const submitButton = searchForm.querySelector('button[type="submit"]');

// Store cars with random dates
let carsWithRandomDates = [];

// Function to check the form validity and update the button state
function updateButtonState() {
    const isFormValid = searchForm.checkValidity(); // Check if the form is valid
    submitButton.disabled = !isFormValid; // Disable or enable the button
}

// Event listeners for input changes
searchForm.addEventListener('input', updateButtonState);

// Event listener for form submission
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Fetch user inputs
    const jumlahPenumpang = parseInt(document.getElementById('jumlahPenumpang').value) || 1; // Default to 1 passenger if empty
    const tanggalInput = document.getElementById('tanggal').value; // Get date from user input
    const tanggal = new Date(tanggalInput); // Convert String input to Object

    // Display filtered cars based on the input
    await searchCarContent(tanggal, jumlahPenumpang);
});

// Async function to search and display car content based on filter criteria
async function searchCarContent(tanggal, jumlahPenumpang) {
    carContent.innerHTML = '<h1>Loading...</h1>'; // Show loading message

    const data = await getCarData(); // Fetch car data
    const filteredData = data.filter(car => {
        const availableAt = new Date(car.availableAt); // Convert availableAt to Date object
        return jumlahPenumpang <= car.capacity && availableAt.getTime() === tanggal.getTime(); // Show cars available on the selected date or after
    });

    // Check if there are filtered cars
    if (filteredData.length === 0) {
        carContent.innerHTML = `<h1 class="text-center">No cars available for the selected criteria</h1>`;
        return;
    }

    filteredData.sort((a, b) => a.capacity - b.capacity);

    // Create and display car cards
    let carContentHTML = filteredData.map((car) => {
        return `
            <div class="col-md-4" data-aos="fade-up" data-aos-duration="1000">
                <div class="card shadow-sm h-100">
                    <img src="${car.image}" class="card-img-top" alt="Car Image" style="height:250px; width: 100%; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${car.manufacture} ${car.model}</h5>
                        <h5 class="text-success">Rp ${car.rentPerDay.toLocaleString('id-ID')} / hari</h5>
                        <p class="card-text">${car.description}</p>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <i class="bi bi-people me-2"></i> ${car.capacity} orang
                        </li>
                        <li class="list-group-item">
                            <i class="bi bi-gear me-2"></i> ${car.transmission}
                        </li>
                        <li class="list-group-item">
                            <i class="bi bi-calendar me-2"></i> Tahun ${car.year}
                        </li>
                    </ul>
                    <div class="card-body">
                        <a href="#" class="btn btn-success w-100">Pilih Mobil</a>
                    </div>
                </div>
            </div>
        `;
    }).join(''); // Join the array of HTML strings into one

    carContent.innerHTML = carContentHTML;
}

// Async function to fetch car data from cars.json and assign random dates if necessary
const getCarData = async () => {
    // Check if cars data with random dates already exists
    if (carsWithRandomDates.length > 0) {
        return carsWithRandomDates; // Return already fetched cars
    }

    try {
        const response = await fetch('../src/public/data/cars.json');
        const cars = await response.json();

        // Function to generate random available date
        const randomDate = (start, end) => {
            const randomTime = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            return randomTime.toISOString().split('T')[0]; // Format to YYYY-MM-DD
        };
        console.log(cars)
        // Set today's date
        const today = new Date();
        // Set 2 weeks from now (14 days)
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(today.getDate() + 14);

        // Assign random available date to each car
        const updatedCars = cars.map(car => {
            car.availableAt = randomDate(today, twoWeeksLater);
            return car;
        });

        // Store cars with their random dates
        carsWithRandomDates = updatedCars;

        return carsWithRandomDates;

    } catch (error) {
        console.error('Error fetching car data:', error);
        return [];
    }
};

// Show all car data initially
carContent.innerHTML = '<h1 class="text-center">Welcome! Please search for available cars</h1>'; // Initial message
