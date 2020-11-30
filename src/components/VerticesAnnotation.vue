<template lang="pug">
  g(:class="highLight")
    path(:d="path" @mousedown="moveStart"
         stroke-width="3" :stroke="color" :fill="color" fill-opacity="0.2" stroke-opacity="0.4")

    circle.tempPoint(r="3" v-for="(item, index) in tempPoints" :cx="item.x" :cy="item.y" :fill="color" fill-opacity="0.9" @mousedown="insertPoint(index)")

    circle(r="5" v-for="(item, index) in value" :cx="item.x" :cy="item.y" :fill="color" fill-opacity="0.9"
          @click="pointClicked(index)" @dblclick="pointDblClicked(index)" @mousedown="movePointStart(index)")

</template>

<script lang="ts">
import {Component, Emit, Model, Prop, Vue} from 'vue-property-decorator';
import {Point} from './Annotation';
import {randomColor} from '@/utils/color';

@Component
export default class VerticesAnnotation extends Vue {
  @Model('change') public value!: Point[];
  @Prop({type: String, default: () => randomColor()}) public color!: string;
  @Prop({type: Boolean, default: true}) public isComplete!: boolean;
  @Prop({type: Boolean, default: false}) public isHighlight!: boolean;

  // 路径
  get path() {
    return `M ${this.value[0].x} ${this.value[0].y} ${this.value.filter((_, index) => index !== 0).map((item) => `L ${item.x} ${item.y}`).join(' ')}` + (this.isComplete ? 'Z' : '');
  }

  // 扩展点
  get tempPoints() {
    return this.value.map((item: Point, index: number) => ({
      x: (item.x + this.value[(index + 1) % this.value.length].x) / 2,
      y: (item.y + this.value[(index + 1) % this.value.length].y) / 2,
    }));
  }

  get highLight() {
    return {highlight: this.isHighlight};
  }

  // 拖拽移动整体
  public moveStart() {
    const moving = (event: MouseEvent) => {
      this.value.forEach((item) => {item.x += event.movementX; item.y += event.movementY; });
    };
    const moved = () => {
      window.removeEventListener('mousemove', moving);
      window.removeEventListener('mouseup', moved);
      this.click();
    };
    window.addEventListener('mousemove', moving);
    window.addEventListener('mouseup', moved);
  }

  // 拖拽移动点
  public movePointStart(index: number) {
    const moving = (event: MouseEvent) => {
      this.value[index].x = event.offsetX;
      this.value[index].y = event.offsetY;
    };
    const moved = () => {
      window.removeEventListener('mousemove', moving);
      window.removeEventListener('mouseup', moved);
      this.click();
    };
    window.addEventListener('mousemove', moving);
    window.addEventListener('mouseup', moved);
  }

  @Emit('click')
  public click() {
    return ;
  }

  // 给父级一个点击起点的反馈
  @Emit('clickFirst')
  public clicked() {
    return null;
  }
  public pointClicked(index: number) {
    if (index === 0) {
      this.clicked();
    }
  }

  // 双击删除点
  public pointDblClicked(index: number) {
    this.value.splice(index, 1);
  }

  // 单击扩展点增加点
  public insertPoint(index: number) {
    this.value.splice(index + 1, 0, this.tempPoints[index]);
    this.movePointStart(index + 1);
  }
}
</script>

<style scoped lang="stylus">
g {
  &:hover {
    path {
      fill-opacity 0.4
      stroke-opacity 0.65
    }

    circle {
      fill-opacity 1
    }
    .tempPoint {
      visibility visible
    }
  }
}
.tempPoint {
  visibility hidden
  &:hover {
     r 5
   }
}
circle {
  &:hover {
    r 7
  }
}
.highlight {
  path {
    fill-opacity 0.4
    stroke-opacity 0.65
  }

  circle {
    fill-opacity 1
  }
}
</style>
