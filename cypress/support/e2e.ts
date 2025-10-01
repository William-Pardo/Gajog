// cypress/support/e2e.ts
// This file is processed automatically before running test files.
// It's a great place to put global configuration and behavior that modifies Cypress.

// FIX: Use a triple-slash directive to properly load Cypress types.
/// <reference types="cypress" />

import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')