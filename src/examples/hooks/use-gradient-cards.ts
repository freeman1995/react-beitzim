import { filter, map, range, update } from "lodash/fp";
import { generateGradientCard, GradientCard } from "../list/utils/gradient-card-utils";
import { useCallback, useState } from "react";

const data = range(0, 25000).map(generateGradientCard);

export const useGradientCards = () => {
  const [items, setItems] = useState<GradientCard[]>(data);

  const addItemBefore = useCallback(
    (itemIndex: number) =>
      setItems(items => [
        ...items.slice(0, itemIndex),
        { ...generateGradientCard(), isNew: true },
        ...items.slice(itemIndex, items.length)
      ]),
    []
  );

  const addItemAfter = useCallback(
    (itemIndex: number) =>
      setItems(items => [
        ...items.slice(0, itemIndex + 1),
        { ...generateGradientCard(), isNew: true },
        ...items.slice(itemIndex + 1, items.length)
      ]),
    []
  );

  const markItemAsRemoved = useCallback(
    (itemIndex: number) =>
      setItems(update(itemIndex, item => ({ ...item, isRemoved: true, size: 0 }))),
    []
  );

  const removeItem = useCallback(itemId => setItems(filter(item => item.id !== itemId)), []);

  const updateItem = useCallback(
    (itemIndex: number) =>
      setItems(update(itemIndex, item => ({ ...generateGradientCard(), id: item.id }))),
    []
  );

  const unmarkItemAsNew = useCallback(
    itemId => setItems(map(item => (item.id === itemId ? { ...item, isNew: false } : item))),
    []
  );

  return {
    items,
    addItemBefore,
    addItemAfter,
    markItemAsRemoved,
    removeItem,
    updateItem,
    unmarkItemAsNew
  };
};
