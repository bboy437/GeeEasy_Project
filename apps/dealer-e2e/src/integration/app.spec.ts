import { getGreeting } from "../support/app.po";

describe("dealer", () => {
  beforeEach(() => cy.visit("/"));

  it("should display welcome message", () => {
    getGreeting().contains("Welcome to dealer!");
  });
});
