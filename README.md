# Task Manager System


## tech stack

- Node.js
- Express.js
- Mysql (Prisma ORM)

## Installation

Before you begin, make sure you have Node.js and npm installed on your system.

1. Clone this repository to your local machine:

```sh
   git clone https://github.com/diliptadha/nodejs-task
```

2. Navigate to the project directory:

```sh
   cd nodejs-task
 ```

3. Rename the `env_example` file to `.env` and update the values in it:

```sh
   mv env_example .env
  ```

for easy testing purpose my database url is

```sh 
mysql://root:[d_d&zyX@34.131.3.124/mydb?schema=public
```
i will delete it after interview


## Running the Server

Once you have configured the `.env` file, you can start the server by running:

```sh
npm run start
```

This will install the necessary dependencies and start the server on the specified port.

## view database in browser

```sh
npx prisma studio
```


## API Documentation

The API documentation is available at `postman-collection.json`. 