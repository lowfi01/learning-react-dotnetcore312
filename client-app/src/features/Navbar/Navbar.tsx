/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { useContext } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import ActivityStore from "../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { NavLink } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";

interface IProp {
  //
}

const Navbar: React.FC<IProp> = () => {
  const { activityStore } = useContext(RootStoreContext); // access activity store via root
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header as={NavLink} exact to="/">
          <img
            className=""
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Reactivities
        </Menu.Item>
        <Menu.Item as={NavLink} to="/activities" name="Activities" />
        <Menu.Item as={NavLink} to="/createActivity">
          <Button
            onClick={() => {
              activityStore.clearActivity();
            }}
            positive
            content="Create Activity"
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(Navbar);
