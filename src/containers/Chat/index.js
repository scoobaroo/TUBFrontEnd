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

const HomeCantainer = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 1fr 3fr;
    overflow: hidden;
    height: calc(100vh - 54px);
    width: 100vw;
  }
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
  height: calc(100vh - 200px);
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
  let user1 = props.firebase.auth.currentUser;

  React.useEffect(() => {
    if (user1) {
      setCurrentUser(user1.uid);
    }
  }, [user1]);

  React.useEffect(() => {
    if (currentUser) {
      const usersRef = collection(props.firebase.db, "users");
      // create query object

      const q = query(usersRef, where("uid", "not-in", [currentUser]));
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
    
  }, [currentUser]);

  console.log("usererr", users);

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();

    const user2 = chat.uid;

    const id =
      currentUser > user2 ? `${currentUser + user2}` : `${user2 + currentUser}`;

    let url;
    if (img) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

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

    setText("");
    setImg("");
  };

  const selectUser = async (user) => {
    setChat(user);
    setSelectedUser(user);

    const user2 = user.uid;
    const id =
      currentUser > user2 ? `${currentUser + user2}` : `${user2 + currentUser}`;

    const msgsRef = collection(props.firebase.db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        debugger
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });

    // get last message b/w logged in user and selected user
    const docSnap = await getDoc(doc(props.firebase.db, "lastMsg", id));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== user1) {
      // update last message doc, set unread to false
      await updateDoc(doc(props.firebase.db, "lastMsg", id), { unread: false });
    }
  };

  console.log("msgs", msgs);
  return (
    <HomeCantainer>
      <UserContainer>
        {users.map((user) => (
          <Users
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={currentUser}
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
                  <Message key={i} msg={msg} user1={currentUser} selected={selectedUser} />   
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
