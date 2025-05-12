<script>
import TodoPage from '@/components/Todo/Page';
import ToastNotification from '@/components/ToastNotification';
import { VApp, VMain } from 'vuetify/lib/components';

export default {
  name: 'App',
  components: { TodoPage, VApp, VMain, ToastNotification }
};
</script>

<template>
  <VApp>
    <VMain>
      <TodoPage />
    </VMain>
    <ToastNotification />
  </VApp>
</template>

<style>
html, body {
  overflow: auto;
}
</style>
