import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserRatingModal from '../components/products/UserRatingModal';

describe('UserRatingModal', () => {
  test('handles validation error', () => {
    const onSubmitMock = jest.fn();
    const setIsRatingModalOpenMock = jest.fn();

    render(
      <UserRatingModal
        isOpen={true}
        onSubmit={onSubmitMock}
        rating={0}
        setRating={() => {}}
        setIsRatingModalOpen={setIsRatingModalOpenMock}
      />
    );

    // Simulate clicking the submit button without selecting a star
    fireEvent.click(screen.getByText('Submit Rating'));

    // Check if the validation error is displayed
    expect(screen.getByText('Please select a valid rating')).toBeInTheDocument();
  });

  test('renders with the correct number of stars', () => {
    const setRatingMock = jest.fn();

    render(
      <UserRatingModal
        isOpen={true}
        onSubmit={() => {}}
        rating={0}
        setRating={setRatingMock}
        setIsRatingModalOpen={() => {}}
      />
    );

    // Check if the correct number of stars is rendered
    expect(screen.getAllByTestId('star')).toHaveLength(5);
  });

  test('updates rating when clicking on a star', () => {
    const setRatingMock = jest.fn();

    render(
      <UserRatingModal
        isOpen={true}
        onSubmit={() => {}}
        rating={0}
        setRating={setRatingMock}
        setIsRatingModalOpen={() => {}}
      />
    );

    // Simulate clicking on the third star
    fireEvent.click(screen.getAllByTestId('star')[2]);

    // Check if setRatingMock is called with the correct value (3)
    expect(setRatingMock).toHaveBeenCalledWith(3);
  });

  test('updates rating when entering a custom rating', () => {
    const setRatingMock = jest.fn();

    render(
      <UserRatingModal
        isOpen={true}
        onSubmit={() => {}}
        rating={0}
        setRating={setRatingMock}
        setIsRatingModalOpen={() => {}}
      />
    );

    // Simulate entering a custom rating in the input field
    fireEvent.change(screen.getByLabelText('Custom Rating (0-5):'), { target: { value: '4' } });

    // Check if setRatingMock is called with the correct value (4)
    expect(setRatingMock).toHaveBeenCalledWith(4);
  });
});
