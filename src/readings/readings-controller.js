const { average } = require('../usage/usage');

const read = (getData, req) => {
    const meter = req.params.smartMeterId;
    const { startTime, endTime, minReading, maxReading } = req.query
    const readings = getData(meter);

    const start = startTime ? parseInt(startTime, 10) : undefined;
    const end = endTime ? parseInt(endTime, 10) : undefined;
    const min = minReading ? parseFloat(minReading) : undefined;
    const max = maxReading ? parseFloat(maxReading) : undefined;

    const filterData = readings.filter((r) => {
        const timeMatch = (start === undefined || r.time >= start) && (end === undefined || r.time <= end);
        const readingmatch = (max === undefined || r.reading >= max) && (min === undefined || r.reading <= min);
        return timeMatch && readingmatch
    })

    return filterData;
};

const store = (setData, req) => {
    const data = req.body;
    return setData(data.smartMeterId, data.electricityReadings);
};

const averageReading = (getData, req) => {
    const smartMeterid = req.params.smartMeterId
    const { startTime, endTime } = req.query

    const readings = getData(smartMeterid);
    if (!startTime || !endTime) {
        throw new Error("Please fill all the required fields")
    }
    const start = parseInt(startTime, 10);
    const end = parseInt(endTime, 10);

    const averageConsumption = average(readings.filter((r) => r.time <= start && r.time >= end));


    //Peak Energy Consumption
    const filterData = readings.filter((t) => t.time <= startTime && t.time >= endTime);
    const peakReading = filterData.reduce((max, r) => r.reading > max.reading ? r : max)
    console.log("filterData=>", filterData)

    return {
        smartMeterid,
        startTime: start,
        endTime: end,
        averageConsumption,
        peakReading: {
            time: new Date(peakReading.time * 1000).toISOString(),
            comsumption: peakReading.reading
        }
    };
}

module.exports = { read, store, averageReading };
