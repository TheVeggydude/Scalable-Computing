import sensors.sensor as sensor
from sensors import Variable

if __name__ == '__main__':

    watts = Variable(
            name='wattage',
            a=0.3,
            b=150,
            variance=1,
            limit=200
    )

    suction = Variable(
        name='suction',
        a=-0.005,
        b=100,
        variance=1,
        limit=80
    )

    # create heater sensor and run it
    vacuum = sensor.Sensor('vacuum', [watts, suction])
    vacuum.run_simulation()
