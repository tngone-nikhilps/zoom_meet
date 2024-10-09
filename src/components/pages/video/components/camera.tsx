import { useContext, useState } from "react";
import { Button, Tooltip, Menu, Dropdown } from "antd";
import {
  CheckOutlined,
  UpOutlined,
  VideoCameraAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import ZoomMediaContext from "../../../../context/media-context";
import classNames from "classnames";
import { MediaDevice } from "../video-types";
import { getAntdItem, getDropdownMenu, MenuItem } from "./video-footer-utils";
interface CameraButtonProps {
  isStartedVideo: boolean;
  isMirrored?: boolean;
  isBlur?: boolean;
  isPreview?: boolean;
  onCameraClick: () => void;
  onSwitchCamera: (deviceId: string) => void;
  onMirrorVideo?: () => void;
  onVideoStatistic?: () => void;
  onBlurBackground?: () => void;
  onSelectVideoPlayback?: (url: string) => void;
  className?: string;
  cameraList?: MediaDevice[];
  activeCamera?: string;
  activePlaybackUrl?: string;
}
const videoPlaybacks = [
  {
    title: "ZOOM ZWA",
    url: "https://source.zoom.us/brand/mp4/Using%20the%20Zoom%20PWA.mp4",
  },
  {
    title: "ZOOM Cares",
    url: "https://source.zoom.us/brand/mp4/Zoom%20Cares%20Nonprofit%20Impact.mp4",
  },
  {
    title: "ZOOM One",
    url: "https://source.zoom.us/brand/mp4/Zoom%20One%20-%20Team%20Chat%2C%20Phone%2C%20Email%2C%20and%20more.mp4",
  },
];
const CameraButton = (props: CameraButtonProps) => {
  const {
    isStartedVideo,
    className,
    cameraList,
    activeCamera,
    isMirrored,
    isBlur,
    isPreview,
    activePlaybackUrl,
    onCameraClick,
    onSwitchCamera,
    onMirrorVideo,
    onVideoStatistic,
    onBlurBackground,
    onSelectVideoPlayback,
  } = props;
  const context = useContext(ZoomMediaContext);
  const [cameraOptionsOpen, setIsCameraOptionsOpen] = useState(false);
  // Check if context exists before destructuring
  const mediaStream = context?.mediaStream;
  const onMenuItemClick = (payload: { key: any }) => {
    if (payload.key === "mirror") {
      onMirrorVideo?.();
    } else if (payload.key === "statistic") {
      onVideoStatistic?.();
    } else if (payload.key === "blur") {
      onBlurBackground?.();
    } else if (/^https:\/\//.test(payload.key)) {
      onSelectVideoPlayback?.(payload.key);
    } else {
      onSwitchCamera(payload.key);
    }
  };
  const menuItems =
    cameraList &&
    cameraList.length > 0 &&
    ([
      getAntdItem(
        "Select a Camera",
        "camera",
        undefined,
        cameraList.map((item) =>
          getAntdItem(
            item.label,
            item.deviceId,
            item.deviceId === activeCamera && <CheckOutlined />
          )
        ),
        "group"
      ),
      !isPreview &&
        getAntdItem(
          "Select a Video Playback",
          "playback",
          undefined,
          videoPlaybacks.map((item) =>
            getAntdItem(
              item.title,
              item.url,
              item.url === activePlaybackUrl && <CheckOutlined />
            )
          ),
          "group"
        ),
      getAntdItem("", "d1", undefined, undefined, "divider"),
      !isPreview &&
        getAntdItem(
          "Mirror My Video",
          "mirror",
          isMirrored && <CheckOutlined />
        ),
      //   mediaStream?.isSupportVirtualBackground()
      //     ? getAntdItem("Blur My Background", "blur", isBlur && <CheckOutlined />)
      //     : getAntdItem("Mask My Background", "blur"),
      //   !isPreview && getAntdItem("", "d2", undefined, undefined, "divider"),
      //   !isPreview && getAntdItem("Video Statistic", "statistic"),
    ].filter(Boolean) as MenuItem[]);
  return (
    <div className={classNames("camera-footer", className)}>
      {isStartedVideo && menuItems ? (
        <>
          <div className="relative flex items-center">
            <button
              className="vc-dropdown-button"
              onClick={() => {
                onCameraClick();
              }}
            >
              <button
                className="vc-button flex justify-center relative items-center h-[3.75rem] w-[3.75rem] bg-[#00B152] rounded-full"
                onClick={onCameraClick}
              >
                <img src={"./icons/video.svg"} className="w-[1.4rem] h-auto" />
              </button>
            </button>
            <UpOutlined
              className="ml-2 -mr-1"
              onClick={() => {
                setIsCameraOptionsOpen(!cameraOptionsOpen);
              }}
            />
            {cameraOptionsOpen && (
              <div className="absolute   bg-[white]  bottom-[100%]  right-0  z-[110]  mt-2 w-[500px] rounded-md shadow-lg border-primary border-[1px] ring-3 ring-primary ring-opacity-5">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                ></div>
                {getDropdownMenu(menuItems, onMenuItemClick).items?.map(
                  (speaker: any) => (
                    <div
                      key={speaker?.key}
                      // onClick={() => handleItemClick(`speaker|${speaker.deviceId}`)}
                      className={`block w-full text-left px-4 py-2 text-sm
                           "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      `}
                      role="menuitem"
                    >
                      {speaker?.label}
                      {speaker.children &&
                        speaker.children.map((items: any) => (
                          <>
                            <button
                              id={items.key}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                activeCamera == items?.key.split("|")[1]
                                  ? "bg-gray-100 text-primary"
                                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              }`}
                              onClick={() => {
                                onMenuItemClick({ key: items.key }),
                                  setIsCameraOptionsOpen(false);
                              }}
                            >
                              {items.label}
                            </button>
                          </>
                        ))}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <button
          className="vc-button flex justify-center relative items-center h-[3.75rem] w-[3.75rem] bg-[#FF4949] rounded-full"
          onClick={onCameraClick}
        >
          {isStartedVideo ? (
            <img
              src={"./icons/videoLocked.svg"}
              className="w-[1.4rem] h-auto"
            />
          ) : (
            <img
              src={"./icons/videoLocked.svg"}
              className="w-[1.4rem] h-auto"
            />
          )}
        </button>
      )}
    </div>
  );
};
export default CameraButton;
