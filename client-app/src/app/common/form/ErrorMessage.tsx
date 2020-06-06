import React from "react";
import { Message } from "semantic-ui-react";
import { AxiosResponse } from "axios";

interface IProps {
  error: AxiosResponse;
  text?: string;
}

const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
  return (
    <Message attached="bottom" negative>
      <Message.Header>{error.statusText}</Message.Header>
      {text && <p>{text}</p>}
    </Message>
  );
};

export default ErrorMessage;
