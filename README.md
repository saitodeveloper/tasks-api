# Summary

* [Installation](#installation)

# Installation
Considerations, this project was develop under a MacOS sytem and these tools were used:
- node version `v16.16.0`.
- npm version `8.18.0`.
- [Official Node.js install intructions here.](https://nodejs.org/en/download/)
- Docker version `20.10.17`.
- Docker compose version `v2.10.2`.
- [Official Docker Engine install instructions](https://docs.docker.com/engine/install/)

First execute docker compose to install all images needed:
```terminal
$ docker-compose up -d
```

To install all dependencies on the project execute:
```cmd
$ npm install
```

Create a .env file on the root of the project.
```cmd
$ touch .env
```

Create these .env values for test environment.
```environment
ENV=dev
MONGO_URL=mongodb://admin:admin@localhost:27017/
MONGO_DB=tasks_app_test
JWT_KEY=AskToAdmin
```

*strongly* recommend to change the `MONGO_DB` value for manual testing. 

Then to execute all unit and integration tests on the project execute:
```cmd
$ npm run migrate
$ npm test
```

To execute the API:
```cmd
$ npm start
```
