FROM --platform=linux/amd64 python:3.9.8 as build

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y build-essential \
    && apt-get install -y libpq-dev \
    && apt-get install -y gettext \
    && apt-get install -y flake8 \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /code

ADD requirements.txt /code

WORKDIR /code

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000

ADD . /code
COPY .env.example /code/.env
