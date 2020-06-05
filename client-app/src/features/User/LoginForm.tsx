import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Label, Header } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/User";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";

const validate = combineValidators({
  email: isRequired("email"),
  password: isRequired("password"),
});

const LoginForm = () => {
  const {
    userStore: { login },
  } = useContext(RootStoreContext);
  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        login(values).catch((error) => ({
          // Note: we are catching errors from within agent.ts
          [FORM_ERROR]: error, // FORM_ERROR: stores error object into our final-form - form values object
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting, // final form will provide a boolean when submitting data
        form, // provides us with form values & error data..
        submitError, // variable is provided by form & we can destructure here
        invalid, // variable is provided by form & we can destructure here
        pristine, // variable is provided by form & we can destructure here
        dirtySinceLastSubmit, // will check to see if input has been changed, allowing us to force flags to reset on input changes
      }) => (
        <Form onSubmit={handleSubmit}>
          <Header
            as="h2"
            content="Login to Reactivities"
            color="teal"
            textAlign="center"
          />
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />
          {submitError && !dirtySinceLastSubmit && (
            <Label color="red" basic content={submitError.statusText} />
          )}
          <Button
            loading={submitting}
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            color="teal"
            content="login"
            fluid
          />
          <pre>
            {JSON.stringify(form.getState(), null, 2) /** Holds form values */}
          </pre>
        </Form>
      )}
    />
  );
};

export default LoginForm;
