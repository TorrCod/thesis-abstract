go to directory `cd docker-mongo`
run mongodb `docker-compose up`
exporting mongodb data to docker container directory `docker-compose exec mongodb mongodump --out=/database/default-data`
copying data from mongodb container directory to local machine `docker cp mongodb:/database/default-data ./default-data`
copying data from local machine to mongodb container directory `docker cp ./default-data mongodb:/database/default-data`
import data to mongodb `docker-compose exec mongodb mongorestore --drop /database/default-data`
make directory in mongodb container `docker exec -it mongodb mkdir /database/`