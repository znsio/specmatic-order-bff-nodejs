# Specmatic Sample: NodeJS BFF calling Domain API
![tests](https://github.com/znsio/specmatic-order-backend-nodejs/actions/workflows/test.yml/badge.svg)

* [Specmatic Website](https://specmatic.in)
* [Specmatic Documenation](https://specmatic.in/documentation.html)

This sample project demonstrates how we can contract driven development and testing of a BFF in NodeJS by stubbing calls to domain api service using specmatic stub option and domain api OpenAPI spec.

Here is the [contract/open api spec](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.yaml) of the domain api

## Definitions
* BFF: Backend for Front End
* Domain API: API managing the domain model
* Specmatic Stub Server: Create a server that can replace a real service using its open api spec

## Background
A typical web application might look like this. Specmatic can contract driven development and testing of all the three components below. In this sample project, we look how to do this for nodejs BFF which is dependent on Domain API.

![HTML client talks to client API which talks to backend api](specmatic-sample-architecture.svg)
 
_The architecture diagram was created using the amazing free online SVG editor at [Vectr](https://vectr.com)._

### Tech
1. NodeJS + Express
2. Specmatic
3. Specmatic Beta extension for kafka demo
4. Jest & SuperTest

### Start BFF Server
This will start the nodejs based backend api server
```shell
DEBUG=specmatic-order-backend-nodejs:* npm start
```
Access find orders api at http://localhost:8080/findAvailableProducts. This is used for OpenAPI demo
Access email registration api at http://localhost:8080/email. This is used for AsyncAPI demo for kafka
_*Note:* Unless domain api service is running on port 9000, above requests will fail. Move to next section for solution!_

### Start BFF Server with Domain API Stub
This will start the nodejs based BFF server with domain api stubbed to demonstrate workings of stub server
```shell
DEBUG=specmatic-order-backend-nodejs:* npm run startWithStubs
```
Access find orders api again at http://localhost:8080/findAvailableProducts with result like
```json
[{"id":698,"name":"NUBYR","type":"book","inventory":278}]
```
Simillarly you can access email registrations api which connects to the kafka stub

### Run Tests
This will start the specmatic stub server for domain api at port 900 using the information in specmatic.json and run JEST tests to validate BFF apis.
```shell
DEBUG=specmatic-order-backend-nodejs:* npm run test-ci
```
