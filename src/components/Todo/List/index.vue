<script>
import TodoItem from '@/components/Todo/Item';
import { mapActions, mapGetters, mapState } from 'vuex';
import draggable from 'vuedraggable';
import { VProgressCircular, VSkeletonLoader } from 'vuetify/lib/components';

export default {
  name: 'TodoList',
  components: {
    TodoItem,
    draggable,
    VProgressCircular,
    VSkeletonLoader
  },
  computed: {
    ...mapState({
      loadingStates: state => state.tasks.loadingStates
    }),
    ...mapGetters({
      filteredTasks: 'tasks/filteredTasks',
      isLoading: 'tasks/isLoading'
    }),
    localTasks: {
      get() {
        return this.filteredTasks;
      },
      set(value) {
        this.reorderTasks(value);
      }
    },
    isFetchingTasks() {
      return this.loadingStates.fetchTasks;
    },
    showSkeletonLoaders() {
      return this.isFetchingTasks && this.filteredTasks.length === 0;
    },
    showNoTasksMessage() {
      return this.filteredTasks.length === 0 && !this.isFetchingTasks;
    },
    showLoadingOverlay() {
      return this.isLoading && this.filteredTasks.length > 0;
    }
  },
  methods: {
    ...mapActions({
      reorderTasks: 'tasks/reorderTasks'
    })
  }
};
</script>

<template>
  <div class="tasks">
    <div
      v-if="showSkeletonLoaders"
      class="task-skeletons">
      <VSkeletonLoader
        v-for="i in 5"
        :key="i"
        class="mb-2"
        type="card" />
    </div>

    <!-- Список задач -->
    <draggable
      v-else
      v-model="localTasks"
      tag="div"
      class="tasks-list"
      :animation="150"
      ghost-class="ghost"
      handle=".drag-handle"
      :disabled="isLoading"
    >
      <transition-group name="todo-item">
        <TodoItem
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task" />
      </transition-group>
    </draggable>

    <div
      v-if="showNoTasksMessage"
      class="no-tasks-message">
      Не найдено задач :((
    </div>

    <div
      v-if="showLoadingOverlay"
      class="loading-overlay">
      <VProgressCircular
        indeterminate
        color="primary"
        size="32" />
    </div>
  </div>
</template>

<style scoped lang="scss">
$border-radius-sm: 0.25rem;
$transition-duration: 0.5s;
$scrollbar-width: 0.5rem;
$spacing-sm: 0.625rem;
$spacing-md: 1.25rem;
$spacing-lg: 1.875rem;

$color-background: #f1f1f1;
$color-text-muted: #777;
$color-scrollbar: #888;
$color-scrollbar-hover: #555;
$color-ghost-bg: #c8ebfb;
$color-ghost-border: #4a9eff;
$color-overlay-bg: rgba(255, 255, 255, 0.6);

.tasks {
  max-width: 100%;
  margin: 0 auto;
  max-height: 80vh;
  overflow: hidden;
  position: relative;

  @media (max-width: $breakpoint-sm) {
    max-height: 70vh;
  }

  &-list {
    min-height: 3.125rem;
    max-height: calc(80vh - 2.5rem);
    overflow-y: auto;
    padding-right: $spacing-sm;

    @media (max-width: $breakpoint-sm) {
      max-height: calc(70vh - 2.5rem);
      padding-right: $spacing-sm * 0.5;
    }

    &::-webkit-scrollbar {
      width: $scrollbar-width;

      @media (max-width: $breakpoint-sm) {
        width: $scrollbar-width * 0.75;
      }

      &-track {
        background: $color-background;
        border-radius: $border-radius-sm;
      }

      &-thumb {
        background: $color-scrollbar;
        border-radius: $border-radius-sm;

        &:hover {
          background: $color-scrollbar-hover;
        }
      }
    }
  }
}

.no-tasks-message {
  text-align: center;
  color: $color-text-muted;
  margin-top: $spacing-md;
  font-size: 1rem;

  @media (max-width: $breakpoint-sm) {
    margin-top: $spacing-sm;
    font-size: 0.875rem;
  }
}

.ghost {
  opacity: 0.5;
  background: $color-ghost-bg;
  border: 0.125rem dashed $color-ghost-border;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-overlay-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.task-skeletons {
  padding: $spacing-sm;

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-sm * 0.5;
  }
}

/* Анимации для появления и удаления задач */
.todo-item {
  &-enter-active,
  &-leave-active {
    transition: all $transition-duration;

    @media (max-width: $breakpoint-sm) {
      transition: all $transition-duration * 0.75;
    }
  }

  &-enter-from {
    opacity: 0;
    transform: translateY($spacing-lg);

    @media (max-width: $breakpoint-sm) {
      transform: translateY($spacing-md);
    }
  }

  &-leave-to {
    opacity: 0;
    transform: translateX($spacing-lg);

    @media (max-width: $breakpoint-sm) {
      transform: translateX($spacing-md);
    }
  }

  &-move {
    transition: transform $transition-duration;
  }
}
</style>
