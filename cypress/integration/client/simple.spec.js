/// <reference types="Cypress" />
describe('Unit test Elevio npm module', function() {
  it('should install and open Elevio', function() {
    cy.visit('/pages/01-simple');

    // Make sure Elevio loads
    cy.get('._elevio_launcher');

    // Shouldn't see the Assistant yet!
    cy.get('._elevio_widget div').should('not.be.visible');

    // Make sure the Elevio.open() function works
    cy.get('#open').click();

    // Check to make sure the assistant opens
    cy.get('._elevio_widget div').should('be.visible');
  });

  it('should not autoInitialize when settings set', function() {
    cy.visit('/pages/02-no-initialize');

    // Make sure Elevio doesn't initialize
    cy.get('._elevio_launcher').should('not.exist');

    // Trigger initialize
    cy.get('#initialize').click();

    // Now make sure Elevio loads
    cy.get('._elevio_launcher');
  });
});
