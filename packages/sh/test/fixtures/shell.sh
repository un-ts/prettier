#!/bin/bash
NAME=    "ufc-web-client"

git     pull

echo 'start build docker image.'
docker    build -t ${NAME}:latest -f ./scripts/docker/Dockerfile .

echo 'stop and remove the current container.'
docker    container stop ${NAME}
docker container rm ${NAME}

echo 'run a new container.'
docker run -d --restart always     -p 2015:2015 --name ${NAME} ${NAME}:latest
