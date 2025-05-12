<script>
import TodoPage from '@/components/Todo/Page';
import VToast from '@/components/VToast';
import { VApp, VMain } from 'vuetify/lib/components';

export default {
  name: 'App',
  components: { TodoPage, VApp, VMain, VToast }
};
</script>

<template>
  <VApp>
    <VMain>
      <TodoPage />
    </VMain>
    <VToast />
  </VApp>
</template>

<style>
html, body {
  overflow: auto;
}
</style>
