import React from "react";
import EducationModal from "./EducationModal";
import CertificationModal from "./CertificationModal";
import appConfig from "../../../app-config";
import ReviewDisplay from "../../../components/ReviewDispay";
import { AppContext } from "../../../context/index";
import styled from "styled-components";
import axios from "axios";
import SuccessModal from "../../../components/SuccessModal";
import ErrorModal from "../../../components/ErrorModal";
import ReactDOM from "react-dom";
import {
  TabList,
  Tabs,
  Item,
  TabPanels,
  TableView,
  TableBody,
  TableHeader,
  Column,
  Row,
  Cell,
} from "@adobe/react-spectrum";
import { debugErrorMap } from "firebase/auth";

const ReviewWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-row-gap: 16px;
  grid-column-gap: 16px;
  margin: 16px;
  @media (max-width: 576px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Tables = (props) => {
  const InitialEducationState = {
    Name: "",
    EducationType: "",
  };

  const InitialCertificationState = {
    Nameorlabel: "",
    EducationType: "",
    Name: "",
  };
  const [certificationDetails, setCertificationDetails] = React.useState({
    ...InitialCertificationState,
  });

  const [educationDetails, setEducationDetails] = React.useState({
    ...InitialEducationState,
  });
  const [educationType, setEducationType] = React.useState();
  const [globalState] = React.useContext(AppContext);
  const [showModal, setShowModal] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [education, setEducation] = React.useState(false);

  React.useEffect(() => {
    const value = globalState.EducationType;
    setEducationType(value?.map((item) => item.Label.UserLocalizedLabel));
  }, []);

  const setEducationName = (e) => {
    setEducationDetails((prevState) => ({
      ...prevState,
      Name: e,
    }));
  };

  const setEducationtype = (e) => {
    setEducationDetails((prevState) => ({
      ...prevState,
      EducationType: e,
    }));
  };

  const setCertificationNameorLabel = (e) => {
    setCertificationDetails((prevState) => ({
      ...prevState,
      Nameorlabel: e,
    }));
  };

  const setCertificationType = (e) => {
    setCertificationDetails((prevState) => ({
      ...prevState,
      EducationType: e,
    }));
  };

  const SetcetificationName = (e) => {
    setCertificationDetails((prevState) => ({
      ...prevState,
      Name: e,
    }));
  };

  const formRegisterEducation = () => {
    props.loader(true);
    axios
      .post(
        `${appConfig.development.apiBaseUrl}users/${globalState.accountId}/educations/new`,
        educationDetails
      )
      .then((res) => {
        props.success(true);
        props.education(true);
        props.profileDetails();
        console.log(res);
        props.loader(false);
       
      })
      .catch((err) => {
        props.error(true);
        console.log(err);
        props.loader(false);
      });
    setShowModal(false);
  };

  const formRegisterCertification = () => {
    props.loader(true);
    axios
      .post(
        `${appConfig.development.apiBaseUrl}users/${globalState.accountId}/certifications/new`,
        certificationDetails
      )
      .then((res) => {
        props.success(true);
        console.log(res);
        props.profileDetails();
        props.loader(false);
   
      })
      .catch((err) => {
        props.error(true);
        console.log(err);
        props.loader(false);
      
      });
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <Tabs marginBottom="20px" aria-label="Education and Certifications">
        <TabList>
          <Item key="Edu">Educations</Item>
          <Item key="Cert">Certifications</Item>
          <Item key="customer_rating">Customer Rating</Item>
          <Item key="provider_rating">Provider Rating</Item>
        </TabList>

        <TabPanels>
          <Item key="Edu">
            <EducationModal
              onSetName={setEducationName}
              onSetEducationType={setEducationtype}
              register={formRegisterEducation}
              modal={showModal}
              openModal={openModal}
              closeModal={closeModal}
              EducationType={educationType}
            />
            <TableView>
              <TableHeader>
                <Column>Degree</Column>
                <Column align="end">Type</Column>
              </TableHeader>
              <TableBody>
                {props.educationDetails?.map((item) => (
                  <Row>
                    <Cell>{item.cob_name}</Cell>
                    <Cell>
                      {
                        item[
                          "cob_educationtype@OData.Community.Display.V1.FormattedValue"
                        ]
                      }
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </TableView>
          </Item>
          <Item key="Cert">
            <CertificationModal
              onSetlabel={setCertificationNameorLabel}
              onSetEducationType={setCertificationType}
              onSetName={SetcetificationName}
              register={formRegisterCertification}
              modal={showModal}
              openModal={openModal}
              closeModal={closeModal}
            />
            <TableView>
              <TableHeader>
                <Column>Certification</Column>
                <Column align="end">Type</Column>
              </TableHeader>
              <TableBody>
                {props.cetification?.map((item) => (
                  <Row>
                    <Cell>{item.cob_name}</Cell>
                    <Cell>{}</Cell>
                  </Row>
                ))}
              </TableBody>
            </TableView>
          </Item>
          <Item key="customer_rating">
            <ReviewWrapper>
              {props.CustomerReviewOfProvider.map((item) => (
                <ReviewDisplay RateVAlue={item.cob_rating}>
                  <h3>{item.cob_name}</h3>
                  {item.cob_description}
                </ReviewDisplay>
              ))}
            </ReviewWrapper>
          </Item>
          <Item key="provider_rating">
            <ReviewWrapper>
              {props.ProviderReviewOfDisplay.map((item) => (
                <ReviewDisplay RateVAlue={item.cob_rating}>
                  <h3>{item.cob_name}</h3>

                  {item.cob_description}
                </ReviewDisplay>
              ))}
            </ReviewWrapper>
          </Item>
        </TabPanels>
      </Tabs>
 
    </>
  );
};

export default Tables;
