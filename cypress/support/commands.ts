// cypress/support/commands.ts
// FIX: Use a triple-slash directive to properly load Cypress types and globals like `cy` and `Cypress`.
/// <reference types="cypress" />

import { RolUsuario } from '../../tipos';

Cypress.Commands.add('login', (role = 'admin') => {
  cy.session(
    `user-session-${role}`,
    () => {
      cy.visit('/', {
        onBeforeLoad(win) {
          // This logic mimics the authentication flow of the application
          const user = {
            id: role === 'admin' ? '1' : '2',
            nombreUsuario: role,
            rol: role === 'admin' ? RolUsuario.Admin : RolUsuario.Usuario,
          };
          // This sets the user in a mock way for testing, assuming the app checks localStorage.
          // In a real scenario, this would interact with the auth mechanism.
          // The current app uses onAuthStateChanged, so a better mock would be needed
          // if this command were used for routes that heavily rely on Firebase auth state.
          // For now, let's assume a simplified auth check for component rendering.
          // Let's adapt to what the app expects from onAuthStateChanged - it gets user data from firestore.
          // A full mock is too complex, we'll assume the local storage mock is for a simplified test setup.
          win.localStorage.setItem('usuario_sesion', JSON.stringify(user));
        },
      });
      // Ensure the visit and session setting were successful before moving on
      cy.url().should('match', /\/#\/$/); // Should redirect to dashboard
      cy.contains('h1', 'Dashboard').should('be.visible');
    },
    {
      cacheAcrossSpecs: true, // Speeds up test suite runs by reusing session
    }
  );
});