import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Message, Icon } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IUserFormValues } from "../../app/models/User";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";

const validate = combineValidators({
  displayName: isRequired("displayName"),
  userName: isRequired("userName"),
  email: isRequired("email"),
  password: isRequired("password"),
});

const RegisterForm = () => {
  const {
    userStore: { register },
    modalStore: { openModal },
  } = useContext(RootStoreContext);
  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        register(values).catch((error) => ({
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
        <>
          <Message
            attached
            header="Welcome to Reactivities!"
            content="Fill out the form below to sign-up for a new account"
          />
          <Form
            onSubmit={handleSubmit}
            error
            className="attached fluid segment"
          >
            <Field
              name="userName"
              component={TextInput}
              placeholder="User Name"
            />
            <Field
              name="displayName"
              component={TextInput}
              placeholder="Display Name"
            />
            <Form.Group widths="equal">
              <Field name="email" component={TextInput} placeholder="Email" />
              <Field
                name="password"
                component={TextInput}
                placeholder="Password"
                type="password"
              />
            </Form.Group>
            {submitError && !dirtySinceLastSubmit && (
              <ErrorMessage error={submitError} />
            )}
            <Button
              loading={submitting}
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              color="teal"
              content="Register"
              fluid
            />
            {/* <pre>
            {JSON.stringify(form.getState(), null, 2)}
          </pre> */}
          </Form>
          <Message attached="bottom" warning>
            <Icon name="help" />
            Already signed up?&nbsp;
            <Link to="#" onClick={() => openModal(<LoginForm />)}>
              Login here
            </Link>
          </Message>
        </>
      )}
    />
  );
};

export default RegisterForm;
