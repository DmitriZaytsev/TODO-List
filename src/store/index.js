import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import tasks from './modules/tasks';
import ui from './modules/ui';

Vue.use(Vuex);

const store = {
  modules: {
    tasks,
    ui
  },
  plugins: [
    createPersistedState({
      paths: ['tasks.tasks', 'ui.currentFilter'],
      storage: window.localStorage
    })
  ]
};

export default new Vuex.Store(store);
