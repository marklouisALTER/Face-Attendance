import React, { useState } from 'react';

type userType = {
    user: string;
    token: string; 
}

export const Authentication = () => {
    const [user, setUser] = useState<string | null>();
    const [token, setToken] = useState<string | null>();

    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const token = tokenString ? JSON.parse(tokenString) : null;
        return token;
    }

    const getUser = () => {
        const userString = sessionStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        return user;
    }

    const login = ({user, token}: Pick<userType, 'user'| 'token'>) => {
        setUser(user);
        setToken(token);
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', JSON.stringify(token));
        
    } 

    const isAuthenticated = () => {
        const token = getToken();
        const user = getUser();

        return token !== null && user !== null;
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
    }

    return {
        login,
        logout,
        isAuthenticated,
        getToken,
        getUser
    };
};