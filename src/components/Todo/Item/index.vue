<script>
import { VCard, VBtn, VIcon, VCheckbox } from 'vuetify/lib/components';
import { mapActions, mapState } from 'vuex';
import { confirmModal } from '@/utils/confirm-modal';
import TodoFormModal from '@/components/Todo/FormModal';
import { toast } from '@/utils';

export default {
  name: 'TodoItem',
  components: {
    VCard,
    VCheckbox,
    VBtn,
    VIcon,
    TodoFormModal
  },
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        title: '',
        status: 'active',
        createdAt: ''
      })
    }
  },
  data() {
    return {
      showSnackbar: false,
      snackbarText: '',
      snackbarColor: 'success',
      isEditModalOpen: false,
      isToggling: false
    };
  },
  computed: {
    ...mapState({
      loadingStates: state => state.tasks.loadingStates,
      errorStates: state => state.tasks.errorStates
    }),
    formattedDate() {
      if (!this.task.createdAt) return '';
      const date = new Date(this.task.createdAt);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    isCompleted: {
      get() {
        return this.task.status === 'completed';
      },
      set(_value) {
        this.toggleComplete();
      }
    },
    isDeleting() {
      return this.loadingStates.deleteTask;
    }
  },
  methods: {
    ...mapActions({
      updateTaskAction: 'tasks/updateTask',
      deleteTaskAction: 'tasks/deleteTask'
    }),
    async toggleComplete() {
      try {
        this.isToggling = true;
        const newStatus = this.task.status === 'active' ? 'completed' : 'active';

        await this.updateTaskAction({
          id: this.task.id,
          status: newStatus
        });
        toast.success('Статус задачи обновлен');
      } catch (err) {
        toast.error('Ошибка при обновлении статуса задачи');
      } finally {
        this.isToggling = false;
      }
    },
    async deleteTask() {
      const confirmed = await confirmModal({
        title: 'Удаление задачи',
        text: 'Вы действительно хотите удалить эту задачу?',
        confirmText: 'Удалить',
        cancelText: 'Отмена',
        confirmColor: 'error',
        persistent: true,
        loading: true
      });

      if (confirmed) {
        try {
          await this.deleteTaskAction(this.task.id);
          toast.success('Задача удалена');
        } catch (err) {
          toast.error('Ошибка при удалении задачи');
        }
      }
    },
    editTask() {
      this.isEditModalOpen = true;
    },
    closeEditModal() {
      this.isEditModalOpen = false;
    }
  }
};
</script>

<template>
  <div class="todo-item-wrapper">
    <div class="drag-handle"><VIcon>mdi-menu</VIcon></div>
    <VCard
      class="todo-item"
      :class="{
        'todo-item--completed': isCompleted,
      }"
      density="comfortable"
      variant="outlined"
    >
      <div class="todo-item__content">
        <VCheckbox
          v-model="isCompleted"
          hide-details
          class="checkbox"
          :disabled="isToggling || isDeleting"
        />

        <div class="todo-item__info">
          <div class="todo-item__title">{{ task.title }}</div>
          <div class="todo-item__date">{{ formattedDate }}</div>
          <div class="todo-item__date">{{ task.order }}</div>
        </div>
        <div class="todo-item__actions">
          <VBtn
            type="button"
            color="primary"
            variant="text"
            icon
            :disabled="isToggling || isDeleting"
            @click="editTask"
          >
            <VIcon>mdi-pencil</VIcon>
          </VBtn>
          <VBtn
            type="button"
            color="error"
            variant="text"
            icon
            :disabled="isToggling || isDeleting"
            @click="deleteTask"
          >
            <VIcon>mdi-trash-can</VIcon>
          </VBtn>
        </div>
      </div>
    </VCard>

    <TodoFormModal
      :is-open="isEditModalOpen"
      :task-id="task.id"
      @close="closeEditModal"
    />
  </div>
</template>

<style lang="scss" scoped>
.todo-item-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  transition: all 0.3s ease;

  &:hover .drag-handle {
    opacity: 1;
  }
}

.drag-handle {
  cursor: move;
  margin-right: 8px;
  font-size: 1.2rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.todo-item {
  flex-grow: 1;
  position: relative;

  &__content {
    display: flex;
    align-items: center;
    padding: 8px;
  }

  &__info {
    flex-grow: 1;
    margin: 0 12px;
  }

  &__title {
    font-weight: 500;
    margin-bottom: 4px;
  }

  &__date {
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.6);
  }

  &__actions {
    display: flex;
    gap: 4px;
  }

  &--completed {
    .todo-item__title {
      text-decoration: line-through;
      color: rgba(0, 0, 0, 0.38);
    }
  }
}

.checkbox {
  margin-top: 0;
  padding-top: 0;
}
</style>
