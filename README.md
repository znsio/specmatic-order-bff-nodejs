# Specmatic Sample: NodeJS BFF calling Domain API

* [Specmatic Website](https://specmatic.in)
* [Specmatic Documenation](https://specmatic.in/documentation.html)

This sample project demonstrates how we can contract driven development and testing of a BFF in NodeJS by stubbing calls to domain api service using specmatic stub server option using the domain api's OpenAPI spec.

Here is the [contract/open api spec](https://github.com/znsio/specmatic-order-contracts/blob/main/in/specmatic/examples/store/api_order_v1.yaml) of the domain api

### Tech
1. NodeJS + Express
2. Specmatic
3. Jest & SuperTest

 
### Start BFF Server
This will start the nodejs based backend api server
```
npm start
```

### Start BFF Server with Domain API Stub
This will start the nodejs based backend api server with domain api stubbed to demonstrate workings of stub server
```
npm startWithStub
```

### Run Tests
This will start the specmatic stub server for domain api using the information in specmatic.json and run the JEST tests that expects the domain api at port 9000.
```
npm test
```
