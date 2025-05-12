export const storeApiRequest = async (context, requestFn, options = {}) => {
  const {
    background = false,
    action = 'default',
    commitBeforeRequest = false,
    commitFn = null
  } = options;

  if (!background) {
    context.commit('SET_LOADING', { action, isLoading: true });
    context.commit('SET_ERROR', { action, error: null });
  }

  if (commitBeforeRequest && typeof commitFn === 'function') {
    commitFn();
  }

  try {
    return await requestFn();
  } catch (err) {
    if (!background) {
      const error = err.response?.data?.message || err.message || 'Ошибка запроса';
      context.commit('SET_ERROR', { action, error });
    }
    throw err;
  } finally {
    if (!background) {
      context.commit('SET_LOADING', { action, isLoading: false });
    }
  }
};
