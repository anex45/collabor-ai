"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

export function Room({ children, params }) {
  // Generate a room ID - use documentid if available, otherwise use workspaceid
  const roomId = params?.documentid || params?.workspaceid || 'default-room';

  return (
    <LiveblocksProvider 
    authEndpoint={"/api/liveblocks-auth?roomId="+roomId}
    resolveUsers={async ({ userIds }) => {
      // ["marc@example.com", ...]
      const q=query(collection(db,'LoopUsers'),where('email','in',userIds));
      const querySnapshot=await getDocs(q);
      let userList=[]
      querySnapshot.forEach((doc)=>{
        console.log(doc.data())
        userList.push(doc.data())
      })
      return userList
      // Return a list of users
      // ...
    }}
    resolveMentionSuggestions={async({text,roomId})=>{
      const q=query(collection(db,'LoopUsers'),where('email','!=',null));
      const querySnapshot=await getDocs(q);
      let userList=[]
      querySnapshot.forEach((doc)=>{
        userList.push(doc.data())
      })
      if (text) {
        // Filter any way you'd like, e.g. checking if the name matches
        userList = userList.filter((user) => user.name.includes(text));
      }
      return userList.map((user) => user.id);
      }}
    >

      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}