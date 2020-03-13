import { CSSProperties, UIEventHandler, useMemo } from "react";
import { last, map } from "lodash/fp";

import { Direction, ItemSizeGetter, VisibleItemDescriptor } from "react-beitzim/types";
import { useScrollOffset } from "react-beitzim/list-virtualization-hooks";
import { useItemOffsets } from "react-beitzim/masonry-virtualization-hooks";
import { getExtendedVisibleItemRange } from "react-beitzim/list-virtualization-utils";

export function useVirtualMasonry<ItemType>(
  items: ItemType[],
  itemWidth: number,
  itemHeight: ItemSizeGetter<ItemType>,
  getItemId: (item: ItemType) => string,
  width: number,
  height: number
): {
  frameStyle: CSSProperties;
  stripStyle: CSSProperties;
  onScroll: UIEventHandler;
  visibleItems: VisibleItemDescriptor<ItemType>[][];
} {
  const { itemOffsets, itemsSnapshotSignature } = useItemOffsets(
    items,
    width,
    itemWidth,
    itemHeight,
    getItemId
  );
  const { scrollOffset, onScroll } = useScrollOffset(Direction.Vertical);

  const visibleItemRange = useMemo(
    () =>
      itemOffsets.map(columnItemOffsets =>
        getExtendedVisibleItemRange(
          height,
          itemHeight,
          columnItemOffsets.length,
          scrollOffset,
          map("offset", columnItemOffsets),
          0
        )
      ),
    [itemOffsets, scrollOffset]
  );

  const visibleItems = useMemo<VisibleItemDescriptor<ItemType>[][]>(
    () =>
      visibleItemRange.map((currentColumnVisibleIndexes, currentColumnIndex) =>
        currentColumnVisibleIndexes.map(currentRowIndex => {
          const { itemIndex, offset } = itemOffsets[currentColumnIndex][currentRowIndex];
          const item = items[itemIndex];

          // TODO : check id
          return {
            item,
            itemIndex,
            style: {
              width: itemWidth,
              height: itemHeight(item),
              position: "absolute",
              top: offset,
              left: currentColumnIndex * itemWidth,
              willChange: "top, left",
              transition: "top 1s ease-out, left 1s ease-out"
            }
          };
        })
      ),
    [visibleItemRange, itemsSnapshotSignature]
  );

  const frameStyle = useMemo<CSSProperties>(
    () => ({
      position: "relative",
      width,
      height,
      display: "flex",
      willChange: "scroll-position",
      scrollBehavior: "smooth",
      overflowX: "scroll"
    }),
    [width, height]
  );

  const stripStyle = useMemo<CSSProperties>(
    () => ({
      width: "100%",
      minHeight: "100%",
      height: Math.max(
        ...itemOffsets.map(columnItemOffsets => {
          const columnLastItemOffset = last(columnItemOffsets);

          if (!columnLastItemOffset) return 0;

          return columnLastItemOffset.offset + itemHeight(items[columnLastItemOffset.itemIndex]);
        })
      )
    }),
    [itemOffsets]
  );

  return {
    frameStyle,
    stripStyle,
    onScroll,
    visibleItems
  };
}
