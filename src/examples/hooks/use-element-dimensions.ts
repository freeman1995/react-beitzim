import { RefObject, useEffect, useRef, useState } from "react";

export function useElementDimensions<T extends HTMLElement>(): [
  RefObject<T>,
  { width: number; height: number }
] {
  const ref = useRef<T>(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

  useEffect(() => {
    const onResize = () =>
      setDimensions({
        width: ref.current?.clientWidth || 0,
        height: ref.current?.clientHeight || 0
      });

    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return [ref, dimensions];
}
