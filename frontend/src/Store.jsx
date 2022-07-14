import { createContext, useReducer } from "react";
import PropTypes from 'prop-types';
import React from "react";


export const Store = createContext();

const initialState = {
    fullBox: false,
    userInfo: localStorage.getItem('userInfo') ?
        JSON.parse(localStorage.getItem('userInfo')) : null,
    cart: {
        Address: localStorage.getItem('Address') ?
            JSON.parse(localStorage.getItem('Address')) : { location: {} },

        paymentMethod: localStorage.getItem('paymentMethod')
            ? localStorage.getItem('paymentMethod')
            : '',

        cartItems: localStorage.getItem('cartItems') ?
            JSON.parse(localStorage.getItem('cartItems')) : [],
    },
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_FULLBOX_ON':
            return { ...state, fullBox: true };
        case 'SET_FULLBOX_OFF':
            return { ...state, fullBox: false };
        case 'CART_ADD_ITEM':
            {
                const newItem = action.payload;
                const existItem = state.cart.cartItems.find(
                    (item) => item._id === newItem._id
                );
                const cartItems = existItem
                    ? state.cart.cartItems.map((item) => item
                    ) : [...state.cart.cartItems, newItem];
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                return { ...state, cart: { ...state.cart, cartItems } };
            }
        case 'CART_REMOVE_ITEM': {
            const cartItems = state.cart.cartItems.filter(
                (item) => item._id !== action.payload._id
            );
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };

        }
        case 'CART_CLEAR':
            return { ...state, cart: { ...state.cart, cartItems: [] } };

        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };

        case 'USER_SIGNOUT':
            return {
                ...state, userInfo: null
                , cart: {
                    cartItems: [],
                    Address: {},
                    paymentMethod: "",
                },
            };
        case 'SAVE_ADDRESS':
            return {
                ...state, cart: {
                    ...state.cart, Address: action.payload,
                },
            };

        case 'SAVE_ADDRESS_MAP_LOCATION':
            return {
                ...state,
                cart: {
                    ...state.cart,
                    Address: {
                        ...state.cart.Address,
                        location: action.payload,
                    },
                },
            };
        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state, cart: {
                    ...state.cart, paymentMethod: action.payload,
                },
            };
        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}

StoreProvider.propTypes = {
    children: PropTypes.any,
}