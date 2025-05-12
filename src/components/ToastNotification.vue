<template>
  <v-snackbar
    v-model="visible"
    :color="toast.color"
    :timeout="toast.timeout"
    :right="toast.right"
    :elevation="toast.elevation"
  >
    {{ toast.message }}
  </v-snackbar>
</template>

<script>
import { mapGetters } from "vuex";
import { toast } from "@/utils";

export default {
  name: "ToastNotification",
  computed: {
    ...mapGetters({
      toast: "ui/toast",
    }),
    visible: {
      get() {
        return this.toast.visible;
      },
      set(value) {
        if (!value) {
          toast.hide();
        }
      },
    },
  },
};
</script>
