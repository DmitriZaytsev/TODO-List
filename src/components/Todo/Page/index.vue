<script>
import LayoutHeader from '@/components/layout/Header';
import LayoutFooter from '@/components/layout/Footer';
import TodoList from '@/components/Todo/List';
import TodoFormModal from '@/components/Todo/FormModal';
import { VBtn, VSelect, VTextField,
  VProgressLinear } from 'vuetify/lib/components';
import { mapState, mapActions, mapGetters } from 'vuex';
import { confirmModal, toast } from '@/utils';

export default {
  name: 'TodoPage',
  components: {
    LayoutFooter,
    LayoutHeader,
    TodoList,
    TodoFormModal,
    VBtn,
    VSelect,
    VTextField,
    VProgressLinear
  },
  data() {
    return {
      filterOptions: [
        { text: 'Все', value: 'all' },
        { text: 'Активные', value: 'active' },
        { text: 'Выполненные', value: 'completed' }
      ],
      statusTexts: {
        all: 'все',
        active: 'активные',
        completed: 'выполненные'
      },
      isAddModalOpen: false
    };
  },
  computed: {
    ...mapState({
      tasks: state => state.tasks.tasks,
      loadingStates: state => state.tasks.loadingStates,
      errorStates: state => state.tasks.errorStates
    }),
    ...mapGetters({
      activeTasks: 'tasks/activeTasks',
      completedTasks: 'tasks/completedTasks',
      filteredTasks: 'tasks/filteredTasks',
      isLoading: 'tasks/isLoading'
    }),
    selectedFilter: {
      get() {
        return this.$store.state.ui.currentFilter;
      },
      set(value) {
        this.setFilter(value);
      }
    },
    searchQuery: {
      get() {
        return this.$store.state.ui.searchQuery;
      },
      set(value) {
        this.setSearchQuery(value);
      }
    },
    hasFilteredTasks() {
      return this.filteredTasks && this.filteredTasks.length > 0;
    },
    deleteButtonText() {
      if (this.searchQuery.trim()) {
        return 'Удалить эти задачи';
      }

      return `Удалить ${this.statusTexts[this.selectedFilter] || 'все'} задачи`;
    },
    isFetchingTasks() {
      return this.loadingStates.fetchTasks;
    },
    isDeletingTasks() {
      return this.loadingStates.deleteFilteredTasks;
    }
  },
  created() {
    this.initTasks();
  },
  methods: {
    ...mapActions({
      setFilter: 'ui/setFilter',
      setSearchQuery: 'ui/setSearchQuery',
      fetchTasks: 'tasks/fetchTasks',
      deleteFilteredTasks: 'tasks/deleteFilteredTasks'
    }),
    async initTasks() {
      try {
        await this.fetchTasks();
      } catch (error) {
        toast.error('Не удалось загрузить задачи');
      }
    },
    openAddModal() {
      this.isAddModalOpen = true;
    },
    closeAddModal(result) {
      this.isAddModalOpen = false;
      if (result && result.success) {
        if (result.action === 'create') {
          toast.success('Задача успешно создана');
        } else if (result.action === 'update') {
          toast.success('Задача успешно обновлена');
        }
      }
    },
    async handleDeleteAll() {
      const filterText = this.statusTexts[this.selectedFilter] || 'все';

      const confirmed = await confirmModal({
        title: 'Удаление задач',
        text: `Вы действительно хотите удалить ${filterText} задачи?`,
        confirmText: 'Удалить',
        cancelText: 'Отмена',
        confirmColor: 'error',
        persistent: true,
        loading: true
      });

      if (confirmed) {
        try {
          const taskIdsToDelete = this.filteredTasks.map(task => task.id);
          await this.deleteFilteredTasks(taskIdsToDelete);
          toast.success(`${filterText} задачи успешно удалены`);
        } catch (error) {
          toast.error('Ошибка при удалении задач');
        }
      }
    }
  }
};
</script>

<template>
  <div class="page-wrapper">
    <LayoutHeader />
    <main class="main todo-container">
      <h1 class="todo-title">Список задач</h1>
      <VProgressLinear
        v-if="isFetchingTasks"
        indeterminate
        color="primary"
        class="mb-4"
      />

      <section class="todo-buttons">
        <VBtn
          color="primary"
          variant="elevated"
          :loading="loadingStates.createTask"
          :disabled="isLoading"
          @click="openAddModal"
        >
          Добавить задачу
        </VBtn>
        <VBtn
          color="error"
          variant="elevated"
          :disabled="!hasFilteredTasks || isLoading"
          :loading="isDeletingTasks"
          @click="handleDeleteAll"
        >
          {{ deleteButtonText }}
        </VBtn>
      </section>

      <section class="todo-filters">
        <VTextField
          v-model="searchQuery"
          label="Поиск задач"
          placeholder="Введите текст для поиска"
          prepend-inner-icon="mdi-magnify"
          clearable
          outlined
          density="comfortable"
          :disabled="isLoading"
          class="todo-search"
        />
        <VSelect
          v-model="selectedFilter"
          :items="filterOptions"
          label="Фильтр"
          outlined
          density="comfortable"
          hide-details
          :disabled="isLoading"
          class="todo-filter"
        />
      </section>

      <TodoList class="todo-list" />
    </main>
    <LayoutFooter />
    <TodoFormModal
      :is-open="isAddModalOpen"
      @close="closeAddModal" />
  </div>
</template>

<style scoped lang="scss">
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .main {
    background-color: $gray;
    flex: 1;
    padding: 1.25rem;
  }
}

.todo {
  &-container {
    width: 100%;
    max-width: 37.5rem;
    margin: 0 auto;
    position: relative;
  }

  &-title {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #2c3e50;
    font-size: 1.75rem;
    font-weight: 600;
  }

  &-buttons {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    width: 100%;
    margin-bottom: 1.25rem;

    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
    }

    .v-btn {
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      min-height: 2.5rem !important;
      display: flex;
      align-items: center;
      justify-content: center;

      @media (max-width: $breakpoint-sm) {
        min-height: 3rem !important;
      }
    }
  }

  &-filters {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 1.25rem;
    width: 100%;

    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
      gap: 0;
      margin-bottom: 1rem;
    }
  }

  &-search {
    flex: 3;

    @media (max-width: $breakpoint-sm) {
      margin-bottom: -0.5rem;
    }
  }

  &-filter {
    width: 12.5rem;
    flex-shrink: 0;
    flex: 1;

    @media (max-width: $breakpoint-sm) {
      width: 100%;
      margin-top: -0.375rem;
    }

    :deep(.v-field) {
      min-width: 12.5rem;

      @media (max-width: $breakpoint-sm) {
        min-width: 100%;
      }
    }

    :deep(.v-field__input) {
      min-width: 12.5rem;

      @media (max-width: $breakpoint-sm) {
        min-width: 100%;
      }
    }
  }

  &-list {
    position: relative;
    min-height: 12.5rem;
    margin-top: 0.625rem;

    @media (max-width: $breakpoint-sm) {
      margin-top: 1rem;
    }
  }
}
</style>
