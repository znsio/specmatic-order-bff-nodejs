import specmatic from "specmatic";

import { getApp, startAppServer, stopAppServer } from "./util/app.server.js";
import { config } from "dotenv";
import { readdirSync } from "node:fs";
import path from "node:path";

config();

const kafkaMock = await specmatic.startKafkaMock(process.env.KAFKA_BROKER_PORT);
const httpStub = await specmatic.startHttpStub(process.env.HTTP_STUB_HOST, process.env.HTTP_STUB_PORT);
const appServer = await startAppServer(process.env.APP_PORT);
const excludedEndpoints = "'/health'";
process.env.FILTER = `PATH!=${excludedEndpoints}`;
const test_folder = "test-resources";

readdirSync(test_folder).map(
  async (fileName) => await specmatic.setExpectations(path.join(test_folder, fileName), httpStub.url)
);

await specmatic.setKafkaMockExpectations(kafkaMock, [{ topic: "product-queries", count: 2 }]);

await specmatic.testWithApiCoverage(getApp(), process.env.APP_HOST, process.env.APP_PORT);

const verificationResult = await specmatic.verifyKafkaMock(kafkaMock);
console.log(`Kafka mock verification: ${verificationResult}`);
test("Kafka mock verification", () => expect(verificationResult).toBe(true));
test("Uppercase string", () => expect("Specmatic".toUpperCase()).toBe("SPECMATIC"));

await stopAppServer(appServer);
await specmatic.stopHttpStub(httpStub);
await specmatic.stopKafkaMock(kafkaMock);
