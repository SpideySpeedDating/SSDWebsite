# SSDWebsite

# To run API server:

* cd into ssd-api
* run ```node server.js```

# API endpoints:

To use any end points first hit base_url/auth sending bearer_Token in headers.
This will return a jwt token which is needed for all other calls.

## NB! Authorization header with JWT should be included in all calls

## Updated endpoints
**GET** /auth/
  - exchanges github code for JWT and inserts user if not yet in db
**GET** /auth/verify
  - returns Status 200 if valid
**GET** /api/questions/all
  - returns all questions
**GET** /api/users/
  - returns current user information
**PUT** /api/users/update
  - updates current user information
  - Needs body:{ "email": "", "username": "", "gender": "", "sexuality": "", "age": "" }
**GET** /api/answers/
  - returns current user's answer for specific question
  - Needs body:{ "question_id": "" }
**GET** /api/answers/all
  - returns all current user answers
**GET** /api/answers/random
  - returns all answers and email of 8 or less random users with specific gender
  - Needs body:{ "gender": "", "sexuality": "" }
**POST** /api/answers/create
  - inserts answer into db
  - Needs body:{ "answer": "", "question_id": "" }

Also Hi, you can use docker compose to run our project! Just go into the relevant folder and use `docker compose up`.