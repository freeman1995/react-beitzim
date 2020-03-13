import React, { useCallback, useRef, useState } from "react";
import { useVirtualList } from "react-beitzim";
import { Direction } from "react-beitzim/types";

import styles from "examples/list/components/gradient-card-list/gradient-card-list.module.scss";
import { useGradientCards } from "examples/hooks/use-gradient-cards";
import GradientCardView from "examples/list/components/gradient-card-view/gradient-card-view";

// TODO: Integrate react-beautiful-dnd
const GradientCardList = () => {
  const {
    items,
    addItemBefore,
    addItemAfter,
    markItemAsRemoved,
    removeItem,
    updateItem,
    unmarkItemAsNew
  } = useGradientCards();

  const [direction, setDirection] = useState(Direction.Vertical);
  const toggleDirection = useCallback(
    () =>
      setDirection(direction =>
        direction === Direction.Vertical ? Direction.Horizontal : Direction.Vertical
      ),
    []
  );

  const availableSizeMeasurerRef = useRef<HTMLDivElement>(null);
  const availableSize =
    availableSizeMeasurerRef.current?.[
      direction === Direction.Vertical ? "clientHeight" : "clientWidth"
    ];

  const {
    listContainerStyle,
    stripStyle,
    visibleItems,
    onScroll,
    scrollingSpeed,
    getItemOffset
  } = useVirtualList(items, item => item.size, availableSize, direction);

  const listContainerRef = useRef<HTMLDivElement>(null);
  const scrollToItem = useCallback(
    (itemIndex: number) =>
      listContainerRef.current &&
      listContainerRef.current.scrollTo({
        [direction === Direction.Vertical ? "top" : "left"]: getItemOffset(itemIndex),
        behavior: "smooth"
      }),
    [getItemOffset, direction]
  );

  return (
    <div className={styles.container}>
      <div>
        <button onClick={() => scrollToItem(0)}>Scroll to the start</button>
        <button onClick={() => scrollToItem(items.length - 1)}>Scroll to the end</button>
        <button onClick={toggleDirection}>Toggle Direction</button>
      </div>

      <div ref={availableSizeMeasurerRef} className={styles.availableSizeMeasurer}>
        <div ref={listContainerRef} style={listContainerStyle} onScroll={onScroll}>
          <div style={stripStyle}>
            {visibleItems.map(({ item, itemIndex, style }) => (
              <GradientCardView
                {...item}
                key={item.id}
                index={itemIndex}
                style={style}
                scrollingSpeed={scrollingSpeed}
                direction={direction}
                onUpdate={updateItem}
                onAddBefore={addItemBefore}
                onAddAfter={addItemAfter}
                onCreateComplete={unmarkItemAsNew}
                onRemove={markItemAsRemoved}
                onRemoveComplete={removeItem}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientCardList;
