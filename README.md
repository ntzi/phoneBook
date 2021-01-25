# Phone Book API

An API that will serve as the backend for a phone book app, providing a list of people and their contact details.

## Deploy
### Prerequisites
  - Node.js

### Steps
  - Clone master branch

        $ git clone https://github.com/ntzi/phoneBook.git

  - Install

        $ npm install

  - Set up env variables
    - For local deployment <br>
      Create a `config/local.js` file following the example `config/local.example.js`
    - For cloud deployment <br>
      Create env parameters following the `config/custom.js` file.
      For example create `DB_URI`, `DB_URI_MOCK`, `JWT_SECRET_KEY`, etc

## Run
  - Start the server

        $ npm start

  - **Register** a new user
    
    Eg POST request: http://localhost:1337/user/register
        
    Body (JSON):
      
        {
            "email": "user@example.com",
            "password": "password",
            "confirmPassword": "password",
            "name": "user"
        }

    Eg response:

        {
            "success": true,
            "message": "New user created. Email: user@example.com",
            "data": {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMGVkZTc5MTU0ZjQ3ODFiNDRhZGFhYSIsImlhdCI6MTYxMTU4NzE5MywiZXhwIjoxNjE0MTc5MTkzfQ.EPwDDYgesycHqcofiEC1Q6DVc-aDaLTRjMhg650dOLE"
            }
        }

  - or **Login** as an existing user

    Eg POST request: http://localhost:1337/user/login
  
    Body (JSON): 
    
        {
            "email": "user@example.com",
            "password": "password"
        }

  **Use `token` to authenticate the rest of the endpoints**

  - Add a new contact.
    
    Eg POST request: http://localhost:1337/api/v1/contact/add
    
    Headers: <br>
      token: `token`
    
    Body (JSON):
      
        {
          "name": "Nikos",
          "email": "nikos@example.com",
          "address": "myAddress",
          "phone": {
            "home": 73406891262,
            "work": 90347601124,
            "mobile": 13904876134,
            "other": 13904756103
          }
        }


  -  **Delete** a contact. <br>
    Eg DELETE request: http://localhost:1337/api/v1/contact?name=Nikos
    
    Headers: <br>
      token: `token`

  - **Update** a record. <br>
    Eg PUT request: http://localhost:1337/api/v1/contact?name=Nikos
    
    Headers: <br>
      token: `token`
    
    Body (JSON):
      
        {
          "name": "Nikos2",
          "email": "newEmail@example.com",
          "address": "newAddress",
          "phone": {
            "home": 73406891262,
            "work": 90347601124,
            "mobile": 13904876134,
            "other": 13904756103
          }
        }

  - **Find One** contact record. <br>
    Eg GET request: http://localhost:1337/api/v1/contact?name=Nikos
    
    Headers: <br>
      token: `token`

  - **Find All** contacts. <br>
    Return contacts sorted by key (name, address, createdAt, etc) and in order (asc, desc). <br>
    Eg GET request: http://localhost:1337/api/v1/contact/list?key=name&order=asc
    
    Headers: <br>
      token: `token`

    Pagination is supported for the response data. <br>
    A link for the next and previous page will be added to response. <br>
    When the response doesn't contain a link to the next page of results, you know that you've reached the end. <br>
    Eg response: 
      
        "_links": {
          "prev": "/api/v1/contact/list?key=createdAt&order=asc&limit=3&start=3",
          "next": "/api/v1/contact/list?key=createdAt&order=asc&limit=3&start=9"
        },
        ...
    

## Test

### Prerequisites

* mocha


### Run tests

    npm test



# Notes
## TODO
  - Authentication

    Basic JWT is used for authentication. Should be improved using to oAuth2 or something equevalent.

  - Update Endpoint
    
    Can not update an existing record by sending only the changed parameters. <br>
    One should send all the contact details including the non-changed.

  - Cache Memory
    
    Set up to use Redis cache memory when deployed (in production)


 ## Authors
 
 * **Nikos Tziralis** - *Initial work* - [Phone Book](https://github.com/ntzi/phoneBook)
    - [GitHub](https://github.com/ntzi)
    - [Email](mailto:ntziralis@gmail.com)
    - [LinkedIn](https://www.linkedin.com/in/nikos-tziralis/)