import React from "react";
import { Message } from "semantic-ui-react";
import { AxiosResponse } from "axios";

interface IProps {
  error: AxiosResponse;
  text?: string;
}

const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
  return (
    <Message negative>
      <Message.Header>{error.statusText}</Message.Header>
      {error.data && Object.keys(error.data.errors).length > 0 && (
        // check for error data & if error.data.errors has more than 1 properties
        <Message.List>
          {Object.values(error.data.errors)
            .flat()
            .map((err, i) => (
              // convert error.data.errors into array & map over it
              // returning each error message as a Message.Item
              // note: errors are defined by api & fliuent validator
              <Message.Item key={i}>{err}</Message.Item>
            ))}
        </Message.List>
      )}
      {text && <p>{text}</p>}
    </Message>
  );
};

export default ErrorMessage;
