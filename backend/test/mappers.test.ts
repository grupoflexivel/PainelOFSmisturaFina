import { describe, expect, it } from "vitest";
import { extractControle, mapSituacaoColor, parseQuantidadeBR } from "../src/mappers.js";

describe("parseQuantidadeBR", () => {
  it("parses a simple decimal value", () => {
    expect(parseQuantidadeBR("201,00")).toBe(201);
  });

  it("parses a value with a thousands separator", () => {
    expect(parseQuantidadeBR("9.020,00")).toBe(9020);
  });

  it("parses a value with fractional cents", () => {
    expect(parseQuantidadeBR("181,50")).toBe(181.5);
  });
});

describe("mapSituacaoColor", () => {
  it.each([
    ["Gerada", "white"],
    ["Liberada Qualidade", "green"],
  ])("maps the API's situacaoDescricao %j to color %s", (situacaoDescricao, colorToken) => {
    expect(mapSituacaoColor(situacaoDescricao)).toBe(colorToken);
  });

  it("falls back to a neutral color for an unrecognized situacaoDescricao", () => {
    expect(mapSituacaoColor("Algo Novo Que A API Ainda Não Manda")).toBe("gray");
  });
});

describe("extractControle", () => {
  it("reads controle from the first item in data", () => {
    expect(extractControle({ data: [{ controle: "S-39385" }] })).toBe("S-39385");
  });

  it("returns null when data is empty", () => {
    expect(extractControle({ data: [] })).toBeNull();
  });

  it("returns null when controle is an empty string", () => {
    expect(extractControle({ data: [{ controle: "" }] })).toBeNull();
  });
});
