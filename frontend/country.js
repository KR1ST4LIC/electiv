const code = new URLSearchParams(location.search).get("code");
const container = document.getElementById("country");

fetch(`http://localhost:3000/countries/${code}`)
    .then(res => res.json())
    .then(c => {
        document.title = c.name.common;

        container.innerHTML = `
            <h1>${c.flag} ${c.name.common}</h1>
            <img src="https://flagpedia.net/data/flags/w580/${c.cca2.toLowerCase()}.png" 
                 alt="Flag of ${c.name.common}" class="flag-img">
            <p><strong>Официальное название:</strong> ${c.name.official}</p>
            <p><strong>Регион:</strong> ${c.region} (${c.subregion || ""})</p>
            <p><strong>Столица:</strong> ${c.capital ? c.capital.join(", ") : "—"}</p>
            <p><strong>Население:</strong> ${c.population.toLocaleString()}</p>
            <p><strong>Площадь:</strong> ${c.area.toLocaleString()} км²</p>
            <p><strong>Валюта:</strong> ${Object.values(c.currencies || {}).map(cur => `${cur.name} (${cur.symbol})`).join(", ")}</p>
            <p><strong>Языки:</strong> ${Object.values(c.languages || {}).join(", ")}</p>
        `;

        // Карта
        const map = L.map('map').setView(c.latlng, 6);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        L.marker(c.latlng).addTo(map)
            .bindPopup(c.name.common)
            .openPopup();
    })
    .catch(() => {
        container.innerHTML = "<h2>Страна не найдена</h2>";
    });