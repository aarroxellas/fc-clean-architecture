import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";


const product = new Product("a", "Product 1", 10);

const MockRepository = () => ({
    create: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
    findAll: jest.fn(),
});


describe("Find product use case", () => {

    it("should be able to find a product", async () => {

        const productRepository = MockRepository();
        const usecase = new FindProductUseCase(productRepository);

        const input = {
            id: "a",
        }

        const result = await usecase.execute(input);

        expect(result).toEqual({
            id: "a",
            name: "Product 1",
            price: 10
        });

    });

    it("should not find a product that was not registered", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
          throw new Error("product not found");
        });
        const usecase = new FindProductUseCase(productRepository);

        const input = {
          id: "a",
        };

        expect(() => {
          return usecase.execute(input);
        }).rejects.toThrow("product not found");
      });

});
