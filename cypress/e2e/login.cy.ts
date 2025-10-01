// cypress/e2e/login.cy.ts
// FIX: Use a triple-slash directive to properly load Cypress types and the global `cy` object.
/// <reference types="cypress" />

describe('Login Flow E2E', () => {
  beforeEach(() => {
    // Start from a clean slate for each test
    cy.visit('/');
    cy.url().should('include', '/#/login');
  });

  it('should display an error message for invalid credentials', () => {
    cy.get('input[id="email"]').type('nonexistentuser@example.com');
    cy.get('input[id="contrasena"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Check for the error message from AuthContext, which is thrown from the API
    cy.contains('Correo electrónico o contraseña incorrectos').should('be.visible');
  });

  it('should allow a valid user to log in and see the dashboard', () => {
    // The login form requires an email. We'll use a placeholder email for the 'admin' user.
    // The actual credentials would be in a test environment database.
    cy.get('input[id="email"]').type('admin@test.com');
    cy.get('input[id="contrasena"]').type('admin123'); // Assuming this is the test password
    cy.get('button[type="submit"]').click();

    // Verify redirection to the dashboard
    cy.url().should('match', /\/#\/$/); // Root hash route

    // Verify that the dashboard is visible
    cy.contains('h1', 'Dashboard').should('be.visible');
  });
});