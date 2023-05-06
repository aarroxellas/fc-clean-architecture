import { app, sequelize } from "../express";
import request from "supertest";

describe("Product E2E", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("Should be able to create a product", async () => {
    await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Product 1",
        price: 10,
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .then((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toBe("Product 1");
        expect(res.body.price).toBe(10);
      })
      .catch((err) => {
        expect(err).toBeUndefined();
      });
  });

  it("Should foward server error while creating product with incomplete payload", async () => {
    await request(app)
      .post("/product")
      .send({
        price: 10,
      })
      .expect("Content-Type", /json/)
      .expect(500)
      .catch((err) => {
        expect(err).toBeDefined();
      });
  });

  it("Should list all products", async () => {
    await request(app)
      .post("/product")
      .send({
        type: "a",
        name: "Product 1",
        price: 10,
      })
      .expect(201);

    await request(app)
      .post("/product")
      .send({
        type: "b",
        name: "Product 2",
        price: 20,
      })
      .expect(201);

    await request(app)
      .get("/product")
      .send()
      .expect(200)
      .then((res) => {
        expect(res.body.products.length).toBe(2);
        expect(res.body.products[0].name).toBe("Product 1");
        expect(res.body.products[0].price).toBe(10);
        expect(res.body.products[1].name).toBe("Product 2");
        expect(res.body.products[1].price).toBe(40);
      });
  });
});
