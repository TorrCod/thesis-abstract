import { MutableRefObject, useState, useEffect } from "react";

function useOnScreen<T extends Element | null>(
  ref: MutableRefObject<T>,
  rootMargin: string = "0px"
): boolean {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState<boolean>(false);
  useEffect(() => {
    let observerRefValue: Element | null = null; // <-- variable to hold ref value

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
      observerRefValue = ref.current;
    }
    return () => {
      if (observerRefValue) {
        observer.unobserve(observerRefValue);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    setIntersecting(false);
  };

  return isIntersecting;
}

export default useOnScreen;
