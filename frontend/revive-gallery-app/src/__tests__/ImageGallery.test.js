import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For expect assertions

import ImageGallery from './ImageGallery';

describe('ImageGallery Component', () => {
  const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

  it('renders the ImageGallery component with initial image', () => {
    const { getByAltText } = render(<ImageGallery images={images} />);
    
    const imageElement = getByAltText('Image 1');
    
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'image1.jpg');
  });

  it('navigates to the next image on clicking the "Next" button', () => {
    const { getByText, getByAltText } = render(<ImageGallery images={images} />);
    
    fireEvent.click(getByText('Next'));

    const imageElement = getByAltText('Image 2');
    
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'image2.jpg');
  });

  it('navigates to the previous image on clicking the "Prev" button', () => {
    const { getByText, getByAltText } = render(<ImageGallery images={images} />);
    
    fireEvent.click(getByText('Prev'));

    const imageElement = getByAltText('Image 3');
    
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'image3.jpg');
  });

  it('disables "Prev" button when at the first image', () => {
    const { getByText } = render(<ImageGallery images={images} />);
    
    const prevButton = getByText('Prev');
    
    expect(prevButton).toBeDisabled();
  });

  it('disables "Next" button when at the last image', () => {
    const { getByText } = render(<ImageGallery images={images} />);
    
    const nextButton = getByText('Next');
    
    expect(nextButton).toBeDisabled();
  });
});
