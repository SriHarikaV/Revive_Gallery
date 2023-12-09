import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductReviewModal from '../components/products/ProductReviewModal';

describe('ProductReviewModal', () => {
  test('handles validation error', () => {
    const onSubmitMock = jest.fn();
    const setIsReviewModalOpenMock = jest.fn();

    render(
      <ProductReviewModal
        isOpen={true}
        onSubmit={onSubmitMock}
        reviewText=""
        setReviewText={() => {}}
        setIsReviewModalOpen={setIsReviewModalOpenMock}
      />
    );

    // Simulate clicking the submit button without entering review text
    fireEvent.click(screen.getByText('Submit Review'));

    // Check if the validation error is displayed
    expect(screen.getByText('Review text cannot be empty')).toBeInTheDocument();
  });

  test('updates review text when typing', () => {
    const setReviewTextMock = jest.fn();

    render(
      <ProductReviewModal
        isOpen={true}
        onSubmit={() => {}}
        reviewText=""
        setReviewText={setReviewTextMock}
        setIsReviewModalOpen={() => {}}
      />
    );

    // Simulate typing in the review text area
    fireEvent.change(screen.getByPlaceholderText('Write your review here...'), { target: { value: 'Great product!' } });

    // Check if setReviewTextMock is called with the correct value
    expect(setReviewTextMock).toHaveBeenCalledWith('Great product!');
  });

  test('calls onSubmit with the correct review text', () => {
    const onSubmitMock = jest.fn();

    render(
      <ProductReviewModal
        isOpen={true}
        onSubmit={onSubmitMock}
        reviewText="This is a great product!"
        setReviewText={() => {}}
        setIsReviewModalOpen={() => {}}
      />
    );

    // Simulate clicking the submit button
    fireEvent.click(screen.getByText('Submit Review'));

    // Check if onSubmitMock is called with the correct review text
    expect(onSubmitMock).toHaveBeenCalledWith('This is a great product!');
  });

  test('closes the modal when clicking close button', () => {
    const setIsReviewModalOpenMock = jest.fn();

    render(
      <ProductReviewModal
        isOpen={true}
        onSubmit={() => {}}
        reviewText=""
        setReviewText={() => {}}
        setIsReviewModalOpen={setIsReviewModalOpenMock}
      />
    );

    // Simulate clicking the close button
    fireEvent.click(screen.getByText('×'));

    // Check if setIsReviewModalOpenMock is called with false
    expect(setIsReviewModalOpenMock).toHaveBeenCalledWith(false);
  });
});
