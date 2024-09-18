import { RefObject, useEffect } from "react";

const useOutsideClick = (
  ref: RefObject<HTMLElement>[] | RefObject<HTMLElement>,
  callback: (event?: MouseEvent) => void,
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (Array.isArray(ref)) {
        // refs가 여러 개일 때
        const refs = ref as RefObject<HTMLElement>[];
        if (
          refs?.some(
            (ref) => !ref.current || ref.current.contains(event.target as Node),
          )
        ) {
          return;
        }
      } else {
        // refs가 하나일 때
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }
      }

      event ? callback(event) : callback();
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, callback]);
};

export default useOutsideClick;
