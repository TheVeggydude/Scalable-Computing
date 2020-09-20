import sensors.sensor as sensor
from sensors import Variable

if __name__ == '__main__':
    watts = Variable(
            name='wattage',
            a=0.0625,
            b=40,
            variance=0.1,
            limit=50
    )

    lumen = Variable(
        name='lumen',
        a=-0.625,
        b=500,
        variance=0.1,
        limit=400
    )

    # create heater sensor and run it
    lamp = sensor.Sensor('lamp', [watts, lumen])
    lamp.run_simulation()
