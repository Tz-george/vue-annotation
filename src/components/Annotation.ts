import {UUID} from '@/utils/utils';

export default interface Annotation {
  id: number | string;
  type: AnnotationType;
  label: string;
  color?: Color;
  annotation: Point[] | Rect;
}

export function newAnnotation(type: AnnotationType,
                              x: number, y: number,
                              color ?: Color,
                              annotation ?: Point[] | Rect) {
  return {
    id: UUID(),
    type,
    label: '',
    color,
    annotation,
  };
}

export function newRect(x: number, y: number): Rect {
  return {
    x,
    y,
    w: 0,
    h: 0,
  };
}

export function newPoints(x: number, y: number): Point[] {
  return [{x, y}];
}

export enum AnnotationType {
  Rect = 'Rect',
  Points = 'Points',
  Content = 'Content',
}

export type Color = string;

export interface Point {
  x: number;
  y: number;
}

export interface Rect extends Point {
  w: number;
  h: number;
}

export enum RectangularVertices {
  leftTop,
  rightTop,
  rightBottom,
  leftBottom,
}
