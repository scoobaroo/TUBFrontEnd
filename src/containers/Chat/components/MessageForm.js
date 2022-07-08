import React from "react";
import styled from "styled-components";
import {AiFillFileAdd} from 'react-icons/ai';

const Messageform = styled.form`
    position: absolute;
    bottom: 5px;
    left: 15px;
    width: calc(100% - 30px);
    background: #252525;
    border-radius: 60px;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
 div{
  width: calc(100% - 100px);
  input {
    width: 100%;
    height: 45px;
    padding: 10px;
    border-radius: 20px 0 0  20px;
    outline: none;
    border: none;
  }
 }
  label{
    width: 45px;
    height: 45px;
    background: #fff;
    border-radius: 40px 0 0 40px;
    text-align: center;
    line-height: 45px;
    color: #636363;
    font-size: 22px;
    padding: 11px 0 12px 5px;
}
  }
  button {
    width: 100px;
    height: 45px;
    background: #fff;
    border:none;
    border-radius: 0 40px 40px 0;
    text-align: center;
    line-height: 45px;
    color: #636363;
    font-size: 16px;
  }
`;

const MessageForm = (props) => {
  return (
    <Messageform onSubmit={props.handleSubmit}>

       <div>
       <input
          type="text"
          placeholder="Enter message"
          value={props.text}
          onChange={(e) => props.setText(e.target.value)}
        />
       </div>
        <button className="btn">Send</button>
    </Messageform>
  );
};

export default MessageForm;
