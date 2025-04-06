import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";

interface Props {
  tweet: string;
  userId: string;
  id: string;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const EditBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    box-shadow: inset -0.3rem -0.1rem 1.4rem #fbfbfb,
      inset 0.3rem 0.4rem 0.8rem #bec5d0;
  }
`;

const CancelBtn = styled.input`
  background-color: gray;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    opacity: 0.8;
  }

  &:active {
    box-shadow: inset -0.3rem -0.1rem 1.4rem #fbfbfb,
      inset 0.3rem 0.4rem 0.8rem #bec5d0;
  }
`;

export default function EditTweetForm({ tweet, userId, id, setEdit }: Props) {
  const user = auth.currentUser;
  const [isLoading, setLoading] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !user ||
      user.uid !== userId ||
      isLoading ||
      editTweet === "" ||
      editTweet.length > 180
    )
      return;

    try {
      setLoading(true);
      await updateDoc(doc(db, "tweets", id), {
        tweet: editTweet,
        editedAt: Date.now(),
      });
      setEdit(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setEditTweet("");
    }
  };

  const onCancel = () => {
    setEdit(false);
    setEditTweet("");
    setLoading(false);
  };

  return (
    <Form onSubmit={onSubmit}>
      {/* 자동으로 커서가 입력창 안에 있도록 */}
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={editTweet}
        autoFocus
      />
      <EditBtn type="submit" value={isLoading ? "Editing..." : "Edit Tweet"} />
      <CancelBtn onClick={onCancel} type="button" value="Cancel" />
    </Form>
  );
}
