<template lang="pug">
  svg(@mousedown="dragStart" @click="addVertex")
    RectAnnotation(v-for="item in RectAnnotations" v-model="item.annotation" :color="item.color")
    RectAnnotation(ref="tempRectAnnotation" v-if="tempAnnotation && newAnnotationType==='Rect'" v-model="tempAnnotation")

    VerticesAnnotation(v-for="item in VertexAnnotations" v-model="item.annotation"
                        @click="setNowAnnotation(item)"
                        :is-highlight="nowAnnotation ? nowAnnotation.id === item.id : false")
    VerticesAnnotation(v-model="tempAnnotation" v-if="tempAnnotation && newAnnotationType === 'Points'"
                       @clickFirst="clickedTempAnnotationFirstPoint" :is-complete="false")
</template>

<script lang="ts">
import {Component, Model, Prop, Vue} from 'vue-property-decorator';
import Annotation, {AnnotationType, newPoints, newRect, Point, Rect, RectangularVertices} from './Annotation';
import RectAnnotation from '@/components/RectAnnotation.vue';
import {UUID} from '@/utils/utils';
import {randomColor} from '@/utils/color';
import VerticesAnnotation from '@/components/VerticesAnnotation.vue';

@Component({
  components: {VerticesAnnotation, RectAnnotation},
})
export default class ImageAnnotation extends Vue {
  @Prop(String) public readonly src !: string;
  @Model('change', {default: () => []}) public annotations !: Annotation[];

  get RectAnnotations() {
    return this.annotations.filter((item) => item.type === AnnotationType.Rect);
  }

  get VertexAnnotations() {
    return this.annotations.filter((item) => item.type === AnnotationType.Points);
  }

  public $refs!: {
    tempRectAnnotation: RectAnnotation,
  };

  public nowAnnotation: Annotation | null = null;

  // 是否进入创建新标注流程
  public isNewAnnotation: boolean = false;
  // 新标注的类型(设置为可选类型）
  public newAnnotationType!: AnnotationType;
  //
  public tempAnnotation: Rect | Point[] | null = null;

  public newAnnotation(type: AnnotationType = AnnotationType.Rect) {
    this.isNewAnnotation = true;
    this.newAnnotationType = type;
  }

  public deleteAnnotation(by?: string, value?: number | string) {
    switch (by) {
      case 'id':
        this.annotations.splice(this.annotations.findIndex((item) => item.id === value), 1);
        break;
      case 'label':
        this.annotations.splice(this.annotations.findIndex((item) => item.label === value), 1);
        break;
      default:
        if (this.nowAnnotation) {
          this.annotations.splice(this.annotations.indexOf(this.nowAnnotation), 1);
        }
    }
  }

  public setNowAnnotation(annotation: Annotation) {
    this.nowAnnotation = annotation;
  }

  public dragStart(event: MouseEvent) {
    if (this.isNewAnnotation && this.newAnnotationType === AnnotationType.Rect) {
      this.tempAnnotation = newRect(event.offsetX, event.offsetY);
      this.$forceUpdate();
      setTimeout(() => {
        this.$refs.tempRectAnnotation.movePointStart(RectangularVertices.rightBottom, (rect) => {
          this.annotations.push({
            id: UUID(),
            label: 'hello',
            type: AnnotationType.Rect,
            annotation: rect,
            color: randomColor(),
          });
          this.tempAnnotation = null;
          this.isNewAnnotation = false;
        });
      }, 0);
    }
  }

  // 标注过程中，点击了起点，形成闭环
  public clickedTempAnnotationFirstPoint() {
    if (this.isNewAnnotation && this.newAnnotationType === AnnotationType.Points) {
      this.annotations.push({
        id: UUID(),
        label: 'hello',
        type: AnnotationType.Points,
        annotation: (this.tempAnnotation as Point[]),
        color: randomColor(),
      });
      this.tempAnnotation = null;
      this.isNewAnnotation = false;
    }
  }
  // 向临时标注中添加点标
  public addVertex(event: MouseEvent) {
    if (this.isNewAnnotation && this.newAnnotationType === AnnotationType.Points) {
      if (this.tempAnnotation) {
        (this.tempAnnotation as Point[]).push({x: event.offsetX, y: event.offsetY});
      } else {
        this.tempAnnotation = newPoints(event.offsetX, event.offsetY);
      }
    } else {
      if (event?.target?.tagName === 'svg') {
        this.nowAnnotation = null;
      }
    }
  }
}
</script>

<style scoped lang="stylus">
svg {
  height 100%
  width 100%
}
</style>
