import axios from 'axios';
import { getMockTasksURL, getMockTaskURL } from '@/config/request-urls';
import { storeApiRequest } from '@/utils/store-api-request';

export default {
  namespaced: true,
  state: {
    tasks: [],
    currentTask: null,
    loadingStates: {
      fetchTasks: false,
      createTask: false,
      updateTask: false,
      deleteTask: false,
      deleteFilteredTasks: false,
      getTaskById: false,
      default: false
    },
    errorStates: {
      fetchTasks: null,
      createTask: null,
      updateTask: null,
      deleteTask: null,
      deleteFilteredTasks: null,
      getTaskById: null,
      default: null
    }
  },
  mutations: {
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    ADD_TASK(state, task) {
      state.tasks.unshift(task);
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
      }
    },
    DELETE_TASK(state, taskId) {
      state.tasks = state.tasks.filter(t => t.id !== taskId);
    },
    DELETE_TASKS(state) {
      state.tasks = [];
    },
    DELETE_FILTERED_TASKS(state, taskIds) {
      if (Array.isArray(taskIds) && taskIds.length > 0) {
        state.tasks = state.tasks.filter(task => !taskIds.includes(task.id));
      }
    },
    SET_CURRENT_TASK(state, task) {
      state.currentTask = task;
    },
    SET_LOADING(state, { action, isLoading }) {
      state.loadingStates[action] = isLoading;
    },
    SET_ERROR(state, { action, error }) {
      state.errorStates[action] = error;
    },
    REORDER_TASKS(state, newOrder) {
      state.tasks = newOrder;
    }
  },
  actions: {
    async fetchTasks(context) {
      if (context.state.tasks && context.state.tasks.length > 0) {
        return context.state.tasks;
      }

      return storeApiRequest(
        context,
        async () => {
          const response = await axios.get(getMockTasksURL());
          context.commit('SET_TASKS', response.data);
          return response.data;
        },
        { action: 'fetchTasks' }
      );
    },

    async createTask(context, taskData) {
      return storeApiRequest(
        context,
        async () => {
          const response = await axios.post(getMockTasksURL(), {
            ...taskData,
            status: 'active',
            createdAt: new Date().toISOString()
          });
          context.commit('ADD_TASK', response.data);
          return response.data;
        },
        { action: 'createTask' }
      );
    },

    async updateTask(context, { id, ...taskData }) {
      return storeApiRequest(
        context,
        async () => {
          const response = await axios.patch(getMockTaskURL(id), taskData);
          context.commit('UPDATE_TASK', response.data);
          return response.data;
        },
        { action: 'updateTask' }
      );
    },

    async deleteTask(context, taskId) {
      return storeApiRequest(
        context,
        async () => {
          await axios.delete(getMockTaskURL(taskId));
          return true;
        },
        {
          action: 'deleteTask',
          commitBeforeRequest: true,
          commitFn: () => context.commit('DELETE_TASK', taskId)
        }
      );
    },

    deleteAllTasks({ commit }) {
      commit('DELETE_TASKS');
    },

    async deleteFilteredTasks({ commit }, taskIds) {
      commit('SET_LOADING', { action: 'deleteFilteredTasks', isLoading: true });
      try {
        // имитация задержки
        await new Promise(resolve => {
          setTimeout(resolve, 500);
        });
        commit('DELETE_FILTERED_TASKS', taskIds);
        commit('SET_ERROR', { action: 'deleteFilteredTasks', error: null });
        return true;
      } catch (error) {
        commit('SET_ERROR', { action: 'deleteFilteredTasks', error });
        throw error;
      } finally {
        commit('SET_LOADING', {
          action: 'deleteFilteredTasks',
          isLoading: false
        });
      }
    },

    async getTaskById(context, taskId) {
      const existing = context.state.tasks.find(t => t.id === taskId);
      if (existing) {
        context.commit('SET_CURRENT_TASK', existing);
        return existing;
      }

      return storeApiRequest(
        context,
        async () => {
          const response = await axios.get(getMockTaskURL(taskId));
          context.commit('SET_CURRENT_TASK', response.data);
          return response.data;
        },
        { action: 'getTaskById' }
      );
    },

    reorderTasks({ commit }, newOrder) {
      commit('REORDER_TASKS', newOrder);
    }
  },
  getters: {
    allTasks: state => state.tasks,
    activeTasks: state => state.tasks.filter(t => t.status === 'active'),
    completedTasks: state => state.tasks.filter(t => t.status === 'completed'),
    currentTask: state => state.currentTask,
    loadingStates: state => state.loadingStates,
    errorStates: state => state.errorStates,
    isLoading: state => Object.values(state.loadingStates).some(status => status),
    filteredTasks: (state, getters, rootState) => {
      const { currentFilter, searchQuery } = rootState.ui;

      let tasks;
      switch (currentFilter) {
        case 'active':
          tasks = getters.activeTasks;
          break;
        case 'completed':
          tasks = getters.completedTasks;
          break;
        default:
          tasks = [...state.tasks];
      }

      if (searchQuery.trim()) {
        return tasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      return tasks;
    }
  }
};
