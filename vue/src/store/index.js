import { createStore } from "vuex/dist/vuex";
import axiosClient from "../axios";

const store = createStore({
    state: { 
        user: {
            data: {},
            token: sessionStorage.getItem('TOKEN'),
        },
    },
    getters: {},
    actions: {
        register({ commit }, user) {
            const userData = {
                name: user.name,
                email: user.email,
                password: user.password,
                password_confirmation: user.password_confirmation,
            };

            return axiosClient.post('/register', userData)
                .then((response) => {
                    commit('setUser', response.data);
                    return response.data;
                })
                .catch((error) => {
                    console.error("Greška prilikom registracije:", error.response.data);
                    throw error;
                });
        },
        login({ commit }, user) {
            return axiosClient.post('/login', user)
                .then((response) => {
                    commit('setUser', response.data);
                    return response.data;
                })
                .catch((error) => {
                    console.error("Greška prilikom prijave:", error.response.data);
                    throw error;
                });
        },
        logout({commit}) {
            return axiosClient.post('/logout')
            .then((response) => {
                commit('logout')
                return response;
            })
        }
    },
    mutations: {
        logout: (state) => {
            state.user.token = null;
            state.user.data = {};
            sessionStorage.removeItem('TOKEN');
        },
        setUser: (state, userData) => {
            state.user.token = userData.token;
            state.user.data = userData.user;
            sessionStorage.setItem('TOKEN', userData.token);
            // console.log("User data set in Vuex:", userData); // Provjerite šta se čuva
        }    
    },
    modules: {}
});

export default store;
