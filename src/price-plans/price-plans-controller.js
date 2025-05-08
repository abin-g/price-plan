const { pricePlans } = require("./price-plans");
const { usageForAllPricePlans } = require("../usage/usage");
const { meterPricePlanMap } = require("../meters/meters");

const recommend = (getReadings, req) => {
    const meter = req.params.smartMeterId;
    const pricePlanComparisons = usageForAllPricePlans(pricePlans, getReadings(meter)).sort((a, b) => extractCost(a) - extractCost(b))
    if ("limit" in req.query) {
        return pricePlanComparisons.slice(0, req.query.limit);
    }
    return pricePlanComparisons;
};

const extractCost = (cost) => {
    const [, value] = Object.entries(cost).find(([key]) => key in pricePlans)
    return value
}

const compare = (getData, req) => {
    const meter = req.params.smartMeterId;
    const pricePlanComparisons = usageForAllPricePlans(pricePlans, getData(meter));
    return {
        smartMeterId: req.params.smartMeterId,
        pricePlanComparisons,
    };
};

const generateBilling = (getData, req) => {
    const smartMeterId = req.params.smartMeterId;
    const { month, year, taxRate } = req.query;

    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);
    const taxInt = parseFloat(taxRate);

    const readings = getData(smartMeterId);

    const filterData = readings.filter((r) => {
        const date = new Date(r.time * 1000);
        return date.getUTCMonth() + 1 === monthInt && date.getUTCFullYear() === yearInt;
    });

    const totalUsage = filterData.reduce((acc, r) => acc + r.reading, 0);
    const unitPrice = meterPricePlanMap[smartMeterId].rate;

    const totalPrice = totalUsage * unitPrice;

    const grossTotal = totalPrice + (totalPrice * taxInt)

    return {
        smartMeterId,
        month,
        year,
        grossTotal
    };
}

module.exports = { recommend, compare, generateBilling };
