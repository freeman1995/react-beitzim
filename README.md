# react-beitzim

Hooks Oriented List Virtualization

## Demo

https://codesandbox.io/s/github/freeman1995/react-beitzim

## Example

```
import React from "react";
import { useVirtualList } from "react-beitzim";

const items = new Array(100000).fill(1);

const Example = () => {
  const { containerStyle, stripStyle, visibleItems, onScroll } = useVirtualList(
    items,
    100,
    800
  );

  return (
    <div
      style={{ ...containerStyle, width: 200, textAlign: "center" }}
      onScroll={onScroll}
    >
      <div style={stripStyle}>
        {visibleItems.map(({ item, itemIndex, style }, physicalIndex) => (
          <div key={physicalIndex} style={style}>
            {itemIndex}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Example;
```

## API

### useVirtualList

▸ **useVirtualList**<**ItemType**>(`items`: ItemType[], `itemSize`: number | [ItemSizeGetter](_types_.md#itemsizegetter)‹ItemType›, `listSize`: number, `listDirection`: Direction, `overscan`: number): _object_

**Type parameters:**

▪ **ItemType**

**Parameters:**

| Name            | Type                                   | Default            |
| --------------- | -------------------------------------- | ------------------ |
| `items`         | ItemType[]                             | -                  |
| `itemSize`      | number &#124; ItemSizeGetter‹ItemType› | -                  |
| `listSize`      | number                                 | -                  |
| `listDirection` | Direction                              | Direction.Vertical |
| `overscan`      | number                                 | 10                 |

**Returns:** _object_

- **getItemOffset**: _ItemOffsetGetter_

- **listContainerStyle**: _CSSProperties_

- **onScroll**: _UIEventHandler_

- **scrollingSpeed**: _number_

- **stripStyle**: _CSSProperties_

- **visibleItems**: _VisibleItemDescriptor‹ItemType›[]_

## Types

### Enumeration: Direction

#### Enumeration members

- Horizontal
- Vertical

### ItemOffsetGetter: Function

#### Type declaration:

▸ (`itemIndex`: number): _number_

**Parameters:**

| Name        | Type   |
| ----------- | ------ |
| `itemIndex` | number |

---

### ItemSizeGetter: Function

#### Type declaration:

▸ (`item`: ItemType): _number_

**Parameters:**

| Name   | Type     |
| ------ | -------- |
| `item` | ItemType |

---

### Range: Object

#### Type declaration:

- **endIndex**: _number_

- **startIndex**: _number_

---

### VisibleItemDescriptor‹ItemType›: Object

#### Type declaration:

- **item**: _ItemType_

- **itemIndex**: _number_

- **style**: _CSSProperties_
