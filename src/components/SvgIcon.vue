<script lang="ts">
  import { defineComponent, computed } from '@vue/composition-api'

  export default defineComponent({
    props: {
      name: {
        type: String
      }
    },
    setup(props) {
      const iconName = computed(() => `#icon-${props.name}`)
      return {
        iconName
      }
    }
  })
</script>

<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
