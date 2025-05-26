// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api'; // Tu instancia de Axios

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Almacenará { username, role, email, id, profile_id, etc. }
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUserToken = async () => {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                apiClient.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
                try {
                    // Endpoint para obtener el UserProfile del usuario autenticado
                    const response = await apiClient.get('/userprofiles/me/');
                    setUser(response.data); // Asume que response.data es el UserProfile serializado
                    setToken(storedToken);
                } catch (error) {
                    console.error("Error al verificar el token o token expirado:", error);
                    localStorage.removeItem('authToken');
                    setToken(null);
                    setUser(null);
                    delete apiClient.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };
        verifyUserToken();
    }, []); // Se ejecuta solo una vez al montar el provider

    const login = async (username, password) => {
        try {
            // Endpoint de DRF Token Authentication (o el que uses)
            const response = await apiClient.post('/api-token-auth/', { username, password });
            const newToken = response.data.token;
            localStorage.setItem('authToken', newToken);
            setToken(newToken);
            apiClient.defaults.headers.common['Authorization'] = `Token ${newToken}`;

            // Obtener datos del perfil del usuario después del login
            const userProfileResponse = await apiClient.get('/userprofiles/me/');
            setUser(userProfileResponse.data); // Esto debería tener username, role, etc.
            return true;
        } catch (error) {
            console.error("Fallo el inicio de sesión:", error.response?.data || error.message);
            // Limpiar estado en caso de error
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
            delete apiClient.defaults.headers.common['Authorization'];
            throw error; // Para que el componente LoginPage pueda manejarlo
        }
    };

    const logout = async () => {
        // Opcional: Llamar a un endpoint de logout en el backend si lo tienes
        // try {
        //     await apiClient.post('/api/token/logout/'); // Endpoint de ejemplo
        // } catch (error) {
        //     console.error("Error en el logout del backend:", error);
        // }
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        delete apiClient.defaults.headers.common['Authorization'];
        // La redirección se manejará en el componente que llama a logout
    };

    if (loading) {
        return <div>Cargando aplicación...</div>; // O un spinner más elegante
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, isLoadingAuth: loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};