import React, { useCallback, useEffect, useRef, useState } from "react";
import ZoomVideo, { Participant } from "@zoom/videosdk";
import { VideoQuality } from "@zoom/videosdk";
import { ZoomClient } from "../../../index-types";

const RESOLUTION = { width: 640, height: 360 };
function useMount(fn: Function) {
  useEffect(() => {
    fn();
  }, []);
}

function useParticipantsChange(
  zmClient: ZoomClient,
  fn: (participants: Participant[], updatedParticipants?: Participant[]) => void
) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const callback = useCallback(
    (updatedParticipants?: Participant[]) => {
      const participants = zmClient.getAllUser();
      fnRef.current?.(participants, updatedParticipants);
    },
    [zmClient]
  );
  useEffect(() => {
    zmClient.on("user-added", callback);
    zmClient.on("user-removed", callback);
    zmClient.on("user-updated", callback);
    return () => {
      zmClient.off("user-added", callback);
      zmClient.off("user-removed", callback);
      zmClient.off("user-updated", callback);
    };
  }, [zmClient, callback]);
  useMount(() => {
    callback();
  });
}
const VideoCall: any = ({ client, stream }: any) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useParticipantsChange(client, (newParticipants) => {
    setParticipants(newParticipants);
  });
  useEffect(() => {
    participants.forEach(async (participant) => {
      if (!videoContainerRef.current) return;

      try {
        await stream.startVideo();
        const video = await stream.attachVideo(participant.userId, RESOLUTION);
        const videoWrapper = document.createElement("div");

        videoWrapper.appendChild(video);
        const nameTag = document.createElement("div");
        nameTag.className = "name-tag";
        nameTag.textContent = `${participant.displayName}`;
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
      <div
        ref={videoContainerRef}
        className="video-container w-[50vw] h-[50vh]"
      ></div>
    </div>
  );
};

export default VideoCall;
