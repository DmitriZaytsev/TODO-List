import store from '@/store';

export const toast = {
  show(options) {
    store.commit('ui/SHOW_TOAST', options);
  },

  success(message, options = {}) {
    store.commit('ui/SHOW_TOAST', { message, color: 'success', ...options });
  },

  error(message, options = {}) {
    store.commit('ui/SHOW_TOAST', { message, color: 'error', ...options });
  },

  warning(message, options = {}) {
    store.commit('ui/SHOW_TOAST', { message, color: 'warning', ...options });
  },

  info(message, options = {}) {
    store.commit('ui/SHOW_TOAST', { message, color: 'info', ...options });
  },

  hide() {
    store.commit('ui/HIDE_TOAST');
  }
};
