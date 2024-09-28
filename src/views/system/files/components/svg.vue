<template>
  <div>
    <!-- <img :src="src" /> -->
    <component :is="componentName" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import fileSvg from "./svg/file.svg?component";

const props = defineProps({
  name: {
    type: String,
    required: true
  }
});

onMounted(() => {
  loadSvg(props.name);
});

const componentName = ref(fileSvg);

const loadSvg = (name: string) => {
  import(`./svg/${name}.svg?component`)
    .then(component => {
      componentName.value = component.default;
    })
    .catch(error => {});
};
</script>
