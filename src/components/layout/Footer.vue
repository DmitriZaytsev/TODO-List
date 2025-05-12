<script>
export default {
  name: 'LayoutFooter'
};
</script>

<template>
  <footer class="footer">
    <p>Разработал Дмитрий Зайцев</p>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: black;
  color: white;
  flex-shrink: 0;
  padding: 1.5rem;
  display: flex;
  justify-content: flex-end;

  @media (min-width: $breakpoint-lg) {
    padding-left: 6.25rem;
    padding-right: 6.25rem;
  }
}
</style>
