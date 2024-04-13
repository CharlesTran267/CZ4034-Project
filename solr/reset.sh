#!/bin/bash

docker stop solr_container
docker rm solr_container
docker rmi solr_image
docker build -t solr_image -f solr/Dockerfile .
docker run -d --name solr_container -p 8983:8983 solr_image
docker exec solr_container /entrypoint.sh
