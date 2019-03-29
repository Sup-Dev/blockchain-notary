# Blockchain Notary

A SailsJS application to handle star notary data

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
+ **GET /stars/hash:hash**  - Get the block data for the given hash, *:hash* should be a *string*
+ **GET /stars/address:address**    - Get the blocks for the given address, *:address* should be a *string*
+ **POST /requestValidation**   - Validation request for an address in the mempool, requires *(address)* in the POST body
+ **POST /message-signature/validate**  - Validates message signature, requires *(address, signature)* in the POST body