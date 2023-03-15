import React, { useEffect, useState } from "react";

const useChangeState = () => {
  const [state, setState] = useState(false);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setState(false);
    }, 200);
    return () => clearTimeout(timeOut);
  }, [state]);

  const pressState = () => setState(true);

  return [state, pressState];
};

export default useChangeState;
