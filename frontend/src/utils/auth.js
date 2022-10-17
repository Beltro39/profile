import Cookies from 'js-cookie'
import axios from 'axios'
import { useState, createContext, useContext } from 'react'

//hook personalizado utilizado para el proceso de autenticación
export const useAuth = () => {

    //se usa AuthContext definido mas adelante para tener la info del usuario disponible a lo largo de la aplicación
    const { userInfo, setUserInfo } = useContext(AuthContext);

    //Método para obtener los datos del usuario una vez loggeado
    const getUserData = async (token) => {
        let config = {
            headers: {
                "Authorization": "JWT " + token ?? userInfo.access_token,
                "Content-Type": "application/json"
            }
        }
        return await axios.get(process.env.REACT_APP_AUTH_SERVICE + 'users/me/', config).then(response => {
            if (response.status === 200) {
                setUserInfo({
                    access_token: token,
                    username: response.data.username,
                    tools: response.data.tools,
                    rol: response.data.rol,
                    avatar: response.data.avatar
                });
            }
            return response
        }).catch(error => {
            return error.response
        })
    }

    //Método para autenticar al usuario cuando ingresa por el formulario de login
    const login = async (username, password) => {
        return await axios.post(process.env.REACT_APP_AUTH_SERVICE + 'jwt/create/', { username, password }).then(response => {
            if (response.status === 200) {
                setUserInfo({
                    access_token: response.data.access,
                })
                Cookies.set('refresh_token', response.data.refresh)
            }
            return response
        }).then(response => getUserData(response.data.access)).catch(error => {
            return error.response
        })
    };

    //Método para cerrar la sesión del usuario
    const logout = () => {
        setUserInfo({})
        Cookies.remove('refresh_token')
    };

    //Método para refrescar el token de acceso del usuario y validar que el token de refresco siga siendo vigente
    const refresh = async () => {
        if (!couldBeAuthenticated()) return

        const refresh = Cookies.get('refresh_token')
        return axios.post(process.env.REACT_APP_AUTH_SERVICE + 'jwt/refresh/', { refresh }).then(response => {
            if (response.status === 200) {
                setUserInfo({
                    ...userInfo,
                    access_token: response.data.access,
                    username: response.data.username,
                    tools: response.data.tools,
                    rol: response.data.rol,
                    avatar: response.data.avatar
                })
                return response.data.access
            }
            else {
                logout()
            }

        }).then((access) => getUserData(access)).catch(error => {
            logout()
        })
    }

    //Método para registrar al usuario desde el formulario de registro
    const register = async (username, password) => {
        return await axios.post(process.env.REACT_APP_AUTH_SERVICE + 'users/', { username, password}).then(response => {
            return response
        }).catch(error => {
            return error.response
        })
    }

    //Método para solicitar el correo de cambio de contraseña
    const reset_password = async (email) => {
        return await axios.post(process.env.REACT_APP_AUTH_SERVICE + 'users/reset_password/', { email }).then(response => {
            return response
        }).catch(error => {
            return error.response
        })
    };

    //Método para cambiar la contraseña del usuario con los token definidos en el link enviado al correo
    const renew_password = async (new_password, uid, token) => {
        return await axios.post(process.env.REACT_APP_AUTH_SERVICE + 'users/reset_password_confirm/', { new_password, uid, token }).then(response => {
            return response
        }).catch(error => {
            return error.response
        })
    };

    //Método para activar la cuenta del usuario con el token definido en el link enviado al correo
    const activate_account = async (uid, token) => {
        return await axios.post(process.env.REACT_APP_AUTH_SERVICE + 'users/activation/', { uid, token }).then(response => {
            return response
        }).catch(error => {
            return error.response
        });
    }

    //Método para validar si el usuario está autenticado
    const isAuthenticated = () => !!userInfo.access_token

    //Método para validar si el usuario puede autenticarse o no
    const couldBeAuthenticated = () => !!Cookies.get('refresh_token')

    //Instancia de axios personalizada para usar la autenticación en todas las peticiones
    const axiosAuth = axios.create();

    //añadirmos un interceptor para que todas las peticiones sean autenticadas
    axiosAuth.interceptors.request.use(
        async (config) => {
            if (userInfo.access_token) {
                config.headers["Authorization"] = "JWT " + userInfo.access_token; // for Node.js Express back-end
            }
            return config;
        },
        (error) => {
            logout();
            return Promise.reject(error);
        }
    );

    //se interceptan los response para que en caso de que haya errores en un response relacionados a autenticación se intente refrescar el token de acceso
    axiosAuth.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            const originalConfig = err.config;
            if (err.response) {
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;
                    try {
                        const token = await refresh();
                        originalConfig.headers["Authorization"] = "JWT " + token;
                        return axiosAuth(originalConfig);
                    } catch (_error) {

                        return Promise.reject(_error);
                    }
                }
            }
            return Promise.reject(err);
        }
    );

    return { isAuthenticated, login, logout, refresh, register, axiosAuth, couldBeAuthenticated, getUserData, reset_password, renew_password, activate_account }
};

//hook useContext para todo lo relacionado al login de usuarios 
export const AuthContext = createContext({});

//provider que envuelve la aplicación para permitir el uso del AuthContext
export const AuthProvider = ({ children }) => {

    const [userInfo, setUserInfo] = useState({
        username: "",
        tools: {},
        rol: "",
        avatar: ""
    })

    return (
        <AuthContext.Provider
            value={{
                userInfo,
                setUserInfo
            }}
        >
            {children}
        </AuthContext.Provider >
    )
};