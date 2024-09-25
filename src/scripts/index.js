// Get the form and card content elements
const carContent = document.getElementById('card-content');
const searchForm = document.querySelector('form');
const submitButton = searchForm.querySelector('button[type="submit"]');

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
    const tanggal = new Date();

    
    // Display filtered cars based on the input
    await searchCarContent(tanggal, jumlahPenumpang);
});

// Async function to search and display car content based on filter criteria
async function searchCarContent(tanggal, jumlahPenumpang) {
    carContent.innerHTML = '<h1>Loading...</h1>'; // Show loading message

    
    const data = await getCarData(tanggal, jumlahPenumpang);
    const maxCapacity = Math.max(...data.map(car => car.capacity)); // Find maximum capacity
    if (jumlahPenumpang <= 0 || jumlahPenumpang > maxCapacity) {
        carContent.innerHTML = `<h1 class="text-center">No cars available for the selected criteria</h1>`;
        return;
    }
    
    data.sort((a, b) => a.capacity - b.capacity);

    // Create and display car cards
    let carContentHTML = data.map((car) => {
        // const randomAvailableDate = randomDate(new Date(), new Date(2024, 0, 1), 9, 18);
        // car.availableAt = randomAvailableDate.toISOString(); // Update the car's availableAt with a random date

        return `
            <div class="col-md-4">
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

 

// Async function to fetch and filter car data from cars.json
const getCarData = async (tanggal, jumlahPenumpang) => {
    try {
        const response = await fetch('../src/public/data/cars.json');
        const cars = await response.json();
        console.log(cars)

        // Filter the car data based on user input
        const filteredCars = cars.filter((car) => {
            return car.capacity >= jumlahPenumpang; // Only filter by capacity
        });

        return filteredCars;

    } catch (error) {
        console.error('Error fetching car data:', error);
        return [];
    }
};

// Show all car data initially
searchCarContent('');