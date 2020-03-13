import { CSSProperties, UIEventHandler, useCallback, useMemo } from "react";
import { last } from "lodash/fp";

import {
  Direction,
  ItemOffsetGetter,
  ItemSizeGetter,
  VisibleItemDescriptor
} from "react-beitzim/types";
import {
  useItemOffsets,
  useScrollOffset,
  useScrollingSpeed
} from "react-beitzim/list-virtualization-hooks";
import {
  getExtendedVisibleItemRange,
  getTranslate3dArgs
} from "react-beitzim/list-virtualization-utils";

export function useVirtualList<ItemType>(
  items: ItemType[],
  itemSize: number | ItemSizeGetter<ItemType>,
  listSize: number = 0,
  listDirection: Direction = Direction.Vertical,
  overscan: number = 10
): {
  listContainerStyle: CSSProperties;
  stripStyle: CSSProperties;
  onScroll: UIEventHandler;
  visibleItems: VisibleItemDescriptor<ItemType>[];
  getItemOffset: ItemOffsetGetter;
  scrollingSpeed: number;
} {
  const { itemOffsets, itemsSnapshotSignature } = useItemOffsets(items, itemSize);
  const { scrollOffset, onScroll } = useScrollOffset(listDirection);
  const scrollingSpeed = useScrollingSpeed(scrollOffset);
  const sizeStyleProp = listDirection === Direction.Vertical ? "height" : "width";

  const visibleItemRange = useMemo(
    () =>
      getExtendedVisibleItemRange(
        listSize,
        itemSize,
        items.length,
        scrollOffset,
        itemOffsets,
        overscan
      ),
    [listSize, items.length, scrollOffset, itemOffsets]
  );

  const visibleItems = useMemo(
    () =>
      visibleItemRange.map(
        (itemIndex): VisibleItemDescriptor<ItemType> => {
          const item = items[itemIndex];
          const size = typeof itemSize === "function" ? itemSize(item) : itemSize;
          const [firstItemIndex] = visibleItemRange;
          const offset =
            typeof itemSize === "function"
              ? itemOffsets[firstItemIndex]
              : firstItemIndex * itemSize;

          return {
            item,
            itemIndex,
            style: {
              [sizeStyleProp]: size,
              willChange: "transform",
              transform: `translate3d(${getTranslate3dArgs(offset, listDirection)})`
            }
          };
        }
      ),
    [visibleItemRange, itemsSnapshotSignature]
  );

  const getItemOffset = useCallback(
    (itemIndex: number) =>
      typeof itemSize === "function" ? itemOffsets[itemIndex] : itemSize * itemIndex,
    [itemOffsets]
  );

  const listContainerStyle = useMemo<CSSProperties>(
    () => ({
      willChange: "scroll-position",
      scrollBehavior: "smooth",
      [sizeStyleProp]: listSize,
      [listDirection === Direction.Vertical ? "overflowX" : "overflowY"]: "scroll"
    }),
    [listDirection, listSize]
  );

  const stripStyle = useMemo<CSSProperties>(() => {
    const lastItem = last(items);
    const lastItemOffset = last(itemOffsets) || 0;

    return {
      display: "flex",
      flexDirection: listDirection === Direction.Vertical ? "column" : "row",
      [listDirection === Direction.Vertical ? "minHeight" : "minWidth"]: "100%",
      [sizeStyleProp]:
        typeof itemSize === "number"
          ? itemSize * items.length
          : lastItemOffset + (lastItem ? itemSize(lastItem) : 0)
    };
  }, [listDirection, items.length, last(items), last(itemOffsets)]);

  return {
    listContainerStyle,
    stripStyle,
    onScroll,
    visibleItems,
    getItemOffset,
    scrollingSpeed
  };
}
