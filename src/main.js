import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import Buefy from 'buefy'
import firebase from 'firebase'
import VueMoment from 'vue-moment'

const firebaseConfig = {
    apiKey: "AIzaSyB7BDbZtQkpIySJEVaCLQlcfmTj5_bOe_E",
    authDomain: "social-network-66b92.firebaseapp.com",
    databaseURL: "https://social-network-66b92.firebaseio.com",
    projectId: "social-network-66b92",
    storageBucket: "social-network-66b92.appspot.com",
    messagingSenderId: "987156326784",
    appId: "1:987156326784:web:7107ec434a702cfa783965",
    measurementId: "G-JE5HRZ7RYB"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(firebase);
Vue.use(VueMoment);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
