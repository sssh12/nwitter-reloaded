import styled from "styled-components";
import { auth, db } from "../firebase";
import React, { useEffect, useState } from "react";
import { handleFileChange } from "../util/util";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  onSnapshot, // 추가
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { updateProfile } from "firebase/auth";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  margin-right: 10px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: scroll;
  width: 100%;
  margin-bottom: 10px;
`;

const NameInput = styled.input`
  background-color: black;
  font-size: 22px;
  text-align: center;
  color: white;
  border: 1px solid white;
`;

const ChangeNameBtn = styled.button`
  background-color: #1d9bf0;
  width: 30%;
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

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState<string | null>(null);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [name, setName] = useState(user?.displayName ?? "Anonymous");
  const [isEdit, setEdit] = useState(false);
  // Firestore에서 사용자 정보 가져오기
  const fetchUserAvatar = async () => {
    if (!user) return;

    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      console.log("User Data Found:", userData); // Debug log
      setAvatar(userData.avatar);
    } else {
      console.warn("No docs found for userId:", user.uid); // Debug log
      setAvatar(user?.photoURL || null);
    }
  };

  useEffect(() => {
    fetchUserAvatar();
  }, [user]);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      handleFileChange(e, async (fileData) => {
        if (!user) return;

        const usersCollectionRef = collection(db, "users");
        const q = query(usersCollectionRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // Firestore에 문서가 없을 때 새 문서 추가
          await addDoc(usersCollectionRef, {
            avatar: fileData,
            userId: user.uid,
          });
          console.log("addDoc");
        } else {
          // Firestore에 문서가 있을 때 avatar 업데이트
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, { avatar: fileData });
          console.log("updateDoc");
        }

        setAvatar(fileData); // 상태 업데이트
      });
    }
  };

  const fetchTweets = () => {
    if (!user) return;

    const tweetsQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );

    // 실시간 업데이트 구독
    const unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
      const tweets = snapshot.docs.map((doc) => {
        const { tweet, createdAt, userId, username, fileData } = doc.data();
        return {
          tweet,
          createdAt,
          userId,
          username,
          fileData,
          id: doc.id, // 문서 ID 추가
        };
      });
      setTweets(tweets);
    });

    // 컴포넌트가 언마운트될 때 구독 해제
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchTweets();
    return () => {
      unsubscribe && unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
    };
  }, [user]);

  const onChangeNameClick = async () => {
    if (!user) return;
    setEdit((prev) => !prev);
    if (!isEdit) return;
    try {
      await updateProfile(user, {
        displayName: name,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEdit(false);
    }
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        accept="image/*"
        type="file"
      />
      {isEdit ? (
        <NameInput onChange={onNameChange} type="text" value={name} />
      ) : (
        <Name>{name ?? "Anonymous"}</Name>
      )}
      <ChangeNameBtn onClick={onChangeNameClick}>
        {isEdit ? "Save" : "Change Name"}
      </ChangeNameBtn>
      <Tweets>
        {tweets.map((tweets) => (
          <Tweet key={tweets.id} {...tweets} />
        ))}
      </Tweets>
    </Wrapper>
  );
}
