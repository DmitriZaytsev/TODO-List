export default {
  namespaced: true,
  state: {
    currentFilter: 'all',
    searchQuery: '',
    toast: {
      message: '',
      color: 'success',
      timeout: 3000,
      visible: false,
      right: true,
      elevation: 6
    }
  },
  mutations: {
    SET_FILTER(state, filter) {
      state.currentFilter = filter;
    },
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query;
    },
    SHOW_TOAST(state, payload) {
      state.toast.visible = true;

      if (typeof payload === 'string') {
        state.toast.message = payload;
        state.toast.color = 'success';
      } else {
        state.toast.message = payload.message || '';
        state.toast.color = payload.color || 'success';
        state.toast.timeout = payload.timeout || 3000;
        state.toast.right = payload.right !== undefined ? payload.right : true;
        state.toast.elevation = payload.elevation || 6;
      }
    },
    HIDE_TOAST(state) {
      state.toast.visible = false;
    }
  },
  actions: {
    setFilter({ commit }, filter) {
      commit('SET_FILTER', filter);
    },
    setSearchQuery({ commit }, query) {
      commit('SET_SEARCH_QUERY', query);
    }
  },
  getters: {
    currentFilter: state => state.currentFilter,
    searchQuery: state => state.searchQuery,
    toast: state => state.toast
  }
};
