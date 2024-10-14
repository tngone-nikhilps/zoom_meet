import React, { useEffect, useRef, useState } from "react";
import ZoomVideo from "@zoom/videosdk";

const ZoomMeeting = () => {
  const [zoomClient, setZoomClient] = useState<any>(null);
  const [isJoined, setIsJoined] = useState<any>(false);
  const [participants, setParticipants] = useState<any>([]);
  const videoRef = useRef(null);

  useEffect(() => {
    initializeZoomClient();
  }, []);

  const initializeZoomClient = async () => {
    const client = ZoomVideo.createClient();
    await client.init("en-US", "Global");
    setZoomClient(client);
  };

  const joinSession = async () => {
    if (!zoomClient) return;

    try {
      // Replace with your actual JWT token
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiZThSeU82RXFSTUdwbW51Q3BNdjhfZyIsInJvbGVfdHlwZSI6MSwidHBjIjoiVGVzdCIsInZlcnNpb24iOjEsImlhdCI6MTcyODkxMTcxNCwiZXhwIjoxNzI4OTE1MzE0fQ.h3XOAzxnJkL56kz3pwaO4Akqr3Y_hQuTPBXvddHFLvU";

      // Replace with your session name and user information
      await zoomClient.join("Test", token, "Username1");

      setIsJoined(true);
      setupEventListeners();
      startLocalVideo();
    } catch (error) {
      console.error("Failed to join session:", error);
    }
  };

  const setupEventListeners = () => {
    zoomClient.on("user-added", (users: any) => {
      setParticipants((prevParticipants: any) => [
        ...prevParticipants,
        ...users,
      ]);
    });

    zoomClient.on("user-removed", (userId: any) => {
      setParticipants((prevParticipants: any[]) =>
        prevParticipants.filter(
          (participant: { userId: any }) => participant.userId !== userId
        )
      );
    });

    zoomClient.on(
      "video-active-change",
      async (payload: { state: any; userId: any }) => {
        const { state, userId } = payload;
        if (state === "Active") {
          const stream = await zoomClient.getCurrentUserInfo().stream;
          if (stream) {
            const videoElement: any = document.getElementById(
              `video-${userId}`
            );
            if (videoElement) {
              videoElement.srcObject = stream;
            }
          }
        }
      }
    );
  };

  const startLocalVideo = async () => {
    try {
      await zoomClient
        .getMediaStream()
        .startVideo({ videoElement: videoRef.current });
    } catch (error) {
      console.error("Failed to start local video:", error);
    }
  };

  const leaveSession = async () => {
    if (zoomClient) {
      await zoomClient.leave();
      setIsJoined(false);
      setParticipants([]);
    }
  };

  return (
    <div>
      {!isJoined ? (
        <button onClick={joinSession}>Join Session</button>
      ) : (
        <>
          <button onClick={leaveSession}>Leave Session</button>
          <div>
            <h3>Local Video</h3>
            <video ref={videoRef} width="400" height="300" />
          </div>
          <div>
            <h3>Participants</h3>
            {participants.map(
              (participant: {
                userId: React.Key | null | undefined;
                displayName:
                  | string
                  | number
                  | boolean
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | null
                  | undefined;
              }) => (
                <div key={participant.userId}>
                  <p>{participant.displayName}</p>
                  <video
                    id={`video-${participant.userId}`}
                    width="400"
                    height="300"
                    autoPlay
                    playsInline
                  />
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ZoomMeeting;
