/// <reference types="cypress" />

describe("/workouts page", () => {
  it("upon visiting /workouts, it shows the login message when unauthenticated", () => {
    cy.visit("/workouts");
    cy.get("nav a").contains("Workouts").click();
    cy.get('[data-test-id="please-authenticate"]').should("be.visible");
  });

  it("when visitingn /dashboard it shows the login if you are not authenticated", () => {
    cy.visit("/dashboard");
    cy.get('[data-test-id="please-authenticate"]').should("be.visible");
  });
});
