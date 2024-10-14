import React, { useEffect, useRef, useState } from "react";
import ZoomVideo from "@zoom/videosdk";

interface Participant {
  userId: number;
  displayName: string;
  isLocal: boolean;
}

const RESOLUTION = { width: 640, height: 360 };

const VideoCall: any = ({ client, stream }: any) => {
  let participants = client.getAllUser();
  const videoContainerRef = useRef<HTMLDivElement>(null);

  console.log(participants, "particpants");
  useEffect(() => {
    participants.forEach(
      async (participant: { userId: any; isLocal: any; displayName: any }) => {
        if (!videoContainerRef.current) return;

        try {
          stream.startVideo().then(() => {
            stream.attachVideo(participant.userId, 3).then((userVideo: any) => {
              videoContainerRef.current?.appendChild(userVideo);
            });
          });
        } catch (error) {
          console.error(
            `Failed to attach video for user ${participant.userId}:`,
            error
          );
        }
      }
    );

    return () => {
      if (videoContainerRef.current) {
        videoContainerRef.current.innerHTML = "";
      }
    };
  }, [participants, stream]);

  return (
    <div>
      <div
        ref={videoContainerRef}
        className="video-container w-[50vw] h-[50vh]"
      ></div>
    </div>
  );
};

export default VideoCall;
