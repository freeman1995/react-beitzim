import React from "react";
import { useVirtualMasonry } from "react-beitzim";
import { Direction } from "react-beitzim/types";
import { flatten, sortBy } from "lodash/fp";

import { useElementDimensions } from "examples/hooks/use-element-dimensions";
import { useGradientCards } from "examples/hooks/use-gradient-cards";
import GradientCardView from "examples/list/components/gradient-card-view/gradient-card-view";

const GradientCardMasonry = () => {
  const {
    items,
    addItemBefore,
    markItemAsRemoved,
    removeItem,
    updateItem,
    unmarkItemAsNew
  } = useGradientCards();

  const [measurerRef, availableSpace] = useElementDimensions<HTMLDivElement>();
  const { frameStyle, stripStyle, visibleItems, onScroll } = useVirtualMasonry(
    items,
    200,
    item => item.size,
    item => item.id,
    availableSpace.width,
    availableSpace.height
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <button onClick={() => requestAnimationFrame(() => addItemBefore(0))}>Add new card</button>
      <div ref={measurerRef} style={{ flex: 1 }}>
        <div style={frameStyle} onScroll={onScroll}>
          <div style={stripStyle}>
            {sortBy("item.id", flatten(visibleItems)).map(({ item, itemIndex, style }) => (
              <GradientCardView
                {...item}
                key={item.id}
                index={itemIndex}
                style={style}
                scrollingSpeed={0}
                direction={Direction.Vertical}
                onUpdate={updateItem}
                onCreateComplete={unmarkItemAsNew}
                onRemove={markItemAsRemoved}
                onRemoveComplete={removeItem}
              >
                <div
                  style={{
                    padding: "10px 15px",
                    border: "1px solid #fff",
                    borderRadius: 6,
                    fontSize: 30,
                    color: "#fff",
                    backgroundColor: "rgba(255, 255, 255, 0.15)"
                  }}
                >
                  {itemIndex}
                </div>
              </GradientCardView>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientCardMasonry;
