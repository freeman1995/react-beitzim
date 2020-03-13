import { UIEventHandler, useCallback, useEffect, useState } from "react";

import { Direction, ItemSizeGetter } from "react-beitzim/types";

export function useItemOffsets<ItemType>(
  items: ItemType[],
  itemSize: number | ItemSizeGetter<ItemType>
) {
  const [itemOffsets, setItemOffsets] = useState<number[]>([]);
  const [itemsSnapshotSignature, setItemsSnapshotSignature] = useState(
    Math.random().toString(32)
  );

  useEffect(() => {
    setItemsSnapshotSignature(Math.random().toString(32));

    let nextItemOffsets: number[] = [];
    let itemOffsetsDidChange = items.length !== itemOffsets.length;

    if (typeof itemSize === "function") {
      items.forEach((item, itemIndex) => {
        const prevItem = items[itemIndex - 1];
        const prevItemOffset = nextItemOffsets[itemIndex - 1];

        nextItemOffsets.push(prevItem ? prevItemOffset + itemSize(prevItem) : 0);

        if (nextItemOffsets[itemIndex] !== itemOffsets[itemIndex]) {
          itemOffsetsDidChange = true;
        }
      });
    }

    if (itemOffsetsDidChange) {
      setItemOffsets(nextItemOffsets);
    }
  }, [items]);

  return { itemOffsets, itemsSnapshotSignature };
}

export const useScrollOffset = (listDirection: Direction) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const onScroll = useCallback<UIEventHandler>(
    e => {
      const scrollOffsetProp =
        listDirection === Direction.Vertical ? "scrollTop" : "scrollLeft";

      setScrollOffset(e.currentTarget[scrollOffsetProp]);
    },
    [listDirection]
  );

  return { scrollOffset, onScroll };
};

/** pixels per millisecond **/
export const useScrollingSpeed = (scrollOffset: number) => {
  const [scrollingMoment, setScrollingMoment] = useState<{
    timestamp: number;
    scrollOffset: number;
    speed: number;
  }>({
    timestamp: 0,
    scrollOffset: 0,
    speed: 0
  });

  useEffect(() => {
    const timestamp = Date.now();

    setScrollingMoment({
      timestamp,
      scrollOffset: scrollOffset,
      speed:
        Math.abs(scrollOffset - scrollingMoment.scrollOffset) /
        (timestamp - scrollingMoment.timestamp)
    });

    const timeoutId = window.setTimeout(
      () =>
        setScrollingMoment({
          timestamp: Date.now(),
          scrollOffset: scrollOffset,
          speed: 0
        }),
      50
    );

    return () => {
      if (timeoutId) {
        clearInterval(timeoutId);
      }
    };
  }, [scrollOffset]);

  return scrollingMoment.speed;
};
