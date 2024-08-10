var map = L.map('map').setView([10.697242470460301, -71.61052595043516], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([10.697446418155486, -71.61178870123551]).addTo(map)
    .bindPopup('Ferro Caribe <br> <a href="#ferreteria">Catálogo</a> ')
    .openPopup();
