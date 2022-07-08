import React from "react";
import Users from "./components/Users";
import styled from "styled-components";
import { compose } from "recompose";
import { withFirebase } from "../../firebase";
import withRouter from "../../session/withRouter";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import MessageForm from "./components/MessageForm";
import Message from "./components/Message";
import { connectStorageEmulator } from "firebase/storage";

const HomeCantainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 1fr 3fr;
    flex-grow: 1;
    overflow: hidden;
  `;

const UserContainer = styled.div`
  background: #252525;
  overflow-y: auto;
  padding: 12px;
  border-right: 2px solid #1e1e1e;
  min-width: 275px;
`;

const MessagaContainer = styled.div`
  position: relative;
  width: 100%;
  h5 {
    font-size: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`;

const MessageUser = styled.div`
  padding: 10px;
  text-align: center;
  background: #252525;
`;

const Messages = styled.div`
  height: calc(100vh - 195px);
  overflow-y: auto;
  border-bottom: 1px solid var(--color-6);
`;

const ChatBase = (props) => {
  const [users, setUsers] = React.useState([]);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [chat, setChat] = React.useState("");
  const [text, setText] = React.useState("");
  const [img, setImg] = React.useState("");
  const [msgs, setMsgs] = React.useState([]);
  const [tempMmsgs, setTempMsgs] = React.useState([]);
  const [toUserId, setToUserId] = React.useState([]);
  let loggedUser = props.firebase.auth.currentUser;
  const id = props.location.state?.id;

  React.useEffect(() => {
    if (loggedUser) {
      setCurrentUser(loggedUser.uid)
      const usersRef = collection(props.firebase.db, "users");
      // create query object

      const q = query(usersRef, where("uid", "not-in", [loggedUser.uid]));
      // execute query
      let unsub = onSnapshot(q, (querySnapshot) => {
        let users = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });
        setUsers(users);
      });
      return () => unsub();
    }
  }, [loggedUser]);

  React.useEffect(() => {
    if (id && users.length > 0) selectUser(id)
  }, [users]);

  React.useEffect(() => {
    if (tempMmsgs.length > 0 && (tempMmsgs[0].from === selectedUser.uid || tempMmsgs[0].to === selectedUser.uid)) {
      setMsgs(tempMmsgs);
    }
  }, [tempMmsgs]);

  React.useEffect(() => {
    if (selectedUser) {
      fetchMessaged();
    }
  }, [selectedUser]);

  const fetchMessaged = async () => {
    const user2 = selectedUser.uid;
    const id =
      currentUser > user2 ? `${currentUser + user2}` : `${user2 + currentUser}`;
    console.log("id", id);

    const msgsRef = collection(props.firebase.db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let newMsg = [];
      querySnapshot.forEach((doc) => {

        newMsg.push(doc.data());
        setToUserId(doc.data().to)
      });
      setTempMsgs(newMsg);
    });
    
    // get last message b/w logged in user and selected user
    const docSnap = await getDoc(doc(props.firebase.db, "lastMsg", id));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== loggedUser) {
      // update last message doc, set unread to false
      await updateDoc(doc(props.firebase.db, "lastMsg", id), { unread: false });
    }
  }

  console.log("usererr", users);

  const handleSubmit = async (e) => {


    e.preventDefault();
    if (!text)
      return;

    setText("");
    setImg("");
    const user2 = chat.uid ? chat.uid : id;

    const id =
      currentUser > user2 ? `${currentUser + user2}` : `${user2 + currentUser}`;

    let url;

    await addDoc(collection(props.firebase.db, "messages", id, "chat"), {
      text,
      from: currentUser,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    });

    await setDoc(doc(props.firebase.db, "lastMsg", id), {
      text,
      from: currentUser,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });
  };

  const selectUser = async (user) => {
    let selectedChat = user;
    if (!user.uid) {
      selectedChat = users.find(usr => usr.uid === user);
    }
    setChat(selectedChat);
    setSelectedUser(selectedChat);
  };

  console.log("msgs", msgs);
  console.log("tosuerId", toUserId)
  return (
    <HomeCantainer>
      <UserContainer>
        {users.map((user) => (
          <Users
            key={user.uid}
            user={user}
            selectUser={selectUser}
            loggedUser={currentUser}
            chat={chat}
          />
        ))}
      </UserContainer>
      <MessagaContainer>
        {chat ? (
          <>
            <MessageUser>
              <h3>{chat.email}</h3>
            </MessageUser>

            <Messages>
              {msgs.length
                ? msgs.map((msg, i) => (

                  <Message key={i} msg={msg} loggedUser={currentUser} selected={selectedUser} />
                ))
                : null}
            </Messages>




            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </>
        ) : (
          <h5>Select a user to start conversation</h5>
        )}
      </MessagaContainer>
    </HomeCantainer>
  );
};



const Chat = compose(withRouter, withFirebase)(ChatBase);

export default Chat;
