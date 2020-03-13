import { CSSProperties } from "react";

export type Range = {
  startIndex: number;
  endIndex: number;
};

export type ItemSizeGetter<ItemType> = (item: ItemType) => number;

export type ItemOffsetGetter = (itemIndex: number) => number;

export enum Direction {
  Vertical,
  Horizontal
}

export type VisibleItemDescriptor<ItemType> = {
  item: ItemType;
  itemIndex: number;
  style: CSSProperties;
};
