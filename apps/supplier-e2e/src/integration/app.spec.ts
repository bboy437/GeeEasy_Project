import { getGreeting } from "../support/app.po";

describe("supplier", () => {
  beforeEach(() => cy.visit("/"));

  it("should display welcome message", () => {
    getGreeting().contains("Welcome to supplier!");
  });
});
