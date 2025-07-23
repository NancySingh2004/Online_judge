FROM python:3.10-slim

WORKDIR /usr/src/app

COPY main.py .
COPY input.txt .

CMD ["bash", "-c", "python3 main.py < input.txt"]
