# Challenge Groupe 21

## Installation

```bash 
$ docker compose up -d --build
```
Install the dependencies in front and back in the container docker

### Back 
```bash
$ docker compose exec back /bin/bash
$ composer install
$ php bin/console d:m:m
$ php bin/console d:f:l
$ php bin/console lexik:jwt:generate-keypair
```

### Front
```bash
$ docker compose exec front /bin/sh
$ npm install
$ npm run dev
```

## Usage

### Run Front
```bash
$ npm run dev
```