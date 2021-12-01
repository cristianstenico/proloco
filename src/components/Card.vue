<template lang="pug">
.card-praim(
  :id="`card-${card.name}`"
  :class="{selected}"
)
  .up(@click="$emit('select', {id: card.name, top: true})")
    .pre
      template(v-if="card.up.pre.startsWith('A')")
        i.fa-solid.fa-euro-sign
        |  {{ card.up.pre.substring(2) }}
      template(v-if="card.up.pre.startsWith('B')")
        i.fa-solid.fa-box
        |  {{ card.up.pre.substring(2) }}
      template(v-if="card.up.pre.startsWith('C')")
        i.fa-solid.fa-carrot
        |  {{ card.up.pre.substring(2) }}
      template(v-if="card.up.pre.startsWith('events')")
        i.fa-solid.fa-calendar-check
        |  {{ card.up.pre.substring(7) }}
    .a(v-if="card.up.values.A")
      i.fa-solid.fa-euro-sign
      |  {{ card.up.values.A}}
    .b(v-if="card.up.values.B")
      i.fa-solid.fa-box
      |  {{ card.up.values.B }}
    .c(v-if="card.up.values.C")
      i.fa-solid.fa-carrot
      |  {{ card.up.values.C }}
  .down(@click="$emit('select', {id: card.name, top: false})")
    .a
      i.fa-solid.fa-euro-sign
      |  {{card.down.values.A}}
    .b
      i.fa-solid.fa-box
      |  {{card.down.values.B}}
    .c
      i.fa-solid.fa-carrot
      |  {{card.down.values.C}}
    .post
      template(v-if="card.down.post.events")
        i.fa-solid.fa-calendar
        |  {{ card.down.post.events }}
  #id-card(v-if="$store.state.showID") {{card.name}}
</template>
<script>
export default {
  props: {
    card: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    }
  }
}
</script>
