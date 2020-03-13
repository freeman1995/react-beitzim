import { range } from "lodash/fp";

import { Direction, ItemSizeGetter, Range } from "react-beitzim/types";

const extendItemRange = (size: number, limit: number, range: Range): Range => {
  const startIndex = Math.max(0, range.startIndex - size);
  const endIndex = Math.min(limit, range.endIndex + size);

  return {
    startIndex,
    endIndex
  };
};

const findItemIndexByScrollOffset = (
  itemCount: number,
  itemOffsets: number[],
  scrollOffset: number
) => {
  let start = 0;
  let end = itemCount;
  let middle = Math.floor((start + end) / 2);

  while (middle !== end && middle !== start && itemOffsets[middle] !== scrollOffset) {
    if (itemOffsets[middle] > scrollOffset) {
      end = middle;
    } else {
      start = middle;
    }

    middle = Math.floor((start + end) / 2);
  }

  return middle;
};

export const getTranslate3dArgs = (offset: number, listDirection: Direction) =>
  listDirection === Direction.Vertical ? `0, ${offset}px, 0` : `${offset}px, 0, 0`;

export function getVisibleItemsRange<ItemType>(
  listSize: number,
  itemSize: number | ItemSizeGetter<ItemType>,
  scrollOffset: number,
  itemOffsets: number[]
): Range {
  if (typeof itemSize === "number") {
    const startIndex = Math.floor(scrollOffset / itemSize);
    const visibleItemCount =
      Math.floor(listSize / itemSize) + (scrollOffset % itemSize === 0 ? 0 : 1);

    return {
      startIndex,
      endIndex: startIndex + visibleItemCount
    };
  }

  const startIndex = findItemIndexByScrollOffset(
    itemOffsets.length,
    itemOffsets,
    scrollOffset
  );

  let endIndex = startIndex;
  while (itemOffsets[endIndex] < scrollOffset + listSize) {
    endIndex++;
  }

  return {
    startIndex,
    endIndex
  };
}

export function getExtendedVisibleItemRange<ItemType>(
  listSize: number,
  itemSize: number | ItemSizeGetter<ItemType>,
  itemCount: number,
  scrollOffset: number,
  itemOffsets: number[],
  overscan: number
) {
  const visibleItemsRange = getVisibleItemsRange(
    listSize,
    itemSize,
    scrollOffset,
    itemOffsets
  );
  const { startIndex, endIndex } = extendItemRange(
    overscan,
    itemCount,
    visibleItemsRange
  );

  return range(startIndex, endIndex);
}
