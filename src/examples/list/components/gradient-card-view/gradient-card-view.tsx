import React, { CSSProperties, FunctionComponent, useCallback, useEffect } from "react";
import { config, Spring } from "react-spring/renderprops";
import { Direction } from "react-beitzim/types";

import styles from "examples/list/components/gradient-card-view/gradient-card-view.module.scss";
import { GradientCard } from "examples/list/utils/gradient-card-utils";

type ItemProps = GradientCard & {
  index: number;
  style: CSSProperties;
  scrollingSpeed: number;
  direction: Direction;
  onUpdate: (itemIndex: number) => void;
  onUpdateComplete?: () => void;
  onAddBefore?: (itemIndex: number) => void;
  onAddAfter?: (itemIndex: number) => void;
  onCreateComplete: (itemId: string) => void;
  onRemove: (itemIndex: number) => void;
  onRemoveComplete: (itemId: string) => void;
};

export const GradientCardView: FunctionComponent<ItemProps> = ({
  children,
  id,
  background,
  size,
  isNew,
  isRemoved,
  index,
  style,
  scrollingSpeed,
  direction,
  onUpdate,
  onUpdateComplete,
  onAddBefore,
  onAddAfter,
  onCreateComplete,
  onRemove,
  onRemoveComplete
}) => {
  const animationsClear = useCallback(() => {
    if (isRemoved) {
      return onRemoveComplete(id);
    }

    if (isNew) {
      return onCreateComplete(id);
    }

    onUpdateComplete && onUpdateComplete();
  }, []);

  useEffect(() => {
    return animationsClear;
  }, []);

  return scrollingSpeed > 40 ? (
    <div className={styles.cardContainer} style={style}>
      <div className={styles.card} style={{ background }} />
    </div>
  ) : (
    <Spring
      from={{ size: isNew ? 0 : size, background }}
      to={{ size, background }}
      onRest={animationsClear}
      config={config.slow}
    >
      {({ size, background }) => (
        <div
          className={styles.cardContainer}
          style={{ ...style, [direction === Direction.Vertical ? "height" : "width"]: size }}
        >
          <div
            className={styles.card}
            style={{
              background,
              flexDirection: direction === Direction.Vertical ? "column" : "column"
            }}
          >
            {onAddBefore && (
              <button className={styles.actionButton} onClick={() => onAddBefore(index)}>
                Add New Before Me
              </button>
            )}
            {onAddAfter && (
              <button className={styles.actionButton} onClick={() => onAddAfter(index)}>
                Add New After Me
              </button>
            )}
            <button className={styles.actionButton} onClick={() => onRemove(index)}>
              Remove Me
            </button>
            <button className={styles.actionButton} onClick={() => onUpdate(index)}>
              Update Me
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                flex: 1,
                width: "100%"
              }}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </Spring>
  );
};

export default GradientCardView;
