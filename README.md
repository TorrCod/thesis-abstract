# How to run local Mongodb in Docker
## install docker
install docker in https://docs.docker.com/get-docker/ 

## Start developing
run the command `npm run thesis`

# Documentation
### Run mongodb
go to directory `cd docker-mongo`

run mongodb `docker-compose up -d`

### Import default data to mongodb
make directory in mongodb container `docker exec -it mongodb mkdir /database/`

copying data from local machine to mongodb container directory `docker cp ./default-data mongodb:/database/default-data`

import data to mongodb `docker-compose exec mongodb mongorestore --drop /database/default-data`

### Saving the data to default-data
exporting mongodb data to docker container directory `docker-compose exec mongodb mongodump --out=/database/default-data`

copying data from mongodb container directory to local machine `docker cp mongodb:/database/default-data ./default-data`

### Run the development server in local machine
run development next app `npm run dev`

# Step by step to use mongodb in docker

### Run mongodb
go to directory `cd docker-mongo`

run mongodb `docker-compose up -d`

### Import default data to mongodb
make directory in mongodb container `docker exec -it mongodb mkdir /database/`

copying data from local machine to mongodb container directory `docker cp ./default-data mongodb:/database/default-data`

import data to mongodb `docker-compose exec mongodb mongorestore --drop /database/default-data`

### Run the development server in local machine (not in docker)

go back to main directory `cd ..`

run development next app `npm run dev`

# Thesis Abstract Management System for College of Engineering
The Thesis Abstract Management System for College of Engineering is a web-based platform designed to streamline the process of managing thesis abstracts for students, professors, and administrators in the College of Engineering.

## Features
- User-friendly interface for submitting, viewing, and editing thesis abstracts.
- Customizable approval workflows for thesis abstracts.
- Advanced search functionality for finding and sorting thesis abstracts by various criteria.
- Integration with the College of Engineering's existing student and faculty databases.
## Benefits
- Simplifies and speeds up the thesis abstract submission process for students and professors.
- Reduces the administrative workload for the College of Engineering's staff.
- Provides greater visibility and transparency for the approval process.
- Enables more effective tracking and reporting of thesis abstract submissions.
## Conclusion
Overall, the Thesis Abstract Management System for College of Engineering represents a significant improvement over the manual processes previously used for managing thesis abstracts. Its user-friendly interface, customizable approval workflows, and advanced search functionality make it an invaluable tool for students, professors, and administrators alike.