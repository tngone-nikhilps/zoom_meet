import React, { useState, useEffect, useRef } from "react";
import ZoomVideo, { VideoQuality, VideoPlayerContainer } from "@zoom/videosdk";
import VideoCall from "../videoCall";

interface Device {
  deviceId: string;
  label: string;
  kind: "videoinput" | "audioinput";
}

const Preview: React.FC = () => {
  const [client, setClient] = useState<any>(null);
  const [stream, setStream] = useState<any>(null);

  const [localVideoTrack, setLocalVideoTrack] = useState<any>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<any>(null);
  const [isVideoPreviewOn, setIsVideoPreviewOn] = useState<boolean>(false);
  const [isAudioPreviewOn, setIsAudioPreviewOn] = useState<boolean>(false);
  const [isIncall, setIsIncall] = useState<boolean>(false);

  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<any>(null);
  const videoContainerRef = useRef<any>(null);

  useEffect(() => {
    const initializeZoom = async () => {
      const zoomClient = ZoomVideo.createClient();
      await zoomClient.init("en-US", "Global", {
        patchJsMedia: true,
        enforceMultipleVideos: true,
      });
      setClient(zoomClient);

      const devices = await ZoomVideo.getDevices();
      const videoInputs = devices.filter(
        (device) => device.kind === "videoinput"
      ) as Device[];
      const audioInputs = devices.filter(
        (device) => device.kind === "audioinput"
      ) as Device[];

      if (videoInputs.length > 0) {
        const videoTrack = ZoomVideo.createLocalVideoTrack(
          videoInputs[0].deviceId
        );
        setLocalVideoTrack(videoTrack);
      }

      if (audioInputs.length > 0) {
        const audioTrack = ZoomVideo.createLocalAudioTrack(
          audioInputs[0].deviceId
        );
        setLocalAudioTrack(audioTrack);
        audioTrack.start();
      }
    };

    initializeZoom();

    return () => {
      if (localVideoTrack) {
        localVideoTrack.stop();
      }
      if (localAudioTrack) {
        localAudioTrack.stop();
      }
    };
  }, []);

  const startVideoPreview = () => {
    if (localVideoTrack && previewVideoRef.current) {
      localVideoTrack.start(previewVideoRef.current);
      setIsVideoPreviewOn(true);
    }
  };

  const stopVideoPreview = () => {
    if (localVideoTrack) {
      localVideoTrack.stop();
      setIsVideoPreviewOn(false);
    }
  };

  const startAudioPreview = () => {
    if (localAudioTrack) {
      localAudioTrack.unmute();
      setIsAudioPreviewOn(true);
      updateMicrophoneVolume();
    }
  };

  const stopAudioPreview = () => {
    if (localAudioTrack) {
      localAudioTrack.mute();
      setIsAudioPreviewOn(false);
    }
  };

  const updateMicrophoneVolume = () => {
    if (localAudioTrack && isAudioPreviewOn) {
      requestAnimationFrame(updateMicrophoneVolume);
    }
  };
  const joinConference = () => {
    client
      .join(
        "Test",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiZThSeU82RXFSTUdwbW51Q3BNdjhfZyIsInJvbGVfdHlwZSI6MSwidHBjIjoiVGVzdCIsInZlcnNpb24iOjEsImlhdCI6MTcyODk4Nzc2MCwiZXhwIjoxNzI4OTkxMzYwfQ.YhNEvu1gCxLgh8dOe5Eqz1EFDbDsi_sOmy9quJbFWT4",
        "userName2"
      )
      .then(() => {
        const stream = client.getMediaStream();
        setStream(stream);
        setIsIncall(true);
      });
  };
  return (
    <div className="bg-black h-[100vh] text-white pt-[20px] ">
      <div className="px-[30px]">
        <img src="/icons/darkMode/fullLogo.svg" alt="" />
      </div>
      {!isIncall ? (
        <div className=" mt-[20px] w-full flex items-center flex-col relative">
          <div className=" relative">
            <div className="px-[1.5rem] py-[.42rem] rounded-[4.5rem] bg-[#a2a2a2] absolute left-4 bottom-4">
              <span className="text-[1rem]">Nikhil Ps</span>
            </div>{" "}
            <video
              ref={previewVideoRef}
              className={`w-[850px] aspect-video object-cover rounded-lg  border-[1px] border-primary ring-primary ring-1 ${
                isVideoPreviewOn ? "block" : "hidden"
              }`}
            />
            <div
              ref={previewCanvasRef}
              className={`w-[850px] aspect-video rounded-lg border-[1px] border-primary ring-primary ring-1 flex flex-col items-center justify-center ${
                !isVideoPreviewOn ? "block" : "hidden"
              } bg-[#313131]`}
            >
              <div className="text-[1.5rem] text-center">
                Do you want people to see you in the meeting?
              </div>
              <button
                className="bg-primary px-[2rem] py-[.7rem] rounded-lg mt-[20px]"
                onClick={startVideoPreview}
              >
                Allow Camera
              </button>
            </div>
          </div>

          <div className="flex items-center gap-[1.25rem] mt-[3.31rem]">
            <button
              className={`h-[3.75rem] w-[3.75rem] bg-primary flex items-center justify-center  rounded-full  ${
                isAudioPreviewOn ? "bg-primary" : "bg-[#FF4949]"
              } `}
              onClick={!isAudioPreviewOn ? startAudioPreview : stopAudioPreview}
            >
              {!isAudioPreviewOn ? (
                <img
                  src="/icons/micDisabled.svg"
                  className="w-[1.9rem] h-auto"
                  alt=""
                />
              ) : (
                <img
                  src="/icons/micEnabled.svg"
                  className="w-[1.8rem] h-auto"
                  alt=""
                />
              )}
            </button>
            <button
              className={`h-[3.75rem] w-[3.75rem] rounded-full  flex items-center justify-center ${
                isVideoPreviewOn ? "bg-primary" : "bg-[#FF4949]"
              } `}
              onClick={!isVideoPreviewOn ? startVideoPreview : stopVideoPreview}
            >
              {!isVideoPreviewOn ? (
                <img
                  src="/icons/videoDisabled.svg"
                  className="w-[2.1rem] h-auto"
                  alt=""
                />
              ) : (
                <img src="/icons/videoEnabled.svg" alt="" />
              )}
            </button>
            <button className="h-[3.75rem] bg-[#1A71FF] rounded-[4.5rem] w-[9rem]">
              <span className="text-[1rem] text-white" onClick={joinConference}>
                Join
              </span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <VideoCall client={client} stream={stream}></VideoCall>
        </>
      )}
    </div>
  );
};

export default Preview;
