import React from "react"

export const useToggle = initialState => {
  const [isToggled, setIsToggled] = React.useState(initialState);
  const isToggledRef = React.useRef(isToggled);

  const toggle = React.useCallback(
    () => setIsToggled(!isToggledRef.current),
    [isToggledRef, setIsToggled],
  );

  React.useEffect(() => {
    isToggledRef.current = isToggled;
  }, [isToggled]);

  return [isToggled, toggle];
};
