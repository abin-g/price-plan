const { read, store, averageReading } = require("./readings-controller");
const { readingsData } = require("./readings.data");
const { readings } = require("./readings");
const { meters } = require("../meters/meters");

describe("readings", () => {
    it("should get readings with meter id from params", () => {
        const { getReadings } = readings(readingsData);
        const readingsForMeter = read(getReadings, {
            params: {
                smartMeterId: meters.METER0,
            },
            query: {
                startTime: '',
                endTime: '',
                minReading: '',
                maxReading: 'm'
            }
        });

        expect(readingsForMeter).toEqual(readingsData[meters.METER0]);
    });

    it("should store readings with meter id and readings from body", () => {
        const { setReadings, getReadings } = readings(readingsData);

        const originalLength = getReadings(meters.METER0).length;

        const fixture = {
            smartMeterId: meters.METER0,
            electricityReadings: [
                {
                    time: 981438113,
                    reading: 0.0503,
                },
                {
                    time: 982087047,
                    reading: 0.0213,
                },
            ],
        };

        store(setReadings, {
            body: fixture,
        });

        const newLength = getReadings(meters.METER0).length;

        expect(originalLength + 2).toEqual(newLength);
    });

    if ("get the average reading for the specific meter based on start and end date", () => {
        const { getReadings } = readings(readingsData);

        const getAverageReading = read(getReadings, {
            params: {
                smartMeterId: meters.METER1,
            },
            query: {
                startTime: "1607682525",
                endTime: "1607686125"
            }
        });

        expect(getAverageReading.smartMeterid).toBe(meters.METER1);

    });
});
