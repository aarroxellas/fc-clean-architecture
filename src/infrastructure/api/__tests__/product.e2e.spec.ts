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

  it("should list all products", async () => {
    const response = await request(app).post("/product").send({
      type: "a",
      name: "Product 1",
      price: 10,
    });
    const response2 = await request(app).post("/product").send({
      type: "b",
      name: "Product 2",
      price: 20,
    });

    expect(response.status).toBe(201);
    expect(response2.status).toBe(201);

    const listResponse = await request(app).get("/product").send();
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);

    const product = listResponse.body.products[0];
    const product2 = listResponse.body.products[1];

    expect(product.name).toBe("Product 1");
    expect(product2.name).toBe("Product 2");
  });

  it("should update a product", async () => {
    const product = await request(app).post("/product").send({
      type: "a",
      name: "Product 1",
      price: 10,
    });

    const response = await request(app).put("/product").send({
      id: product.body.id,
      name: "Product 1 updated",
      price: 20,
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1 updated");
    expect(response.body.price).toBe(20);
  });

  it("should find a product", async () => {
    const product = await request(app).post("/product").send({
      type: "a",
      name: "Product 1",
      price: 10,
    });

    const response = await request(app)
      .get(`/product/${product.body.id}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product 1");
    expect(response.body.price).toBe(10);
  });
});
