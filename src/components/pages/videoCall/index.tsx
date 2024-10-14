import { useEffect, useRef, useState } from "react";

interface Participant {
  userId: number;
  displayName: string;
  isLocal: boolean;
}

const RESOLUTION = { width: 640, height: 360 };

const VideoCall = ({ client, stream }: any) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeParticipants = () => {
      const localUser = client.getCurrentUserInfo();
      setParticipants([
        {
          userId: localUser.userId,
          displayName: localUser.displayName,
          isLocal: true,
        },
      ]);
    };

    const handleUserAdded = (user: any) => {
      setParticipants((prev) => [
        ...prev,
        {
          userId: user.userId,
          displayName: user.displayName,
          isLocal: false,
        },
      ]);
    };

    const handleUserRemoved = (userId: number) => {
      setParticipants((prev) => prev.filter((p) => p.userId !== userId));
    };

    initializeParticipants();
    client.on("user-added", handleUserAdded);
    client.on("user-removed", handleUserRemoved);

    return () => {
      client.off("user-added", handleUserAdded);
      client.off("user-removed", handleUserRemoved);
      if (client) {
        client.leave();
      }
    };
  }, [client]);
  console.log(participants, "participantss");
  useEffect(() => {
    participants.forEach(async (participant) => {
      if (!videoContainerRef.current) return;

      try {
        await stream.startVideo();
        const video = await stream.attachVideo(participant.userId, RESOLUTION);
        const videoWrapper = document.createElement("div");
        videoWrapper.className = `video-wrapper ${
          participant.isLocal ? "local" : "remote"
        }`;
        videoWrapper.appendChild(video);
        const nameTag = document.createElement("div");
        nameTag.className = "name-tag";
        nameTag.textContent = `${participant.displayName} ${
          participant.isLocal ? "(You)" : ""
        }`;
        videoWrapper.appendChild(nameTag);
        videoContainerRef.current.appendChild(videoWrapper);
      } catch (error) {
        console.error(
          `Failed to attach video for user ${participant.userId}:`,
          error
        );
      }
    });

    return () => {
      if (videoContainerRef.current) {
        videoContainerRef.current.innerHTML = "";
      }
    };
  }, [participants, stream]);

  return (
    <div>
      <div ref={videoContainerRef} className="video-container"></div>
    </div>
  );
};

export default VideoCall;
