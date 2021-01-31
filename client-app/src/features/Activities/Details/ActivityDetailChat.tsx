import React, { Fragment, useContext, useEffect } from "react";
import { Segment, Header, Form, Button, Comment } from "semantic-ui-react";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { Form as FinalForm, Field } from "react-final-form";
import { Link } from "react-router-dom";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import { observer } from "mobx-react-lite";

const ActivityDetailChat = () => {
  const rootStore = useContext(RootStoreContext);
  const {createHubConnection, stopHubConnection, addComment, selectedActivity} = rootStore.activityStore;

  useEffect(() => {
    createHubConnection();

    return () => {
      stopHubConnection();
    }
  }, [createHubConnection, stopHubConnection])
  return (
    <Fragment>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
        {
          selectedActivity && selectedActivity.comments && selectedActivity.comments.map((comment) => {
            return (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.image || "/assets/user.png"} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.username}`}>{comment.displayName}</Comment.Author>
                  <Comment.Metadata>
                    <div>{comment.createdAt}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                </Comment.Content>
              </Comment>
            )
          })
        }
        <FinalForm
          onSubmit={addComment}
          render={({ handleSubmit, submitting, form }) => (
            <Form onSubmit={() =>
              handleSubmit()! // typescript doesn't understand if handleSubmit is available as we are using a 3rd paty library
              .then( () => form.reset()) // this will clear the form for us
              }>
              <Field
                name='body'
                component={TextAreaInput}
                rows={2}
                placeholder="Add your comment"

              />
              <Button
                content="Add Reply"
                labelPosition="left"
                icon="edit"
                primary
                loading={submitting}
              />
            </Form>
          )}
        />

        </Comment.Group>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailChat);
