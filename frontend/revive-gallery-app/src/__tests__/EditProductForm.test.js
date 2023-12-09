import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditProductForm from '../components/products/EditProductForm';
import { MemoryRouter } from "react-router-dom";

describe('EditProductForm', () => {
  test('renders form elements', () => {
    render(
        <MemoryRouter> // MemoryRouter mimics BrowserRouter or HashRouter
            <EditProductForm />
        </MemoryRouter>
      );

    expect(screen.getByLabelText('Product Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Description:')).toBeInTheDocument();
    expect(screen.getByLabelText('Categories:')).toBeInTheDocument();
    expect(screen.getByLabelText('Price:')).toBeInTheDocument();
    expect(screen.getByLabelText('Existing Product Images:')).toBeInTheDocument();
    expect(screen.getByLabelText('Want to add more images?')).toBeInTheDocument();
    expect(screen.getByText('Edit Product')).toBeInTheDocument();
  });

  test('handles input changes', () => {
    render(
        <MemoryRouter>
            <EditProductForm />
        </MemoryRouter>
      );
    
    fireEvent.change(screen.getByLabelText('Product Name:'), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'Test description' } });
    fireEvent.change(screen.getByLabelText('Price:'), { target: { value: '20' } });

    expect(screen.getByLabelText('Product Name:')).toHaveValue('Test Product');
    expect(screen.getByLabelText('Description:')).toHaveValue('Test description');
    expect(screen.getByLabelText('Price:')).toHaveValue(20);
  });

  test('handles image changes', () => {
    render(
        <MemoryRouter>
            <EditProductForm />
        </MemoryRouter>
      );

    
    const file = new File(['dummy image'], 'image.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Want to add more images?'), { target: { files: [file] } });

    expect(screen.getByLabelText('Want to add more images?')).toHaveValue('');
  });

});
