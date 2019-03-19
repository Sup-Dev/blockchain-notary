# Blockchain API

A SailsJS application

## Getting Started

To setup and run the application please follow the following steps:

### Installing

Run the npm installation command from inside the project directory:

`npm install`


###  the Application

To run the application use the following command

`sails lift --port 8000`


### API Endpoints

+ **GET /block/:id**  - Get the block information for the given height, *:id* should be *numeric*
+ **POST /block**     - Creates a new block, *body* param is required and should be a *string*
