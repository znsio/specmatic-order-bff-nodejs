const TEST_TIMEOUT_MS = 10 * 60 * 1000; //10 mins (Windows in github CI needs a long timeout as java -jar exec seems to be slow at times)

process.env.KAFKAJS_NO_PARTITIONER_WARNING = 1;

const dotenv = require("dotenv");
dotenv.config();
const specmatic = require("specmatic");
const request = require("supertest");
const app = require("../../src/app.js");

let kafkaMock;
let httpStub;

beforeAll(async () => {
  kafkaMock = await specmatic.startKafkaMock(process.env.KAFKA_BROKER_PORT);
  httpStub = await specmatic.startHttpStub(process.env.HTTP_STUB_HOST, process.env.HTTP_STUB_PORT);
  await specmatic.setHttpStubExpectations("test-resources/stub_products_200.json", httpStub.url);
  await specmatic.setKafkaMockExpectations(kafkaMock, [{ topic: "product-queries", count: 1 }]);
}, TEST_TIMEOUT_MS);

test(
  "findAvailableProducts gives a list of products",
  async () => {
    const res = await request(app)
      .get("/findAvailableProducts?type=gadget")
      .set("pageSize", 10)
      .accept("application/json")
      .expect(200);
    const fileContent = readJsonFile("test-resources/stub_products_200.json");

    const stubBody = fileContent["http-response"].body;
    expect(res.body).toStrictEqual(stubBody);

    const { type, ...message } = stubBody[0];
    await expect(
      specmatic.verifyKafkaStubMessage(kafkaMock, "product-queries", JSON.stringify(message))
    ).resolves.toBeTruthy();

    await expect(specmatic.verifyKafkaStub(kafkaMock)).resolves.toBeTruthy();
  },
  TEST_TIMEOUT_MS
);

afterAll(async () => {
  await specmatic.stopStub(httpStub);
  await specmatic.stopKafkaStub(kafkaMock);
}, TEST_TIMEOUT_MS);

function readJsonFile(stubDataFile) {
  const fs = require("node:fs");
  const data = fs.readFileSync(stubDataFile, "utf8");
  return JSON.parse(data);
}
