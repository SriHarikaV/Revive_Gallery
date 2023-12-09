import React from 'react';
import { render, screen } from '@testing-library/react';
import Success from '../components/products/Success';

describe('Success Component', () => {
  test('renders success message with transaction ID', () => {
    render(<Success />);

    // Assert that the success message is rendered
    expect(screen.getByText('Payment Complete')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Thank you for completing the payment! You will shortly receive an email of your payment.'
      )
    ).toBeInTheDocument();

    // Assert that the transaction ID is present
    expect(screen.getByText('Transaction ID')).toBeInTheDocument();
  });
});
