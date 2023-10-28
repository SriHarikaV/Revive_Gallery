import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import RegistrationForm from "../components/registrationform";

test("displays password validation message for invalid password", () => {
    const { getByText} =  render(
    <MemoryRouter> // MemoryRouter mimics BrowserRouter or HashRouter
        <RegistrationForm />
    </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Password');

    // setting the invalid password to the password field
    fireEvent.change(passwordInput, { target: { value: "InvalidPassword" } });

    // getting the invalid password message from DOM element
    const validationMessage = getByText(
        "Password does not meet the criteria. It should have at least 8 characters, including one lowercase letter, one uppercase letter, one digit, and one special character."
    );

    // asserting that invalid message is visible in DOM if password is invalid
    expect(validationMessage).toBeInTheDocument();
});

test("does not display password validation message for valid password", () => {
    const { queryByText, getByLabelText } =  render(
        <MemoryRouter>
          <RegistrationForm />
        </MemoryRouter>
      );

    const passwordInput = screen.getByPlaceholderText('Password');

    // setting the valid password to the password field
    fireEvent.change(passwordInput, { target: { value: "ValidP@ss1" } });

    // querying the invalid password message from DOM element
    const validationMessage = queryByText(
        "Password does not meet the criteria. It should have at least 8 characters, including one lowercase letter, one uppercase letter, one digit, and one special character."
    );

    // asserting that invalid message is not visible in DOM if password is valid
    expect(validationMessage).not.toBeInTheDocument();
});
