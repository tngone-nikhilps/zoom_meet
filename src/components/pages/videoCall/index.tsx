import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  DOMAttributes,
  HTMLAttributes,
  DetailedHTMLProps,
  useCallback,
} from "react";
import ZoomVideo, {
  Participant,
  VideoPlayer,
  VideoPlayerContainer,
} from "@zoom/videosdk";
import { VideoQuality } from "@zoom/videosdk";
import { ZoomClient } from "../../../index-types";
type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["video-player"]: DetailedHTMLProps<
        HTMLAttributes<VideoPlayer>,
        VideoPlayer
      > & { class?: string };
      ["video-player-container"]: CustomElement<VideoPlayerContainer> & {
        class?: string;
      };
      // ['zoom-video']: DetailedHTMLProps<HTMLAttributes<VideoPlayer>, VideoPlayer> & { class?: string };
      // ['zoom-video-container']: CustomElement<VideoPlayerContainer> & { class?: string };
    }
  }
}
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
  const videoPlayerListRef = useRef<Record<string, VideoPlayer>>({});

  useParticipantsChange(client, (newParticipants) => {
    setParticipants(newParticipants);
  });
  useEffect(() => {
    if (participants.length > 0) {
      participants.forEach((userId) => {
        const attachment = videoPlayerListRef.current[`${userId}`];
        if (attachment) {
          stream?.attachVideo(userId, VideoQuality.Video_720P, attachment);
        }
      });
    }
  }, [participants]);
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
  const setVideoPlayerRef = (userId: number, element: VideoPlayer | null) => {
    if (element) {
      videoPlayerListRef.current[`${userId}`] = element;
    }
  };
  console.log(participants, "participantss");
  return (
    <div>
      <video-player-container class="video-container-wrap">
        {participants.map((user) => {
          return (
            <div
              className="video-cell relative w-[250px] aspect-video"
              key={user.userId}
            >
              <div>
                <video-player
                  class="video-player absolute top-0 left-0 block bottom-0 right-0"
                  ref={(element) => {
                    setVideoPlayerRef(user.userId, element);
                  }}
                />
              </div>
            </div>
          );
        })}
      </video-player-container>
    </div>
  );
};

export default VideoCall;
