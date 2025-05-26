// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api'; // Tu instancia de Axios

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Almacenará { id, username, email, profile: { role, role_display, team_name, etc. } }
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Estado para la carga inicial de autenticación

    useEffect(() => {
        const verifyUserToken = async () => {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                apiClient.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
                try {
                    // Endpoint para obtener el UserProfile del usuario autenticado
                    const response = await apiClient.get('userprofiles/me/'); // Asegúrate que la URL base en api.js termine en /api/
                    setUser(response.data); 
                    setToken(storedToken); 
                } catch (error) {
                    console.error("Error al verificar el token o token expirado:", error.response?.data || error.message);
                    localStorage.removeItem('authToken');
                    setToken(null);
                    setUser(null);
                    delete apiClient.defaults.headers.common['Authorization'];
                }
            }
            setIsLoadingAuth(false);
        };
        verifyUserToken();
    }, []); // Se ejecuta solo una vez al montar el provider

    const login = async (username, password) => {
        setIsLoadingAuth(true); // Indicar que estamos procesando el login
        try {
            // Endpoint de DRF Token Authentication
            const response = await apiClient.post('api-token-auth/', { username, password }); // Asegúrate que la URL base en api.js termine en /api/
            const newToken = response.data.token;
            localStorage.setItem('authToken', newToken);
            setToken(newToken);
            apiClient.defaults.headers.common['Authorization'] = `Token ${newToken}`;

            // Obtener datos del perfil del usuario después del login
            const userProfileResponse = await apiClient.get('userprofiles/me/');
            setUser(userProfileResponse.data); 
            setIsLoadingAuth(false); // Termina el proceso de login
            return true;
        } catch (error) {
            console.error("Fallo el inicio de sesión:", error.response?.data || error.message);
            localStorage.removeItem('authToken');
            setToken(null);
            setUser(null);
            delete apiClient.defaults.headers.common['Authorization'];
            setIsLoadingAuth(false); // Termina el proceso de login (con error)
            throw error; 
        }
    };

    const logout = async () => {
        // Opcional: Llamar a un endpoint de logout en el backend si lo tienes
        // if (token) {
        //     try {
        //         await apiClient.post('auth/logout/', {}, { // Ajusta el endpoint si es necesario
        //             headers: { 'Authorization': `Token ${token}` }
        //         });
        //     } catch (error) {
        //         console.error("Error en el logout del backend:", error.response?.data || error.message);
        //     }
        // }
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        delete apiClient.defaults.headers.common['Authorization'];
        // La redirección se manejará en el componente que llama a logout (ej. TopBar)
    };

    // No renderizar hijos hasta que se complete la carga/verificación inicial del token.
    // Esto evita flashes de contenido protegido o redirecciones incorrectas.
    if (isLoadingAuth) {
        return <div>Verificando autenticación...</div>; // O un spinner/splash screen más elegante
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, isLoadingAuth }}>
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
