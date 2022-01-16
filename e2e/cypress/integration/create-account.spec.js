/// <reference types="cypress" />

describe("/create-account page", () => {
  it("displays email errors", () => {
    cy.visit("/create-account");
    cy.getFormControlByLabel("Username").type(
      `example-${new Date().getTime()}`
    );
  });

  it("upon creating an account will redirect to the dashboard, now you can view the workouts page", () => {
    cy.visit("/create-account");
    cy.getFormControlByLabel("Username").type(`example${new Date().getTime()}`);
    cy.getFormControlByLabel("Email").type(
      `example${new Date().getTime()}@example.com`
    );

    const password = `example-${new Date().getTime()}`;
    cy.getFormControlByLabel("Password").type(password);
    cy.getFormControlByLabel("Password Confirmation").type(password);
    cy.get("#CreateAccountPage").submit();
    cy.url().should("contain", "dashboard");
  });
});
