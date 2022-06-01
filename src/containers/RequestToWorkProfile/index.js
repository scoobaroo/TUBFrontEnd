import React from "react";
import { Button, ProgressCircle, Well, Heading,TabList,
    Tabs,
    Item,
    TabPanels,
    TableView,
    TableBody,
    TableHeader,
    Column,
    Row,
    Cell, } from "@adobe/react-spectrum";
import withAuthorization from "../../session/withAuthorization";
import { withFirebase } from "../../firebase";
import { compose } from "recompose";
import withRouter from "../../session/withRouter";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { lchown } from "fs";
import { concat } from "ethers/lib/utils";

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: 576px) {
    padding: 0 15px;
    max-width: 100%;
  }
  & .card,
  & .edit_profile {
    @media (max-width: 576px) {
      width: 100%;
    }
  }
`;

const Profile = ({
  src,
  telephone,
  linkedInUrl,
  gitHubUrl,
  email,
  first_name,
  last_name,
}) => (
  <CardWrapper>
    <div className="card">
      <h1>User Profile</h1>
      <form>
        <label className="custom-file-upload fas">
          <div className="img-wrap">
            <img src={src} />
          </div>
        </label>
        <div className="item_wrapper">
          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>First Name: </span>
            {first_name}
          </Heading>
          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>Last Name: </span>
            {last_name}
          </Heading>
          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>Telephone: </span>
            {telephone}
          </Heading>

          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>Github url: </span>
            {gitHubUrl}
          </Heading>

          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>LinekdIn url: </span>
            {linkedInUrl}
          </Heading>

          <Heading marginBottom="10">
            <span style={{ color: "#766e6e" }}>User email: </span>
            {email}
          </Heading>
        </div>
      </form>
    </div>
  </CardWrapper>
);

const userDetails = {
  first_name: "",
  last_name: "",
  email: "",
  profilePicture: "",
  linkedIn: "",
  github: "",
  telephone: "",
  education: [],
  certification: [],
};

const ProfileView = ({}) => {
  const location = useLocation();
  const [user, setUser] = React.useState({ ...userDetails });

  React.useEffect(() => {
    getAccontDetails();
  }, []);

  const getAccontDetails = () => {
    setUser((prevState) => ({
      ...prevState,
      first_name: location.state.firstName,
      last_name: location.state.lastName,
      email: location.state.Email,
      profilePicture: location.state.Url,
      linkedIn: location.state.linkedIn,
      github: location.state.Github,
      telephone: location.state.Telephone,
      education: location.state.Education,
      certification: location.state.Certification,
    }));
  };

  return (
    <>
      <Profile
        src={user.profilePicture}
        gitHubUrl={user.github}
        telephone={user.telephone}
        linkedInUrl={user.linkedIn}
        last_name={user.last_name}
        first_name={user.first_name}
        email={user.email}
      />
      <Well margin="15px">
        <Tabs marginBottom="20px" aria-label="Education and Certifications">
          <TabList>
            <Item key="Edu">Educations</Item>
            <Item key="Cert">Certifications</Item>
          </TabList>

          <TabPanels>
            <Item key="Edu">
              <TableView>
                <TableHeader>
                  <Column>Label or Name</Column>
                  <Column align="end">Type</Column>
                </TableHeader>
                <TableBody>
                  {user.education?.map((item) => (
                    <Row>
                      <Cell>{item.cob_name}</Cell>
                      <Cell>{item['cob_educationtype@OData.Community.Display.V1.FormattedValue']}</Cell>
                      
                    </Row>
                  ))}
                </TableBody>
              </TableView>
            </Item>
            <Item key="Cert">
              <TableView>
                <TableHeader>
                  <Column>Label</Column>
                  <Column>Name</Column>
                  <Column align="end">Type</Column>
                </TableHeader>
                <TableBody>
                  {user.certification?.map((item) => (
                    <Row>
                      <Cell>{item.cob_name}</Cell>
                      <Cell>{}</Cell>
                      <Cell>{}</Cell>
                    </Row>
                  ))}
                </TableBody>
              </TableView>
            </Item>
          </TabPanels>
        </Tabs>
      </Well>
    </>
  );
};

const RequestToWorkProfile = compose(withRouter, withFirebase)(ProfileView);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(RequestToWorkProfile);
