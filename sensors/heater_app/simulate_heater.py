import sensors.sensor as sensor
from sensors import Variable

if __name__ == '__main__':

    watts = Variable(
            name='wattage',
            a=3,
            b=1500,
            variance=10,
            limit=2000
    )

    temps = Variable(
        name='temperature',
        a=-0.01,
        b=22,
        variance=0.1,
        limit=20
    )

    # create heater sensor and run it
    heater = sensor.Sensor('heater', [watts, temps])
    heater.run_simulation()
