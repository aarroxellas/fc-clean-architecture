import CreateProductUseCase from "./create.product.usecase";

const input = {
  type: "a",
  name: "Product 1",
  price: 10,
};

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Create product use case", () => {
  it("should be able to create a product", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);

    const result = await useCase.execute(input);

    const output = {
      id: expect.any(String),
      name: input.name,
      price: input.price,
    };

    expect(result).toEqual(output);
  });

  it("should thrown an error when no name param was passed", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);

    input.name = "";

    await expect(async () => {
      await useCase.execute(input);
    }).rejects.toThrow("Name is required");
  });

  it("should thrown an error when price must be greater than zero", async () => {
    const productRepository = MockRepository();
    const useCase = new CreateProductUseCase(productRepository);

    input.name = "Product 1";
    input.price = -1;

    await expect(async () => {
      await useCase.execute(input);
    }).rejects.toThrow("product: price must be a positive number");
  });
});
