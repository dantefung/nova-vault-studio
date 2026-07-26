<template>
  <ul class="outline-children">
    <li v-for="(item, idx) in items" :key="idx">
      <button class="outline-item" @click="$emit('navigate', item)">{{ item.title }}</button>
      <PdfOutline v-if="item.items?.length" :items="item.items" @navigate="$emit('navigate', $event)" />
    </li>
  </ul>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true }
})

defineEmits(['navigate'])

// 支持递归引用
defineOptions({
  name: 'PdfOutline'
})
</script>

<style scoped>
.outline-children {
  list-style: none;
  padding-left: 12px;
  margin: 0;
}

.outline-children li {
  padding: 2px 0;
}

.outline-item {
  cursor: pointer;
  width: 100%;
  border: none;
  background: transparent;
  text-align: left;
  padding: 4px 6px;
  font-size: 0.92em;
  color: var(--vp-c-foreground);
  word-break: break-word;
  white-space: normal;
}

.outline-item:hover {
  text-decoration: underline;
  background: rgba(0, 0, 0, 0.04);
}

.outline-item:active {
  opacity: 0.8;
}
</style>
