import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import styled from "styled-components";

const MessageWrapper = styled.div`
margin-top: 7px;
padding: 0px 10px;
text-align: ${(props) => (props.FromUser === props.currentUser ? "right" : "left")};
align-items: ${(props) => (props.FromUser === props.currentUser ? "flex-end" : "flex-start")};
display: flex;
flex-direction: column;
img{
    width: 100%;
    border-radius: 5px;
}
p {
    padding: 10px;
    display:block;
    max-width: 50%;
    text-align: left;
    border-radius: 15px 15px 0 15px;
    background: ${(props) => (props.FromUser === props.currentUser ? "#a7d1f5" : "#edc9e7")};
    color: ${(props) => (props.FromUser === props.currentUser ? "#000" : "#000")};
    border-radius: ${(props) => (props.FromUser === props.currentUser ? "15px 15px 0 15px" : "15px 15px 15px 0")};
}
small {
    display: inline-block;
    margin-top: 3px;
    opacity: 0.8;
}
`;


const Message = (props) => {
  const scrollRef = React.useRef();
  console.log('props', props)
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.msg]);
  return (
    (props.msg.from === props.selected.uid || props.msg.to === props.selected.uid) &&
    (<MessageWrapper
      FromUser={props.msg.from}
      currentUser={props.loggedUser}
      ref={scrollRef}
    >

      <p className={props.msg.from === props.loggedUser ? "me" : "friend"}>
        {props.msg.media ? <img src={props.msg.media} alt={props.msg.text} /> : null}
        {props.msg.text}
      </p>

      <small>
        <Moment fromNow>{props.msg.createdAt.toDate()}</Moment>
      </small>
    </MessageWrapper>)

  );
};

export default Message;