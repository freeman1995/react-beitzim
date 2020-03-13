import { ItemSizeGetter } from "react-beitzim/types";
import { useEffect, useState } from "react";
import { flatten, range, last } from "lodash/fp";

type MasonryItemOffset = {
  itemId: string;
  itemIndex: number;
  offset: number;
  columnIndex: number;
};

export function useItemOffsets<ItemType>(
  items: ItemType[],
  width: number,
  itemWidth: number,
  itemHeight: ItemSizeGetter<ItemType>,
  getItemId: (item: ItemType) => string
) {
  const columnCount = Math.floor(width / itemWidth);
  const [itemOffsets, setItemOffsets] = useState<MasonryItemOffset[][]>(
    range(0, columnCount).map(() => [])
  );
  const [itemsSnapshotSignature, setItemsSnapshotSignature] = useState(Math.random().toString(32));

  useEffect(() => {
    setItemsSnapshotSignature(Math.random().toString(32));

    let nextItemOffsets: MasonryItemOffset[][] = range(0, columnCount).map(() => []);
    let itemOffsetsDidChange = items.length !== flatten(itemOffsets).length;

    items.forEach((item, itemIndex) => {
      const currentColumnHeights = nextItemOffsets.map((columnItemOffsets) => {
        const columnLastItemOffset = last(columnItemOffsets);

        return columnLastItemOffset
          ? columnLastItemOffset.offset + itemHeight(items[columnLastItemOffset.itemIndex])
          : 0;
      });

      const lowestColumnHeight = Math.min(...currentColumnHeights);
      const currentColumnIndex = currentColumnHeights.indexOf(lowestColumnHeight);
      const currentRowIndex = nextItemOffsets[currentColumnIndex].length;

      const { itemIndex: columnPrevRowItemIndex, offset: columnPrevRowItemOffset } =
        nextItemOffsets[currentColumnIndex][currentRowIndex - 1] || {};
      const columnPrevRowItem = items[columnPrevRowItemIndex];
      const itemId = getItemId(item);

      nextItemOffsets[currentColumnIndex].push({
        itemId,
        itemIndex,
        offset: columnPrevRowItem ? columnPrevRowItemOffset + itemHeight(columnPrevRowItem) : 0,
        columnIndex: currentColumnIndex,
      });

      if (
        nextItemOffsets[currentColumnIndex]?.[currentRowIndex] !==
        itemOffsets[currentColumnIndex]?.[currentRowIndex]
      ) {
        itemOffsetsDidChange = true;
      }
    });

    if (itemOffsetsDidChange) {
      setItemOffsets(nextItemOffsets);
    }
  }, [items, width, itemWidth]);

  return {
    itemOffsets,
    itemsSnapshotSignature,
  };
}
