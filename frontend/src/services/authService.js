// frontend/src/services/authService.js
import apiClient from './api'; // Asumiendo que tu apiClient (axios) está configurado
import { jwtDecode } from 'jwt-decode'; // Necesitarás instalar jwt-decode: npm install jwt-decode

const MOCK_USER_DATA = {
  id: 1,
  username: "Mauricio Scout",
  email: "mauricio@example.com",
  // Puedes añadir más campos que esperes del perfil de usuario
  profile: {
    role: 'Scout',
    team_name: 'Club Atlético Independiente',
    image_url: `https://ui-avatars.com/api/?name=Mauricio+Scout&background=0D8ABC&color=fff&size=100&bold=true`
  }
};

const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Ik1hdXJpY2lvIFNjb3V0IiwiZXhwIjoxNzU4Njg4MDAwLCJlbWFpbCI6Im1hdXJpY2lvQGV4YW1wbGUuY29tIiwicm9sZSI6IlNjb3V0IiwidGVhbV9uYW1lIjoiQ2x1YiBBdGzDqXRpY28gSW5kZXBlbmRpZW50ZSJ9.mockTokenSignature12345"; // Token de ejemplo, expira muy en el futuro

/**
 * Simula un inicio de sesión.
 * En una aplicación real, esto haría una petición POST a /api/token/ o similar.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>}
 */
export const login = async (username, password) => {
  console.log("[authService] Intentando login con:", { username });
  // Simulación de una llamada a la API
  // await apiClient.post('/token/', { username, password });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password) { // Simulación básica de credenciales
        const user = MOCK_USER_DATA;
        const tokens = { access: MOCK_TOKEN, refresh: "mockRefreshToken" };
        localStorage.setItem('authTokens', JSON.stringify(tokens));
        // apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`; // Esto se manejaría mejor en apiClient con interceptors
        console.log("[authService] Login simulado exitoso:", { user, tokens });
        resolve({ user, tokens });
      } else {
        console.error("[authService] Login simulado fallido: Credenciales inválidas");
        reject(new Error("Credenciales inválidas (simulado)"));
      }
    }, 500);
  });
};

/**
 * Cierra la sesión del usuario.
 */
export const logout = () => {
  localStorage.removeItem('authTokens');
  // delete apiClient.defaults.headers.common['Authorization']; // Limpiar header
  console.log("[authService] Logout realizado.");
  // Aquí podrías llamar a una API endpoint para invalidar el refresh token si existiera
};

/**
 * Obtiene los datos del usuario a partir del token almacenado.
 * @returns {object|null}
 */
export const getCurrentUser = ()=> {
  const tokens = JSON.parse(localStorage.getItem('authTokens'));
  if (tokens && tokens.access) {
    try {
      const decodedToken = jwtDecode(tokens.access);
      // Simula la estructura del MOCK_USER_DATA basado en el token si es necesario
      // o, mejor aún, que el token ya contenga la info necesaria o se haga otra llamada a /api/users/me/
      console.log("[authService] Usuario actual decodificado:", decodedToken);
      // Para mantener consistencia con la estructura usada en el TopBar del repo de referencia:
      return {
        id: decodedToken.user_id || MOCK_USER_DATA.id,
        username: decodedToken.username || MOCK_USER_DATA.username,
        email: decodedToken.email || MOCK_USER_DATA.email,
        profile: { // Simula que el perfil también viene o se infiere
            role: decodedToken.role || MOCK_USER_DATA.profile.role,
            image_url: MOCK_USER_DATA.profile.image_url, // Asumir que la imagen no está en el token
            team_name: decodedToken.team_name || MOCK_USER_DATA.profile.team_name,
        }
      };
    } catch (error) {
      console.error("[authService] Error decodificando token:", error);
      logout(); // Token inválido o expirado
      return null;
    }
  }
  return null;
};

/**
 * Verifica si el usuario está autenticado.
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const user = getCurrentUser();
  return !!user; // Retorna true si user no es null/undefined
};

// Podrías añadir funciones para refrescar token aquí
// export const refreshToken = async () => { ... }

// Interceptor para añadir el token a todas las peticiones salientes
// Esto es una forma más robusta de manejar los tokens que setearlo directamente en apiClient.defaults
// Necesitas configurar esto en tu archivo api.js o aquí mismo si prefieres.
// Ejemplo en apiClient.js:
/*
apiClient.interceptors.request.use(config => {
  const tokens = JSON.parse(localStorage.getItem('authTokens'));
  if (tokens && tokens.access) {
    config.headers.Authorization = `Bearer ${tokens.access}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});
*/

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};
