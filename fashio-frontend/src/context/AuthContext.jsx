import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

function loadUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadUser);

    const saveSession = (data) => {
        const u = { name: data.name, email: data.email, role: data.role };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(u));
        setUser(u);
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        saveSession(res.data);
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        saveSession(res.data);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);