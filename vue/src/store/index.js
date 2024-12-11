import { createStore } from "vuex/dist/vuex";
import axiosClient from "../axios";
import axios from "axios";

const store = createStore({
    state: { 
        user: {
            data: {},
            token: sessionStorage.getItem('TOKEN'),
        },
        currentSurvey: {
            loading: false,
            data: {}
        },
        surveys: {
            loading: false,
            data: []
        },
        questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
    },
    getters: {},
    actions: {
        getSurvey({commit}, id) {
            commit("setCurrentSurveyLoading", true);
            return axiosClient
            .get(`/survey/${id}`)
            .then((res) => {
                commit("setCurrentSurvey", res.data);
                commit("setCurrentSurveyLoading", false);
                return res;
            })
            .catch((err) => {
                commit("setCurrentSurveyLoading", false);
                throw err;
            });
        },
        saveSurvey({ commit }, survey) {
            delete survey.image_url;
            let response;
            if (survey.id) {
                response = axiosClient
                .put(`/survey/${survey.id}`, survey)
                .then((res) => {
                    commit("setCurrentSurvey", res.data);
                    return res;
                });
            } else {
                response = axiosClient.post("/survey", survey).then((res) => {
                    commit("setCurrentSurvey", res.data);
                    return res;
                }).catch(error => {
                    console.log(error.response.data); // Prikaz grešaka validacije
                });
            }
            return response;
        },
        deleteSurvey({}, id) {
            return axiosClient.delete(`/survey/${id}`);
        },
        getSurveys({commit}) {
            commit('setSurveysLoading', true)
            return axiosClient.get("/survey").then((res) => {
                commit('setSurveysLoading', false)
                commit("setSurveys", res.data);
                return res;
            });
        },
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
        setCurrentSurveyLoading: (state, loading) => {
            state.currentSurvey.loading = loading;
        },
        setSurveysLoading: (state, loading) => {
            state.surveys.loading = loading;
        },
        setCurrentSurvey: (state, survey) => {
            state.currentSurvey.data = survey.data;
        },
        setSurveys: (state, surveys) => {
            state.surveys.data = surveys.data;
        },
        logout: (state) => {
            state.user.token = null;
            state.user.data = {};
            sessionStorage.removeItem('TOKEN');
        },
        setUser: (state, userData) => {
            state.user.token = userData.token;
            state.user.data = userData.user;
            sessionStorage.setItem('TOKEN', userData.token);
            // console.log("User data set in Vuex:", userData); 
        }    
    },
    modules: {}
});

export default store;
