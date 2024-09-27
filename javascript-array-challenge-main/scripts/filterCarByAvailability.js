function filterCarByAvailability(cars) {
  // Sangat dianjurkan untuk console.log semua hal hehe
  console.log(cars);

  // Tempat penampungan hasil
  const result = [];

  // Tulis code-mu disini
  // Menggunakan map untuk memanipulasi setiap data mobil
  cars.map(car => {
    // Jika mobil tersedia, tambahkan ke result
    if (car.available === true) {
      result.push(car);
    }
  });

  // Mengembalikan array mobil yang tersedia
  return result;
}
