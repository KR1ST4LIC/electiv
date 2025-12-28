const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

const countries = JSON.parse(
    fs.readFileSync(path.join(__dirname, "countries.json"), "utf-8")
);

app.get("/countries", (req, res) => {
    res.json(
        countries.map(c => ({
            code: c.cca3,
            name: c.name.common,
            flag: c.flag,
            region: c.region,
            capital: c.capital ? c.capital[0] : "",
            area: c.area,
            population: c.population
        }))
    );
});

app.get("/countries/:code", (req, res) => {
    const country = countries.find(
        c => c.cca3 === req.params.code.toUpperCase()
    );

    if (!country) {
        return res.status(404).json({ error: "Not found" });
    }

    res.json(country);
});

app.listen(3000, () =>
    console.log("Backend: http://localhost:3000")
);
