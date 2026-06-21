import { validatePromoConditions, ruleHandlers } from "../../../src/utils/promoRules.js";

describe("ruleHandlers", () => {
  describe("transport", () => {
    it("accepte si value est 'all'", () => {
      expect(ruleHandlers.transport("all", { transport: "bus" })).toBe(true);
    });
    it("accepte si value correspond au transport", () => {
      expect(ruleHandlers.transport("train", { transport: "train" })).toBe(true);
    });
    it("refuse si value ne correspond pas", () => {
      expect(ruleHandlers.transport("train", { transport: "bus" })).toBe(false);
    });
  });

  describe("exclude_transport", () => {
    it("accepte si le transport est différent", () => {
      expect(ruleHandlers.exclude_transport("bus", { transport: "train" })).toBe(true);
    });
    it("refuse si le transport est identique", () => {
      expect(ruleHandlers.exclude_transport("train", { transport: "train" })).toBe(false);
    });
  });

  describe("min_price", () => {
    it("accepte si le prix est supérieur au minimum", () => {
      expect(ruleHandlers.min_price(50, { price: 100 })).toBe(true);
    });
    it("accepte si le prix est égal au minimum", () => {
      expect(ruleHandlers.min_price(50, { price: 50 })).toBe(true);
    });
    it("refuse si le prix est inférieur au minimum", () => {
      expect(ruleHandlers.min_price(50, { price: 30 })).toBe(false);
    });
  });

  describe("max_price", () => {
    it("accepte si le prix est inférieur au maximum", () => {
      expect(ruleHandlers.max_price(200, { price: 100 })).toBe(true);
    });
    it("accepte si le prix est égal au maximum", () => {
      expect(ruleHandlers.max_price(200, { price: 200 })).toBe(true);
    });
    it("refuse si le prix est supérieur au maximum", () => {
      expect(ruleHandlers.max_price(200, { price: 250 })).toBe(false);
    });
  });

  describe("class", () => {
    it("accepte si la classe correspond", () => {
      expect(ruleHandlers.class("2", { class: "2" })).toBe(true);
    });
    it("refuse si la classe ne correspond pas", () => {
      expect(ruleHandlers.class("1", { class: "2" })).toBe(false);
    });
  });
});

describe("validatePromoConditions", () => {
  const context = { transport: "train", price: 100, class: "2" };

  it("retourne true si conditions est vide", () => {
    expect(validatePromoConditions({}, context)).toBe(true);
  });

  it("retourne true si toutes les conditions sont remplies", () => {
    expect(validatePromoConditions(
      { transport: "train", min_price: 50, class: "2" },
      context
    )).toBe(true);
  });

  it("retourne false dès qu'une condition échoue", () => {
    expect(validatePromoConditions(
      { transport: "train", min_price: 200 }, // min_price KO
      context
    )).toBe(false);
  });

  it("ignore les règles inconnues", () => {
    expect(validatePromoConditions(
      { regle_inconnue: "xyz", transport: "train" },
      context
    )).toBe(true);
  });

  it("retourne false si exclude_transport bloque", () => {
    expect(validatePromoConditions(
      { exclude_transport: "train" },
      context
    )).toBe(false);
  });
});