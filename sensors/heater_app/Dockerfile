FROM python:3

WORKDIR /usr/src/app

COPY sensors/heater_app ./sensors/heater_app
COPY sensors/sensor ./sensors/sensor
COPY sensors/__init__.py ./sensors/__init__.py

RUN pip install --no-cache-dir -r ./sensors/heater_app/requirements.txt

ENV PYTHONPATH /usr/src/app
CMD [ "python", "./sensors/heater_app/simulate_heater.py" ]