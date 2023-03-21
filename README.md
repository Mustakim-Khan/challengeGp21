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
$ apt-get install acl
$ php bin/console lexik:jwt:generate-keypair
$ setfacl -R -m u:www-data:rX -m u:"$(whoami)":rwX config/jwt
$ setfacl -dR -m u:www-data:rX -m u:"$(whoami)":rwX config/jwt
```
> Go to : http://localhost:8000/api

### Front
```bash
$ docker compose exec front /bin/sh
$ npm install && npm run dev
```
> Go to : http://localhost:8001