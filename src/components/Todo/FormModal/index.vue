<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { mapState, mapActions } from 'vuex';
import {
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
  VForm,
  VTextField,
  VIcon,
  VSpacer,
  VProgressLinear
} from 'vuetify/lib/components';
import { toast } from '@/utils';

export default {
  name: 'TodoFormModal',
  components: {
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VBtn,
    VForm,
    VTextField,
    VIcon,
    VSpacer,
    VProgressLinear
  },
  mixins: [validationMixin],

  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    taskId: {
      type: [String, Number],
      default: null
    }
  },

  validations: {
    title: {
      required
    }
  },

  data() {
    return {
      dialog: false,
      title: ''
    };
  },

  computed: {
    ...mapState({
      currentTask: state => state.tasks.currentTask,
      loadingStates: state => state.tasks.loadingStates
    }),

    isEditing() {
      return !!this.taskId;
    },

    titleErrors() {
      const errors = [];
      if (!this.$v.title.$dirty) return errors;
      if (!this.$v.title.required) errors.push('Название обязательно');
      return errors;
    },

    isLoadingTask() {
      return this.loadingStates.getTaskById;
    },

    isSavingTask() {
      return this.loadingStates.createTask || this.loadingStates.updateTask;
    }
  },

  watch: {
    isOpen(newValue) {
      this.dialog = newValue;
      if (newValue && this.isEditing) {
        this.loadTask();
      } else if (newValue && !this.isEditing) {
        this.$nextTick(() => {
          this.focusTitleInput();
        });
      } else if (!newValue) {
        this.resetForm();
      }
    },
    dialog(newValue) {
      if (!newValue) {
        this.$emit('close');
      }
    }
  },

  methods: {
    ...mapActions({
      createTask: 'tasks/createTask',
      updateTask: 'tasks/updateTask',
      getTaskById: 'tasks/getTaskById'
    }),

    async loadTask() {
      if (this.isEditing) {
        try {
          await this.getTaskById(this.taskId);
          if (this.currentTask) {
            this.title = this.currentTask.title;
            this.$nextTick(() => {
              this.focusTitleInput();
            });
          }
        } catch (error) {
          toast.error('Не удалось загрузить задачу');
          this.closeModal();
        }
      }
    },

    focusTitleInput() {
      if (this.$refs.titleInput) {
        this.$refs.titleInput.focus();
      }
    },

    resetForm() {
      this.title = '';
      this.$v.$reset();
    },

    async handleSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      try {
        const taskData = { title: this.title };

        if (this.isEditing) {
          await this.updateTask({
            id: this.taskId,
            ...taskData
          });
          toast.success('Задача успешно обновлена');
        } else {
          await this.createTask(taskData);
          toast.success('Задача успешно создана');
        }
        this.closeModal();
        this.resetForm();
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Произошла ошибка при сохранении задачи';
        toast.error(errorMessage);
      }
    },

    closeModal() {
      this.dialog = false;
    }
  }
};
</script>

<template>
  <VDialog
    v-model="dialog"
    max-width="31rem"
    @click:outside="closeModal"
    @keydown.esc="closeModal"
  >
    <VCard>
      <VProgressLinear
        v-if="isLoadingTask || isSavingTask"
        indeterminate
        color="primary"
      />

      <VCardTitle class="text-h5">
        {{ isEditing ? "Редактировать задачу" : "Новая задача" }}
        <VSpacer />
        <VBtn
          icon
          :disabled="isLoadingTask || isSavingTask"
          @click="closeModal"
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardTitle>

      <VCardText>
        <VForm
          ref="form"
          @submit.prevent="handleSubmit">
          <VTextField
            ref="titleInput"
            v-model.trim="title"
            outlined
            :error-messages="titleErrors"
            label="Название"
            required
            :loading="isLoadingTask"
            :disabled="isLoadingTask || isSavingTask"
            @input="$v.title.$touch()"
            @blur="$v.title.$touch()"
          />
        </VForm>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn
          color="grey darken-1"
          text
          :disabled="isLoadingTask || isSavingTask"
          @click="closeModal"
        >
          Отмена
        </VBtn>
        <VBtn
          color="primary"
          :disabled="$v.$invalid || isLoadingTask || isSavingTask"
          :loading="isSavingTask"
          @click="handleSubmit"
        >
          {{ isEditing ? "Сохранить" : "Создать" }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
