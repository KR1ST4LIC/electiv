const container = document.getElementById("countries");
const searchInput = document.getElementById("search");
const regionSelect = document.getElementById("region");
const popMin = document.getElementById("popMin");
const popMax = document.getElementById("popMax");
const areaMin = document.getElementById("areaMin");
const areaMax = document.getElementById("areaMax");
const toggleViewBtn = document.getElementById("toggleView");
const toggleThemeBtn = document.getElementById("toggleTheme");

let countries = [];
let isGrid = true;

fetch("http://localhost:3000/countries")
    .then(res => res.json())
    .then(data => {
        countries = data;
        render(countries);
    });

function getAllNames(country) {
    const names = [country.name];
    const translations = country.translations || {};
    Object.values(translations).forEach(t => {
        if (t.common) names.push(t.common);
        if (t.official) names.push(t.official);
    });
    return names.map(n => n.toLowerCase());
}

function filterCountries() {
    const q = searchInput.value.toLowerCase();
    const region = regionSelect.value;
    const minPop = popMin.value ? parseInt(popMin.value) : 0;
    const maxPop = popMax.value ? parseInt(popMax.value) : Infinity;
    const minArea = areaMin.value ? parseInt(areaMin.value) : 0;
    const maxArea = areaMax.value ? parseInt(areaMax.value) : Infinity;

    return countries.filter(c => {
        const matchesSearch = q === "" || getAllNames(c).some(name => name.includes(q));
        const matchesRegion = !region || c.region === region;
        const matchesPop = c.population >= minPop && c.population <= maxPop;
        const matchesArea = c.area >= minArea && c.area <= maxArea;

        return matchesSearch && matchesRegion && matchesPop && matchesArea;
    });
}

function render(list) {
    container.innerHTML = "";
    container.className = isGrid ? "grid" : "table";

    if (isGrid) {
        list.forEach(c => {
            const div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `
                <h3>${c.flag} ${c.name}</h3>
                <p>Регион: ${c.region}</p>
                <p>Столица: ${c.capital || "—"}</p>
                <p>Население: ${c.population.toLocaleString()}</p>
                <p>Площадь: ${c.area.toLocaleString()} км²</p>
                <a href="country.html?code=${c.code}">Подробнее →</a>
            `;
            container.appendChild(div);
        });
    } else {
        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Флаг</th>
                    <th>Название</th>
                    <th>Регион</th>
                    <th>Столица</th>
                    <th>Население</th>
                    <th>Площадь</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${list.map(c => `
                    <tr>
                        <td>${c.flag}</td>
                        <td>${c.name}</td>
                        <td>${c.region}</td>
                        <td>${c.capital || "—"}</td>
                        <td>${c.population.toLocaleString()}</td>
                        <td>${c.area.toLocaleString()}</td>
                        <td><a href="country.html?code=${c.code}">→</a></td>
                    </tr>
                `).join("")}
            </tbody>
        `;
        container.appendChild(table);
    }
}

// События фильтров
searchInput.addEventListener("input", () => render(filterCountries()));
regionSelect.addEventListener("change", () => render(filterCountries()));
popMin.addEventListener("input", () => render(filterCountries()));
popMax.addEventListener("input", () => render(filterCountries()));
areaMin.addEventListener("input", () => render(filterCountries()));
areaMax.addEventListener("input", () => render(filterCountries()));

// Переключение вида
toggleViewBtn.addEventListener("click", () => {
    isGrid = !isGrid;
    toggleViewBtn.textContent = isGrid ? "Таблица" : "Карточки";
    render(filterCountries());
});

// Тема
function applyTheme(theme) {
    if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.body.classList.toggle("dark", prefersDark);
    } else {
        document.body.classList.toggle("dark", theme === "dark");
    }
    localStorage.setItem("theme", theme);
    toggleThemeBtn.textContent = theme === "dark" ? "Светлая" : theme === "light" ? "Тёмная" : "Системная";
}

let currentTheme = localStorage.getItem("theme") || "system";
toggleThemeBtn.addEventListener("click", () => {
    if (currentTheme === "light") currentTheme = "dark";
    else if (currentTheme === "dark") currentTheme = "system";
    else currentTheme = "light";
    applyTheme(currentTheme);
});

applyTheme(currentTheme);