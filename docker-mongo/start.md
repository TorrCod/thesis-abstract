# How to run local Mongodb in Docker
## install docker
install docker in https://docs.docker.com/get-docker/ 

## Start devoloping
run the command `npm run thesis`

# Documentation
## Run mongodb
go to directory `cd docker-mongo`
run mongodb `docker-compose up -d`

## Import default data to mongodb
make directory in mongodb container `docker exec -it mongodb mkdir /database/`
copying data from local machine to mongodb container directory `docker cp ./default-data mongodb:/database/default-data`
import data to mongodb `docker-compose exec mongodb mongorestore --drop /database/default-data`

## Saving the data to default-data
exporting mongodb data to docker container directory `docker-compose exec mongodb mongodump --out=/database/default-data`
copying data from mongodb container directory to local machine `docker cp mongodb:/database/default-data ./default-data`

## Run the development server in local machine
run development next app `npm run dev`

# Step by step to use mongodb in docker

## Run mongodb
go to directory `cd docker-mongo`
run mongodb `docker-compose up -d`

## Import default data to mongodb
make directory in mongodb container `docker exec -it mongodb mkdir /database/`
copying data from local machine to mongodb container directory `docker cp ./default-data mongodb:/database/default-data`
import data to mongodb `docker-compose exec mongodb mongorestore --drop /database/default-data`

## Run the development server in local machine (not in docker)
run development next app `npm run dev`
