<script>
export default {
  name: 'LayoutHeader'
};
</script>

<template>
  <header class="header">
    <p class="header__title">Todo Project</p>
  </header>
</template>

<style lang="scss" scoped>
.header {
  background-color: $info;
  color: #fff;
  padding: 0 0.9375rem;
  height: 3.75rem;
  display: flex;
  align-items: center;

  &__title {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: left;
  }

  @media (max-width: $breakpoint-md) {
    padding: 0 0.625rem;
    height: 3.125rem;

    &__title {
      font-size: 1.2rem;
    }
  }
}
</style>
