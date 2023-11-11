import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import ProductsList from './ProductsList';

// Mock the products data
const mockProducts = [
  {
    _id: '1',
    owner: { email: 'seller@example.com' },
    images: ['image1.jpg'],
    title: 'Product 1',
    price: 60,
  },
  // Add more mock products as needed
];

// Mock the withDiscount HOC (Higher Order Component)
jest.mock('./ProductsList', () => ({
  withDiscount: (WrappedComponent) => (props) => (
    <WrappedComponent products={mockProducts} {...props} />
  ),
}));

describe('ProductsList', () => {
  it('renders products with discounted prices', () => {
    render(
      <Router>
        <ProductsList />
      </Router>
    );

    // Verify that discounted prices are displayed
    const discountedPriceElement = screen.getByText('$54'); // Adjust based on your discount logic
    expect(discountedPriceElement).toBeInTheDocument();

    // Ensure original prices are not displayed
    const originalPriceElement = screen.queryByText('$60');
    expect(originalPriceElement).not.toBeInTheDocument();
  });

  it('renders the chat button for products when a user is logged in', () => {
    // Mock a user being logged in
    jest.mock('./auth/UserContext', () => ({
      useUser: () => ({
        user: { _id: 'loggedInUserId' },
        token: 'mockToken',
      }),
    }));

    render(
      <Router>
        <ProductsList />
      </Router>
    );

    // Verify that the chat button is rendered
    const chatButtonElement = screen.getByText('Chat With Seller');
    expect(chatButtonElement).toBeInTheDocument();
  });
});
