export const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.payload.token,
        user: {
          id: action.payload.userId,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        },
        isAuthenticated: true,
      };

    case "LOGOUT":
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
