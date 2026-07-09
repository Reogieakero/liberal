import { useState, useCallback } from 'react';

export function usePasswordVisibility(initialVisible = false) {
  const [isVisible, setIsVisible] = useState(initialVisible);

  const toggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return {
    isVisible,
    toggle,
    inputType: isVisible ? ('text' as const) : ('password' as const),
  };
}