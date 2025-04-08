import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import EditTweetForm from "./edit-tweet-form";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    box-shadow: inset -0.3rem -0.1rem 1.4rem gray,
      inset 0.3rem 0.4rem 0.8rem #bec5d0;
  }
`;

const EditButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: 0.3s;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    box-shadow: inset -0.3rem -0.1rem 1.4rem gray,
      inset 0.3rem 0.4rem 0.8rem #bec5d0;
  }
`;

export default function Tweet({
  username,
  fileData,
  tweet,
  userId,
  id,
}: ITweet) {
  const user = auth.currentUser;
  const [isEdit, setEdit] = useState(false);
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const onEdit = () => {
    if (user?.uid !== userId) return;
    setEdit((prev) => !prev);
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {!isEdit ? (
          <Payload>{tweet}</Payload>
        ) : (
          <EditTweetForm
            tweet={tweet}
            userId={userId}
            id={id}
            setEdit={setEdit}
          />
        )}
        {user?.uid === userId && !isEdit ? (
          <>
            <EditButton onClick={onEdit}>Edit</EditButton>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
          </>
        ) : null}
      </Column>
      <Column>{fileData ? <Photo src={fileData} /> : null}</Column>
    </Wrapper>
  );
}
