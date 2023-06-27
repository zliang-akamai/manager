import { accessFactory, appTokenFactory } from '@src/factories';
import 'cypress-file-upload';
import {
  mockGetPersonalAccessTokens,
  mockGetAppTokens,
  mockRevokeAppToken,
} from 'support/intercepts/profile';
import { ui } from 'support/ui';
import { randomLabel, randomString } from 'support/util/random';
import { Token } from '@linode/api-v4/types';

describe('Third party access tokens', () => {
  let tokenLabel: string;
  let tokenSecret: string;
  let token: Token;

  beforeEach(() => {
    tokenLabel = randomLabel();
    tokenSecret = randomString(64);
    token = appTokenFactory.build({
      label: tokenLabel,
      token: tokenSecret,
    });

    mockGetPersonalAccessTokens([]).as('getTokens');
    mockGetAppTokens([token]).as('getAppTokens');

    cy.visitWithLogin('/profile/tokens');
    cy.wait(['@getTokens', '@getAppTokens']);
  });

  /*
   * - List of third party access tokens
   * - Confirms that third party apps are listed with expected information.
   */
  it('Third party access tokens are listed with expected information', () => {
    cy.findByText(tokenLabel)
      .closest('tr')
      .within(() => {
        cy.findByText(tokenLabel).should('be.visible');
        cy.findByText('2020-01-01 12:00').should('be.visible');
        cy.findByText('never').should('be.visible');
      });
  });

  /*
   * - View scopes of a third party access token
   * - Confirms that 'View Scopes' opens a drawer and shows the correct information.
   */
  it('Views scopes of a third party access token', () => {
    const access = accessFactory.build({
      Linodes: 2,
    });

    cy.findByText(tokenLabel)
      .closest('tr')
      .within(() => {
        ui.button.findByTitle('View Scopes').should('be.visible').click();
      });
    ui.drawer
      .findByTitle(tokenLabel)
      .should('be.visible')
      .within(() => {
        Object.keys(access).forEach((key) => {
          cy.findByText(key)
            .closest('tr')
            .within(() => {
              cy.findByLabelText(
                `This token has ${access[key]} access for ${key.toLowerCase()}`
              ).should('be.visible');
            });
        });
      });
  });

  /*
   * - Revoke a third party access token
   * - Confirms that revoke works as expected and third party apps list updates accordingly.
   */
  it('Revokes a third party access token', () => {
    // Cancelling will keep the list unchanged.
    cy.findByText(tokenLabel)
      .closest('tr')
      .within(() => {
        ui.button.findByTitle('Revoke').should('be.visible').click();
      });
    ui.dialog
      .findByTitle(`Revoke ${tokenLabel}?`)
      .should('be.visible')
      .within(() => {
        ui.buttonGroup
          .findButtonByTitle('Cancel')
          .should('be.visible')
          .should('be.enabled')
          .click();
      });

    // Confirms revoke will remove the third party app.
    mockRevokeAppToken(token.id).as('deleteAppToken');
    cy.findByText(tokenLabel)
      .closest('tr')
      .within(() => {
        ui.button.findByTitle('Revoke').should('be.visible').click();
      });
    ui.dialog
      .findByTitle(`Revoke ${tokenLabel}?`)
      .should('be.visible')
      .within(() => {
        ui.buttonGroup
          .findButtonByTitle('Revoke')
          .should('be.visible')
          .should('be.enabled')
          .click();
      });
    cy.wait('@deleteAppToken');

    mockGetPersonalAccessTokens([]).as('getTokens');
    mockGetAppTokens([]).as('getAppTokens');
    cy.visitWithLogin('/profile/tokens');
    cy.wait(['@getTokens', '@getAppTokens']);
    cy.findByText(tokenLabel).should('not.exist');
  });
});
