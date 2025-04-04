import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

export interface ITweet {
  id: string; // 문서 ID
  fileData?: string; // 파일 데이터 (Base64 인코딩된 문자열)
  tweet: string;
  userId: string; // 사용자 ID
  username: string; // 사용자 이름
  createdAt: number; // 생성 시간 (타임스탬프)
}

const Wrapper = styled.div``;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const fetchTweets = async () => {
    const tweetsQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(tweetsQuery);
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
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
