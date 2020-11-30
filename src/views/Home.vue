<template lang="pug">
  .Home
    .buttonBar
      button(@click="createNewAnnotation") 创建新框选标注
      button(@click="createNewVertexAnnotation") 创建新点选标注
      button(@click="removeNowAnnotation") 删除
    Annotation(ref="annotation")
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Annotation from '@/components/Annotation.vue';
import {AnnotationType} from '@/components/Annotation';

@Component({
  components: {Annotation},
})
export default class Home extends Vue {
  public $refs!: {
    annotation: Annotation,
  };
  public createNewAnnotation() {
    this.$refs.annotation.newAnnotation();
  }
  public createNewVertexAnnotation() {
    this.$refs.annotation.newAnnotation(AnnotationType.Points);
  }
  public removeNowAnnotation() {
    this.$refs.annotation.deleteAnnotation();
  }
}
</script>

<style scoped lang="stylus">
  .Home {
    height 100vh
    width 100vw
  }
</style>
