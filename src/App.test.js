import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Item from './components/item';
import App from './App';

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
  fetch.mockResolvedValue({
    json: () => Promise.resolve([])
  });
});

describe('Item Component', () => {
  const mockData = {
    name: "Ontario",
    capital: "Toronto",
    flagUrl: "some-url"
  };

  it('should show the capital when "Show Capital" button is clicked', async () => {
    const { getByText, getByRole } = render(<Item {...mockData} />);

    fireEvent.click(getByRole('button', { name: /show capital/i }));

    await waitFor(() => expect(getByText(mockData.capital)).toBeInTheDocument());

    expect(getByRole('button')).toHaveTextContent('Hide Capital');
  });

  it('should hide the capital when "Hide Capital" button is clicked', async () => {
    const { queryByText, getByRole } = render(<Item {...mockData} />);

    fireEvent.click(getByRole('button', { name: /show capital/i }));
    await waitFor(() => fireEvent.click(getByRole('button', { name: /hide capital/i })));

    await waitFor(() => expect(queryByText(mockData.capital)).toBeNull());

    expect(getByRole('button')).toHaveTextContent('Show Capital');
  });
});

describe('App Component', () => {
  it('fetches and displays data correctly on initial load', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ name: "Alberta", capital: "Edmonton", flagUrl: "url-to-flag" }])
    });

    render(<App />);
    
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await screen.findByText("Alberta");
  });

  it('should display "Quebec" when the "Provinces" button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ name: "Quebec", capital: "Quebec City", flagUrl: "url-to-quebec-flag" }])
    });

    render(<App />);
    fireEvent.click(screen.getByText('Provinces'));

    await waitFor(() => expect(screen.findByText('Quebec')).toBeTruthy());
  });

  it('should display "Yukon" when the "Territories" button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve([{ name: "Yukon", capital: "Whitehorse", flagUrl: "some-url" }])
    });

    render(<App />);
    fireEvent.click(screen.getByText('Territories'));

    await waitFor(() => expect(screen.findByText('Yukon')).toBeTruthy());
  });

});
