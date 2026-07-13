export const initialState = {
    token: null,
    user: null,
    isAuthenticated: false
};


export const authReducer = (state, action) => {

    switch(action.type) {

        case "LOGIN":

            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                isAuthenticated: true
            };


        case "LOGOUT":

            return {
                ...initialState
            };


        default:
            return state;
    }

};