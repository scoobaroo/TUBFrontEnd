import React from "react";
import styled from "styled-components";
import ReactStars from "react-rating-stars-component";
import { Heading } from "@adobe/react-spectrum";

const Wrapper = styled.div`
  cursor: pointer;
  margin: 10px;
  background-color: #222222;
  border-radius: 10px;
  padding: 20px;
  width: 50%;
  @media (max-width: 992px) {
    width: 100%;
    margin: 10px 0;
  }
  & h4 {
    border-bottom: 1px solid #434242;
    margin-bottom: 15px;
    padding-bottom: 10px;
  }
`;

const ImageWrapperReview = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  & img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
  }
`;

const ReviewDisplay = (props) => {
  return (
    <Wrapper>
      <h4> {props.heading}</h4>

      <ImageWrapperReview onClick={props.profileViewHandler}>
        <img src={props.imageUrl} alt="profile" />
        <Heading>{props.userName}</Heading>
      </ImageWrapperReview>

      <ReactStars
        count={5}
        value={props.RateVAlue}
        edit={false}
        size={26}
        fullIcon={<i className="fa fa-star"></i>}
        activeColor="#ffd700"
      />

      {props.children}
    </Wrapper>
  );
};

export default ReviewDisplay;
