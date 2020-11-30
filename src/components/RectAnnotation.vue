<template lang="pug">
  g(:class="highLight")
    rect(
      :x="value.x"
      :y="value.y"
      :width="value.w"
      :height="value.h"
      :fill="color"
      :stroke="color"
      fill-opacity=".2"
      stroke-opacity=".4"
      stroke-width="3"
      @mousedown="moveStart"
    )
    circle(v-for="(point, index) in points"
      :cx="point.x" :cy="point.y" r="5"
      :fill="color" fill-opacity=".9"
      @mousedown="movePointStart(index)")
</template>

<script lang="ts">
import {Component, Emit, Model, Prop, Vue} from 'vue-property-decorator';
import {Color, Point, Rect, RectangularVertices} from '@/components/Annotation';
import {randomColor} from '@/utils/color';

@Component
export default class RectAnnotation extends Vue {
  @Model('change', {type: Object}) public value !: Rect;
  @Prop({type: String, default: randomColor()}) public color!: Color;
  @Prop({type: Boolean, default: false}) public showLabel!: boolean;
  @Prop({type: Boolean, default: false}) public isHighlight!: boolean;

  get points(): Point[] {
    if (!this.value) {
      return [];
    }
    return [{
      // leftTop
      x: this.value.x,
      y: this.value.y,
    }, {
      // rightTop
      x: this.value.x + this.value.w,
      y: this.value.y,
    }, {
      // rightBottom
      x: this.value.x + this.value.w,
      y: this.value.y + this.value.h,
    }, {
      // leftBottom
      x: this.value.x,
      y: this.value.y + this.value.h,
    }];
  }

  get highLight() {
    return {highlight: this.isHighlight};
  }

  public moveStart() {
    const moving = (event: MouseEvent) => {
      this.value.x += event.movementX;
      this.value.y += event.movementY;
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

  public movePointStart(index: number, movedCallback?: (value: Rect) => void) {
    const start = {...this.value};
    const offset: Point = { x: 0, y: 0 };
    const backup: Point[] = [...this.points];
    const moving = (event: MouseEvent) => {
      offset.x += event.movementX;
      offset.y += event.movementY;
      this.value.x = Math.min(backup[(index + 2) % 4].x, backup[index].x + offset.x);
      this.value.y = Math.min(backup[(index + 2) % 4].y, backup[index].y + offset.y);
      this.value.w = Math.abs(start.w + ((index + 1) % 4 > 1 ? 1 : -1) * offset.x);
      this.value.h = Math.abs(start.h + (index > 1 ? 1 : -1) * offset.y);
    };
    const moved = () => {
      window.removeEventListener('mousemove', moving);
      window.removeEventListener('mouseup', moved);
      if (movedCallback) {
        movedCallback(this.value);
      }
    };
    window.addEventListener('mousemove', moving);
    window.addEventListener('mouseup', moved);
  }
}
</script>

<style scoped lang="stylus">
g {
  &:hover {
    rect {
      fill-opacity 0.4
      stroke-opacity 0.65
    }

    circle {
      fill-opacity 1
    }
  }
}

circle {
  transition r .1s linear
  &:nth-of-type(1), &:nth-of-type(3) {
    cursor nwse-resize
  }
  &:nth-of-type(2), &:nth-of-type(4) {
    cursor nesw-resize
  }
  &:hover {
    r 7
  }
}

.highlight {
  rect {
    fill-opacity 0.4
    stroke-opacity 0.65
  }

  circle {
    fill-opacity 1
  }
}
</style>
