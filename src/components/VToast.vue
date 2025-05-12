<template>
  <VSnackbar
    v-model="visible"
    :color="toast.color"
    :timeout="toast.timeout"
    :right="toast.right"
    :elevation="toast.elevation"
  >
    {{ toast.message }}
  </VSnackbar>
</template>

<script>
import { mapGetters } from 'vuex';
import { toast } from '@/utils';
import { VSnackbar } from 'vuetify/lib/components';

export default {
  name: 'VToast',
  components: { VSnackbar },
  computed: {
    ...mapGetters({
      toast: 'ui/toast'
    }),
    visible: {
      get() {
        return this.toast.visible;
      },
      set(value) {
        if (!value) {
          toast.hide();
        }
      }
    }
  }
};
</script>
