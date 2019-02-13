/// <reference types="Cypress" />
describe('Unit test Elevio React module', function() {
  it('should load Elevio', function() {
    cy.visit('/pages/03-react');

    // Make sure Elevio loads
    cy.get('._elevio_launcher');

    // onLoad should be called
    cy.get('#is-loaded');

    // onReady should be called
    cy.get('#is-ready');

    // Click the launcher
    cy.get('._elevio_launcher button').click();

    // Should trigger the onWidgetOpened call
    cy.get('#is-opened');

    // Press the close button
    cy.get('._elevio_close').click();

    // Make sure onWidgetClosed is called
    cy.get('#is-closed');
  });

  it('should be fine removing and re-adding', function() {
    cy.visit('/pages/03-react');

    // Make sure we are up and running
    cy.get('._elevio_launcher');

    // Remove the elevio element from the component hierarchy
    cy.get('#remove-elevio').click();

    // Now Elevio should be removed.
    cy.get('._elevio_launcher').should('not.exist');

    // Re-add Elevio
    cy.get('#add-elevio').click();

    // Elevio should be re-added
    cy.get('._elevio_launcher');
  });

  it('should be fine re-rendering', function() {
    cy.visit('/pages/03-react');

    cy.get('#increment').click();

    // Try open Elevio
    cy.get('._elevio_launcher button').click();

    // Elevio should still open
    cy.get('._elevio_widget div').should('be.visible');

    // Trigger re-draw
    cy.get('#increment').click();

    // Elevio should still be open
    cy.get('._elevio_widget div').should('be.visible');
  });
});
