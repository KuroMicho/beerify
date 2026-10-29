const beerService = require("../../src/services/beerService");
const Beer = require("../../src/models/Beer");

jest.mock("../../src/models/Beer");

describe("Beer Service Unit Tests (Patrón AAA)", () => {
  beforeEach(() => jest.clearAllMocks());

  // 1
  test("getAllBeers debe retornar un arreglo de cervezas", async () => {
    const mockBeers = [{ name: "IPA" }];
    Beer.find.mockResolvedValue(mockBeers);
    const result = await beerService.getAllBeers();
    expect(result).toEqual(mockBeers);
  });

  // 2
  test("getBeerById debe retornar una cerveza si existe", async () => {
    Beer.findById.mockResolvedValue({ name: "Porter" });
    const result = await beerService.getBeerById("123");
    expect(result.name).toBe("Porter");
  });

  // 3
  test("getBeerById debe lanzar error si no existe", async () => {
    Beer.findById.mockResolvedValue(null);
    await expect(beerService.getBeerById("999")).rejects.toThrow(
      "Recurso no encontrado",
    );
  });

  // 4
  test("createBeer debe retornar el documento creado", async () => {
    jest
      .spyOn(Beer.prototype, "save")
      .mockResolvedValue({ _id: "456", name: "Lager" });
    const result = await beerService.createBeer({ name: "Lager" });
    expect(result).toHaveProperty("_id", "456");
  });

  // 5
  test("deleteBeer debe lanzar error si se borra un ID inexistente", async () => {
    Beer.findByIdAndDelete.mockResolvedValue(null);
    await expect(beerService.deleteBeer("000")).rejects.toThrow(
      "Recurso no encontrado",
    );
  });
});
