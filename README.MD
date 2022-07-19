# Auth API

### Run in Docker

Run `docker-compose up`

### Run tests in Docker

Run `docker-compose -f docker-compose-test.yml up`

### Running locally

1. Install PostgreSQL and Node.JS locally
2. Provide following env variables
   - NODE_ENV
   - DB_HOST
   - DB_PORT
   - DB_USER
   - DB_PASSWORD
   - DB_NAME
   - JWT_SECRET
3. RUN `yarn start`
