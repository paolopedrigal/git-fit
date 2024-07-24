FROM python:3.10

WORKDIR /fastapi

COPY ./requirements.txt /fastapi/requirements.txt

RUN pip install --no-cache-dir -r /fastapi/requirements.txt

COPY ./main.py /fastapi/main.py

EXPOSE 8000

CMD ["fastapi", "run"]