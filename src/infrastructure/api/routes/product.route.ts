import express, { Request, Response } from "express";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import FindProductUseCase from "../../../usecase/product/find/find.product.usecase";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import UpdateProductUseCase from "../../../usecase/product/update/update.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, resp: Response) => {
  const createProductUseCase = new CreateProductUseCase(
    new ProductRepository(),
  );

  try {
    const productDto = {
      type: req.body.type,
      name: req.body.name,
      price: req.body.price,
    };

    const output = await createProductUseCase.execute(productDto);

    resp.status(201).send(output);
  } catch (error) {
    resp.status(500).send(error);
  }
});

productRoute.get("/", async (_: Request, resp: Response) => {
  const listProductUseCase = new ListProductUseCase(new ProductRepository());

  try {
    const output = await listProductUseCase.execute();
    resp.status(200).send(output);
  } catch (error) {
    resp.status(500).send(error);
  }
});

productRoute.put("/", async (req: Request, res: Response) => {
  const useCase = new UpdateProductUseCase(new ProductRepository());
  try {
    const ProductDTO = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
    };
    const output = await useCase.execute(ProductDTO);

    res.send(output).status(200);
  } catch (err) {
    res.status(500).send(err);
  }
});

productRoute.get("/:id", async (req: Request, res: Response) => {
  const useCase = new FindProductUseCase(new ProductRepository());
  try {
    const ProductDTO = {
      id: req.params.id,
    };

    const output = await useCase.execute(ProductDTO);

    res.send(output).status(200);
  } catch (err) {
    res.status(500).send(err);
  }
});
