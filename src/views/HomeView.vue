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
  flex: 1;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .workspace {
    grid-template-columns: 1fr;
    overflow: visible;
  }
}
</style>
