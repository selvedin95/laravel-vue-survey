import { createStore } from "vuex/dist/vuex";
import axiosClient from "../axios";

const tmpSurveys = [
    {
        id: 100,
        title: "My content",
        slug: "my-content",
        status: "draft",
        image: "https://picsum.photos/400/400",
        description: "My name is Selvedin.<br>I am a Certified PHP Web Developer",
        created_at: "2024-10-14 15:00:00",
        updated_at: "2024-10-14 15:00:00",
        expire_date: "2024-10-31 15:00:00",
        questions: [
            {
                id: 1,
                type: "select",
                question: "From which country are you?",
                description: null,
                data: {
                    options: [
                        { uuid: "92688ac6-b11c-40c7-b17b-4ab8e3c55e67", text: "USA"},
                        { uuid: "b5052dc5-f2bb-4560-a865-cc8502fab7a7", text: "Germany" },
                        { uuid: "9e23432f-9e58-40f7-b80a-e794051be268", text: "BIH"},
                        { uuid: "0412bb14-441e-44cd-b27d-9a412a866cb0", text: "Serbia"},
                        { uuid: "cf9ed81b-bd7a-4087-b49d-f444d9393bc1", text: "Croatia"},
                    ],
                },
            },
            {
                id: 2,
                type: "checkbox",
                question: "Sed aliquet nulla at nisi euismod imperdiet. Nullam vitae mollis urna?",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                data: {
                    options: [
                        { uuid: "4ff49025-c14f-422e-8a13-c271b01fa156", text: "JavaScript"},
                        { uuid: "6f062c4b-f860-4438-be37-df8de2f4493c", text: "PHP"},
                        { uuid: "8fcff85e-507c-4d5d-ba4f-7925713915d6", text: "HTML + CSS"},
                        { uuid: "faf45283-aa8b-4bf4-b4eb-8d382e9237e5", text: "All of the above"},
                    ],
                },
            },
        ],
    },
];

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
        surveys: [...tmpSurveys],
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
        setCurrentSurvey: (state, survey) => {
            state.currentSurvey.data = survey.data;
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
