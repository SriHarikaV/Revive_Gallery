import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from '../components/products/ProductForm';

test('renders the product form', () => {
  render(
    <MemoryRouter> // MemoryRouter mimics BrowserRouter or HashRouter
        <ProductForm />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading")).toHaveTextContent(/Add a New Product/);

  const addButton = screen.getByRole('button', { name: 'Add Product' });
  // Assert that the button is not disabled
  expect(addButton).not.toHaveAttribute('disabled');
});

test('test the file formats', () => {
  render(
    <MemoryRouter> // MemoryRouter mimics BrowserRouter or HashRouter
        <ProductForm />
    </MemoryRouter>
  );

  const fileInput = screen.getByLabelText('Product Images:');

  // Create an array of mock image files which are valid img formats
  const mockImageValidFiles = [
    new File(['mockImage1'], 'mockImage1.jpg', { type: 'image/jpeg' }),
    new File(['mockImage2'], 'mockImage2.png', { type: 'image/png' }),
    new File(['mockImage3'], 'mockImage3.gif', { type: 'image/gif' }),
    new File(['mockImage4'], 'mockImage4.webp', { type: 'image/webp' }),
    new File(['mockImage5'], 'mockImage5.jpg', { type: 'image/jpeg' }),
  ];

  // Trigger the file input change event with mockImageValidFiles
  fireEvent.change(fileInput, { target: { files: mockImageValidFiles } });

  // Assert that the input field is valid (no validation message)
  expect(fileInput.validity.valid).toBeValid;

  // Create an array of mock image files which are invalid img formats
  const mockImageInvalidFiles = [
    new File(['mockImage1'], 'mockImage1.jpg', { type: 'test1/pdf' }),
    new File(['mockImage2'], 'mockImage2.png', { type: 'test2/mp3' }),
  ];

  // Trigger the file input change event with mockImageInvalidFiles
  fireEvent.change(fileInput, { target: { files: mockImageInvalidFiles } });

  // Assert that the input field is invalid (validation messages arises)
  expect(fileInput.validity.valid).toBeInvalid;
});

test('test the count of image files', () => {
    render(
      <MemoryRouter> // MemoryRouter mimics BrowserRouter or HashRouter
          <ProductForm />
      </MemoryRouter>
    );
  
    const fileInput = screen.getByLabelText('Product Images:');
  
    // Create an array of mock image files
    const mockImageFiles1 = [
      new File(['mockImage1'], 'mockImage1.jpg', { type: 'image/jpeg' }),
      new File(['mockImage2'], 'mockImage2.png', { type: 'image/png' }),
      new File(['mockImage3'], 'mockImage3.gif', { type: 'image/gif' }),
      new File(['mockImage4'], 'mockImage4.webp', { type: 'image/webp' }),
      new File(['mockImage5'], 'mockImage5.jpg', { type: 'image/jpeg' }),
      new File(['mockImage6'], 'mockImage6.jpg', { type: 'image/jpeg' }),
    ];
  
    // Trigger the file input change event with mock image files
    fireEvent.change(fileInput, { target: { files: mockImageFiles1 } });
  
    // Assert that the input field is valid (no validation message)
    expect(fileInput.validity.valid).toBeValid;
  
    // Create an array of mock image files
    const mockImageFiles2 = [
        new File(['mockImage1'], 'mockImage1.jpg', { type: 'image/jpeg' }),
        new File(['mockImage2'], 'mockImage2.png', { type: 'image/png' }),
    ];
  
    // Trigger the file input change event with mock image files
    fireEvent.change(fileInput, { target: { files: mockImageFiles2 } });
  
    // Assert that the input field is invalid (validation messages arises)
    expect(fileInput.validity.valid).toBeInvalid;
  });
