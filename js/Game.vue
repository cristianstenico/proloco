<template lang="pug">
p {{ this.matchId }}
</template>
<script>
export default {
  props: {
    matchId: {
      type: String,
      required: true
    }
  }
}
</script>
