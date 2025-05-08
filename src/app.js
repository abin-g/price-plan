const express = require("express");
const { readings } = require("./readings/readings");
const { readingsData } = require("./readings/readings.data");
const { read, store, averageReading } = require("./readings/readings-controller");
const { recommend, compare, generateBilling } = require("./price-plans/price-plans-controller");
const { baiscAuth, authrizeRole } = require('./middleware/basic-auth')

const app = express();

app.use(express.json());
app.use(baiscAuth);

const { getReadings, setReadings } = readings(readingsData);

app.get("/readings/read/:smartMeterId", authrizeRole('user'), (req, res) => {
    res.send(read(getReadings, req));
});

app.post("/readings/store", (req, res) => {
    res.send(store(setReadings, req));
});

app.get("/price-plans/recommend/:smartMeterId", (req, res) => {
    res.send(recommend(getReadings, req));
});

app.get("/price-plans/compare-all/:smartMeterId", (req, res) => {
    res.send(compare(getReadings, req));
});

app.get("/readings/average/:smartMeterId", (req, res) => {
    res.send(averageReading(getReadings, req));
});

app.get("/billing/estimate/:smartMeterId", (req, res) => {
    res.send(generateBilling(getReadings, req));
});

const port = process.env.PORT || 8080;

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: "error",
        message: err.message || "Something went wrong"
    })
})

app.listen(port);

console.log(`🚀 app listening on port ${port}`);
