# Specmatic Sample: NodeJS BFF calling Domain API
![tests](https://github.com/znsio/specmatic-order-backend-nodejs/actions/workflows/test.yml/badge.svg)

* [Specmatic Website](https://specmatic.in)
* [Specmatic Documenation](https://specmatic.in/documentation.html)

This sample project demonstrates how we can practice contract driven development and also do contract testing of a BFF in NodeJS by using specmatic to stub calls to domain API service purely based on its OpenAPI spec.

Here is the [contract/OpenAPI spec](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/API_order_v1.yaml) of the domain API

## Definitions
* BFF: Backend for Front End
* Domain API: API managing the domain model
* Specmatic Stub Server: Create a server that can act as a real service using its OpenAPI spec

## Background
A typical web application might look like this. We can use Specmatic to practice contract driven development and also test all the three components below. In this sample project, we look how to do this for nodejs BFF which is dependent on Domain API.

![HTML client talks to client API which talks to backend API](specmatic-sample-architecture.svg)
 
_The architecture diagram was created using the amazing free online SVG editor at [Vectr](https://vectr.com)._

### Tech
1. NodeJS + Express
2. Specmatic
3. Specmatic Beta extension for kafka stubbing
4. Jest & SuperTest

### Start BFF Server
This will start the nodejs based backend API server
```shell
DEBUG=specmatic-order-backend-nodejs:* npm start
```
Access find orders API at http://localhost:8080/findAvailableProducts. This is used for OpenAPI demo
Access email registration API at http://localhost:8080/email. This is used for AsyncAPI demo for kafka
_*Note:* Unless domain API service is running on port 9000, above requests will fail. Move to next section for solution!_

### Start BFF Server with Domain API Stub
This will start the nodejs based BFF server with domain API stubbed to demonstrate workings of stub server
```shell
DEBUG=specmatic-order-backend-nodejs:* npm run startWithStubs
```
Access find orders API again at http://localhost:8080/findAvailableProducts with result like
```json
[{"id":698,"name":"NUBYR","type":"book","inventory":278}]
```
Similarly you can access email registrations API which connects to the kafka stub

### Run Tests
This will start the specmatic stub server for domain API at port 9000 using the information in specmatic.json and run JEST tests to validate BFF APIs.
```shell
DEBUG=specmatic-order-backend-nodejs:* npm run test-ci
```

### Run Tests with coverage
Use the following command
```shell
DEBUG=specmatic-order-backend-nodejs:* npm test contract-ide
```