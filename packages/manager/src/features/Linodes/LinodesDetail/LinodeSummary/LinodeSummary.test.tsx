import * as React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';

import { renderWithTheme } from 'src/utilities/testHelpers';

import LinodeSummary from './LinodeSummary';

describe('LinodeSummary', () => {
  const { getByText } = renderWithTheme(
    <MemoryRouter initialEntries={['linode/1']}>
      <Route path="linode/:linodeId">
        <LinodeSummary
          isBareMetalInstance={false}
          linodeCreated="2018-11-01T00:00:00"
        />
      </Route>
    </MemoryRouter>
  );

  it('should have a select menu for the graphs', () => {
    expect(getByText('Last 24 Hours')).toBeInTheDocument();
  });
});
