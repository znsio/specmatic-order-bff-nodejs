# Specmatic Sample: NodeJS BFF calling Domain API

* [Specmatic Website](https://specmatic.in)
* [Specmatic Documenation](https://specmatic.in/documentation.html)

This sample project demonstrates how we can contract driven development and testing of a BFF in NodeJS by stubbing calls to domain api service using specmatic stub option using the domain api's OpenAPI spec.

Here is the [contract/open api spec](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.yaml) of the domain api

### Tech
1. NodeJS + Express
2. Specmatic
3. Jest & SuperTest

 
### Start BFF Server
This will start the nodejs based backend api server
```shell
DEBUG=specmatic-order-backend-nodejs:* npm start
```
Access find orders api at http://localhost:8080/findAvailableProducts
_*Note:* Unless domain api service is running on port 9000, above requests will fail. Move to next section for solution!_

### Start BFF Server with Domain API Stub
This will start the nodejs based backend api server with domain api stubbed to demonstrate workings of stub server
```shell
DEBUG=specmatic-order-backend-nodejs:* npm startWithStub
```
Access find orders api at http://localhost:8080/findAvailableProducts with result like
```json
[{"id":698,"name":"NUBYR","type":"book","inventory":278}]
```

### Run Tests
This will start the specmatic stub server for domain api at port 900 using the information in specmatic.json and run JEST tests to validate BFF apis.
```shell
DEBUG=specmatic-order-backend-nodejs:* npm test
```
