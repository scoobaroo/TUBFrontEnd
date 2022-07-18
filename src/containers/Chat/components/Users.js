import React, { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import styled from "styled-components";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import appConfig from "../../../app-config";
import { AppContext } from "../../../context";

const UserWrapper = styled.div`
  margin-bottom: 7px;
  padding: 10px;
  cursor: pointer;
  border-radius: 10px;
  background: ${(props) =>
    props.chat.uid === props.user.uid ? "#4e4e4e" : "#333"};
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid var(--color-4);
  }
  h4 {
    margin-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  h5 {
    margin-left: 10px;
    background: blue;
    color: white;
    padding: 2px 4px;
    border-radius: 10px;
  }
`;

const Online = styled.div`
  background: #34eb52;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: 10px;
`;

const Offline = styled.div`
background: #cc1414;;
width: 10px;
height: 10px;
border-radius: 50%;
flex-shrink: 0;
margin-left: 10px;
`;

const Ptag = styled.p`
  font-size: 14px;
  white-space: nowrap;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 10px;
  strong {
    margin-right: 10px;
  }
`;

const Users = ({ loggedUser, user, selectUser, chat }) => {
  const app = initializeApp(appConfig.development.firebaseConfig);
  const [state, setState] = React.useContext(AppContext);
  const [imageUrl, setImageUrl] = useState("");
  const db = getFirestore(app);
  const user2 = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id =
      loggedUser > user2 ? `${loggedUser + user2}` : `${user2 + loggedUser}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
      let data = doc.data();
      setState((prevState) => ({
        ...prevState,
        MessageContext: data,
      }));
    });
    imageHandler();
    return () => unsub();
  }, []);

  const imageHandler = () => {
    if (user.profilePicture) {
      const string2 = user.profilePicture;
      const string1 = "data:image/png;base64,";
      setImageUrl(string1.concat(string2));
    }
  };

  return (
    <>
      <UserWrapper chat={chat} user={user} onClick={() => selectUser(user)}>
        <UserInfo>
          <UserDetails>
            <img
              src={
                imageUrl
                  ? imageUrl
                  : "https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true"
              }
              alt="avatar"
              className="avatar"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex" }}>
                <h4>
                  {user.firstName && user.lastName
                    ? user.firstName + " " + user.lastName
                    : user.email}
                </h4>
                {data?.from !== loggedUser && data?.unread && <h5>New</h5>}
              </div>
              {data && (
                <Ptag>
                  <strong>{data.from === loggedUser ? "Me:" : null}</strong>
                  {data.text}
                </Ptag>
              )}
            </div>
          </UserDetails>

          {user.isOnline ? <Online></Online> : <Offline></Offline>}
        </UserInfo>
      </UserWrapper>

    </>
  );
};

export default Users;
