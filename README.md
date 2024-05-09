# SSDWebsite

# To run API server:

* cd into ssd-api
* run ```node server.js```

# API endpoints:

To use any end points first hit base_url/auth sending bearer_Token in headers.
This will return a jwt token which is needed for all other calls. This should be added in headers with key Authorization.

* **GET** /auth
  - exchanges github token for JWT

* **GET** /api/questions
  - returns all questions
* **GET** /api/users 
  - returns user information
* **GET** /api/users/all - Returns all users information
* **Put** /api/users/update - Updates user and returns updated user
    
    body:

        {
            "email": "",
            "username": "",
            "gender": "",
            "sexuality": "",
            "age": ""
        }
    
* **GET** /api/answers/ - Returns the current users answer to the requested question
    
    body:
    
        {
            "question_id": ""
        }

* **GET** /api/answers/all - Returns all of the current users answers
* **POST** /api/answers/create
    
    body:
    
        {
            "answer": "",
            "question_id": ""
        }