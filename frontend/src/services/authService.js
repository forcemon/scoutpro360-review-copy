// frontend/src/services/authService.js
import apiClient from './api';
import { jwtDecode } from 'jwt-decode';

// Datos simulados para el usuario. En una aplicación real, estos datos vendrían del backend.
const MOCK_USER_PROFILE_DATA = {
  role: 'Scout',
  team_name: 'Club Atlético Independiente',
  image_url: `https://ui-avatars.com/api/?name=Mauricio+Scout&background=0D8ABC&color=fff&size=100&bold=true`
};

// Token JWT simulado. Este token está diseñado para expirar en un futuro lejano.
// Incluye información básica del usuario y su perfil para la simulación.
const MOCK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6Ik1hdXJpY2lvIFNjb3V0IiwiZW1haWwiOiJtYXVyaWNpb0BleGFtcGxlLmNvbSIsImV4cCI6MzI1MDM2ODAwMDAsInByb2ZpbGUiOnsicm9sZSI6IlNjb3V0IiwidGVhbV9uYW1lIjoiQ2x1YiBBdGzDqXRpY28gSW5kZXBlbmRpZW50ZSIsImltYWdlX3VybCI6Imh0dHBzOi8vdWktYXZhdGFycy5jb20vYXBpLz9uYW1lPU1hdXJpY2lvK1Njb3V0JmJhY2tncm91bmQ9MEQ4QUJDJmNvbG9yPWZmZiZzaXplPTEwMCZib2xkPXRydWUifX0.mock_jwt_signature_for_testing_only";

/**
 * Simula un inicio de sesión.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} Un objeto con `user` y `tokens`.
 */
export const login = async (username, password) => {
  console.log("[authService] Intentando login simulado con:", { username });

  // Simulación de la lógica de autenticación
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password) { // Validación básica de credenciales (simulada)
        const tokens = { access: MOCK_TOKEN, refresh: "mockRefreshTokenSimulated" };
        localStorage.setItem('authTokens', JSON.stringify(tokens)); // Guardar tokens en localStorage

        try {
          const decodedToken = jwtDecode(tokens.access);
          const user = {
              id: decodedToken.user_id,
              username: decodedToken.username,
              email: decodedToken.email,
              profile: decodedToken.profile || MOCK_USER_PROFILE_DATA // Usar perfil del token o el mock
          };
          console.log("[authService] Login simulado exitoso:", { user });
          resolve({ user, tokens });
        } catch (e) {
          console.error("[authService] Error decodificando MOCK_TOKEN durante login:", e);
          reject(new Error("Error interno con token simulado."));
        }
      } else {
        console.error("[authService] Login simulado fallido: Credenciales inválidas");
        reject(new Error("Credenciales inválidas (simulado)"));
      }
    }, 500); // Simular demora de red
  });
};

/**
 * Cierra la sesión del usuario eliminando los tokens.
 */
export const logout = () => {
  localStorage.removeItem('authTokens');
  console.log("[authService] Logout realizado.");
  // En una aplicación real, aquí también se podría invalidar el token en el backend.
};

/**
 * Obtiene los datos del usuario actual a partir del token almacenado en localStorage.
 * Verifica la expiración del token.
 * @returns {object|null} El objeto del usuario si está autenticado y el token es válido, sino null.
 */
export const getCurrentUser = () => {
  const authTokensString = localStorage.getItem('authTokens');
  if (authTokensString) {
    try {
      const tokens = JSON.parse(authTokensString);
      if (!tokens.access) {
        console.warn("[authService] No se encontró access token en localStorage.");
        logout(); // Limpiar si la estructura es incorrecta
        return null;
      }

      const decodedToken = jwtDecode(tokens.access);

      // Verifica si el token ha expirado (exp está en segundos, Date.now() en milisegundos)
      if (decodedToken.exp * 1000 < Date.now()) {
        console.warn("[authService] Token expirado.");
        logout(); // Limpiar el token expirado
        return null;
      }

      // Construye el objeto de usuario con la información del token
      const user = {
        id: decodedToken.user_id,
        username: decodedToken.username,
        email: decodedToken.email,
        profile: decodedToken.profile || { // Fallback si el perfil no está en el token
            role: 'Viewer',
            team_name: '',
            image_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(decodedToken.username || 'U')}&background=0D8ABC&color=fff&size=100&bold=true`
        }
      };
      // console.log("[authService] Usuario actual recuperado del token:", user);
      return user;
    } catch (error) {
      console.error("[authService] Error procesando token almacenado:", error);
      logout(); // Limpiar en caso de token inválido o error de parseo
      return null;
    }
  }
  // console.log("[authService] No se encontraron tokens en localStorage.");
  return null;
};

/**
 * Verifica si el usuario está autenticado.
 * @returns {boolean} True si el usuario está autenticado, false en caso contrario.
 */
export const isAuthenticated = () => {
  const user = getCurrentUser(); // getCurrentUser maneja la lógica de expiración y validez del token
  return !!user; // Retorna true si user no es null/undefined
};

export default {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};
