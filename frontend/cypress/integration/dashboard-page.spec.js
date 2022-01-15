/// <reference types="cypress" />

describe("/dashboard", () => {
  it("redirects to login if you are not authenticated", () => {
    cy.visit("/dashboard");
    cy.url().should("contain", "login");
  });
});
