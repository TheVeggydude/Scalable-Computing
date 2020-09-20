FROM python:3

WORKDIR /usr/src/app

COPY sensors/vacuum_app ./sensors/vacuum_app
COPY sensors/sensor ./sensors/sensor
COPY sensors/__init__.py ./sensors/__init__.py

RUN pip install --no-cache-dir -r ./sensors/vacuum_app/requirements.txt

ENV PYTHONPATH /usr/src/app
CMD [ "python", "./sensors/vacuum_app/simulate_vacuum.py" ]