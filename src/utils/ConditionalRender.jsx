import { Fragment } from "react";

export const ConditionalRender = ({condition = true, children}) => {
  let render = false;
  if (typeof condition === 'boolean') render = condition;
  else if (typeof condition === 'function') render = condition();

  if (render) {
      return (<Fragment>{children}</Fragment>);
  }
  return  (<Fragment />);
};