<script setup>
import ScriptureReader from '../components/ScriptureReader.vue';
import StudyPanel from '../components/StudyPanel.vue';
</script>

<template>
  <div class="workspace">
    <ScriptureReader />
    <StudyPanel />
  </div>
</template>

<style scoped>
.workspace {
  display: grid;
  grid-template-columns: 1fr 450px;
  grid-template-rows: minmax(0, 1fr);
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .workspace {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    overflow: visible;
  }
}
</style>