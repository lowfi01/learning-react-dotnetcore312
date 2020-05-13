import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const LoadingComponent: React.FC<{
  inverted?: boolean;
  content?: string;
  loaderSize?: string;
}> = ({ inverted = true, content = "Loading" }) => {
  return (
    <Dimmer active inverted={inverted}>
      <Loader content={content} />
    </Dimmer>
  );
};

export default LoadingComponent;
