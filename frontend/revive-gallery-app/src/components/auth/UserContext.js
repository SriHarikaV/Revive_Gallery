import React, { createContext, useContext, useReducer } from 'react';

// Define an initial state for the user
const initialState = {
  user: localStorage.getItem('user') || null,
  token: localStorage.getItem('token') || null, // You can use localStorage to store the token
};

const UserContext = createContext(initialState);

// Define actions for user authentication
const SET_USER = 'SET_USER';
const LOGOUT = 'LOGOUT';

const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setUser = (user, token) => {
    console.log("set user", user, token);
    dispatch({ type: SET_USER, payload: { user, token } });
    localStorage.setItem('user', user);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };


  return (
    <UserContext.Provider value={{ ...state, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };
