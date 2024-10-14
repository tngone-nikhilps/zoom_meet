import { useEffect, useRef, useState } from "react";

interface Participant {
  userId: number;
  displayName: string;
  isLocal: boolean;
}

const RESOLUTION = { width: 640, height: 360 };

const VideoCall = ({ client, stream }: any) => {
  let participants = client.getAllUser();
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeParticipants = () => {
      const localUser = client.getCurrentUserInfo();
    };

    initializeParticipants();
  }, [client]);
  console.log(participants, "participants");
  useEffect(() => {
    participants.forEach(
      async (participant: { userId: any; isLocal: any; displayName: any }) => {
        if (!videoContainerRef.current) return;
        console.log(participant, "patitinepantiii");
        try {
          await stream
            .attachVideo(participant.userId, RESOLUTION)
            .then((userVideo: any) => {
              videoContainerRef.current?.appendChild(userVideo);
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
