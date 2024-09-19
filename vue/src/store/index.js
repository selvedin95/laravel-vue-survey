import { createStore } from "vuex";

const store = createStore({
    state: {
        user: {
            data: {name: 'Selvedin'},
            token: null
        }
    },
    getters: {},
    actions: {},
    mutations: {},
    modules: {}
});

export default store;