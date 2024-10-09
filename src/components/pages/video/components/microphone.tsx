/* eslint-disable no-nested-ternary */
import { useState, useEffect, useMemo } from "react";
import { Tooltip } from "antd";
import classNames from "classnames";
import { CheckOutlined, UpOutlined } from "@ant-design/icons";
import { IconFont } from "../../../conferenceComponent/icon-font";
import { MediaDevice } from "../video-types";
// import CallOutModal from "./call-out-modal";
import { getAntdItem, getDropdownMenu } from "./video-footer-utils";
// import { useCurrentAudioLevel } from '../hooks/useCurrentAudioLevel';
// import CRCCallOutModal from "./crc-call-out-modal";
import { AudoiAnimationIcon } from "../../../conferenceComponent/audio-animation-icon";
import { useAudioLevel } from "../hooks/useAudioLevel";
import DropdownButton from "../../../elements/microphoneSelect";

interface MicrophoneButtonProps {
  isStartedAudio: boolean;
  isMuted: boolean;
  isSupportPhone?: boolean;
  isMicrophoneForbidden?: boolean;
  disabled?: boolean;
  audio?: string;
  phoneCountryList?: any[];
  onMicrophoneClick: () => void;
  onMicrophoneMenuClick: (key: string) => void;
  onPhoneCallClick?: (
    code: string,
    phoneNumber: string,
    name: string,
    option: any
  ) => void;
  onPhoneCallCancel?: (
    code: string,
    phoneNumber: string,
    option: any
  ) => Promise<any>;
  className?: string;
  microphoneList?: MediaDevice[];
  speakerList?: MediaDevice[];
  activeMicrophone?: string;
  activeSpeaker?: string;
  phoneCallStatus?: { text: string; type: string };
  isSecondaryAudioStarted?: boolean;
}
const MicrophoneButton = (props: MicrophoneButtonProps) => {
  const {
    isStartedAudio,
    isSupportPhone,
    isMuted,
    audio,
    className,
    microphoneList,
    speakerList,
    phoneCountryList,
    activeMicrophone,
    activeSpeaker,
    phoneCallStatus,
    disabled,
    isMicrophoneForbidden,
    isSecondaryAudioStarted,
    onMicrophoneClick,
    onMicrophoneMenuClick,
    onPhoneCallClick,
    onPhoneCallCancel,
  } = props;
  // const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(true);
  // const [isCrcModalOpen, setIsCrcModalOpen] = useState(false);
  const [microphoneOptionsOpen, setIsMicrophoneOptionsOpen] = useState(false);
  // const level = useCurrentAudioLevel();
  const level = useAudioLevel();
  const tooltipText = isStartedAudio
    ? isMuted
      ? "unmute"
      : "mute"
    : "start audio";
  const menuItems = [];
  if (microphoneList?.length && audio !== "phone") {
    menuItems.push(
      getAntdItem(
        "Select a Microphone",
        "microphone",
        undefined,
        microphoneList.map((i) =>
          getAntdItem(
            i.label,
            `microphone|${i.deviceId}`,
            activeMicrophone === i.deviceId && <CheckOutlined />
          )
        ),
        "group"
      )
    );
    menuItems.push(getAntdItem("", "d1", undefined, undefined, "divider"));
  }

  // if (speakerList?.length && audio !== "phone") {
  //   menuItems.push(
  //     getAntdItem(
  //       "Select a speaker",
  //       "speaker",
  //       undefined,
  //       speakerList.map((i) =>
  //         getAntdItem(
  //           i.label,
  //           `speaker|${i.deviceId}`,
  //           activeSpeaker === i.deviceId && <CheckOutlined />
  //         )
  //       ),
  //       "group"
  //     )
  //   );
  //   menuItems.push(getAntdItem("", "d2", undefined, undefined, "divider"));
  // }

  // menuItems.push(
  //   getAntdItem(
  //     isSecondaryAudioStarted
  //       ? "Stop secondary audio"
  //       : "Start secondary audio",
  //     "secondary audio"
  //   )
  // );
  // menuItems.push(getAntdItem("", "d3", undefined, undefined, "divider"));
  // if (audio !== "phone") {
  //   menuItems.push(getAntdItem("Audio Statistic", "statistic"));
  // }
  // menuItems.push(
  //   getAntdItem(audio === "phone" ? "Hang Up" : "Leave Audio", "leave audio")
  // );

  const onMenuItemClick = (payload: { key: any }) => {
    onMicrophoneMenuClick(payload.key);
  };
  // const onPhoneMenuClick = (payload: { key: any }) => {
  //   if (payload.key === "phone") {
  //     setIsPhoneModalOpen(true);
  //   } else if (payload.key === "crc") {
  //     setIsCrcModalOpen(true);
  //   }
  // };

  const audioIcon = useMemo(() => {
    let iconType = "";
    if (isStartedAudio) {
      if (isMuted) {
        if (audio === "phone") {
          iconType = "icon-phone-off";
        } else {
          iconType = "icon-audio-muted";
        }
      } else {
        if (audio === "phone") {
          iconType = "icon-phone";
        } else {
          if (level !== 0) {
            // iconType = 'icon-audio-animation';
            return <AudoiAnimationIcon level={level} />;
          } else {
            iconType = "icon-audio-unmuted";
          }
        }
      }
    } else {
      if (isMicrophoneForbidden) {
        iconType = "icon-audio-disallow";
      } else {
        iconType = "icon-headset";
      }
    }
    if (iconType) {
      return (
        <div className="flex justify-center items-center h-[3.75rem] w-[3.75rem] bg-[#00B152] rounded-full">
          <IconFont
            type={iconType}
            style={{ width: "1.4rem", height: "auto" }}
          />
        </div>
      );
    }
  }, [level, audio, isMuted, isMicrophoneForbidden, isStartedAudio]);
  // useEffect(() => {
  //   if (isStartedAudio) {
  //     setIsPhoneModalOpen(false);
  //   }
  // }, [isStartedAudio]);
  return (
    <div className={classNames("microphone-footer", className)}>
      {isStartedAudio ? (
        <>
          <div className="relative flex items-center">
            {" "}
            <button
              className="vc-dropdown-button"
              onClick={() => {
                onMicrophoneClick();
              }}
              disabled={disabled}
            >
              {audioIcon}
            </button>
            <UpOutlined
              className="ml-2 -mr-1"
              onClick={() => {
                setIsMicrophoneOptionsOpen(!microphoneOptionsOpen);
              }}
            />
            {microphoneOptionsOpen && (
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
                                activeMicrophone == items?.key.split("|")[1]
                                  ? "bg-gray-100 text-primary"
                                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              }`}
                              onClick={() => {
                                onMenuItemClick({ key: items.key }),
                                  setIsMicrophoneOptionsOpen(false);
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
        <div>
          {isSupportPhone ? (
            <DropdownButton
              className="vc-dropdown-button"
              size="large"
              menu={getDropdownMenu(menuItems, onMenuItemClick)}
              onClick={onMicrophoneClick}
              trigger={["click"]}
              type="ghost"
              icon={<UpOutlined />}
              placement="topRight"
              disabled={disabled}
            >
              {audioIcon}
            </DropdownButton>
          ) : (
            <button
              className="vc-button flex justify-center items-center h-[3.75rem] w-[3.75rem] bg-[#FF4949] rounded-full"
              onClick={onMicrophoneClick}
            >
              <img
                src={"./icons/microPhone.svg"}
                className="w-[1.4rem] h-auto"
              />
            </button>
          )}
        </div>
      )}
      {/* <CallOutModal
        visible={isPhoneModalOpen}
        setVisible={(visible: boolean) => setIsPhoneModalOpen(visible)}
        phoneCallStatus={phoneCallStatus}
        phoneCountryList={phoneCountryList}
        onPhoneCallCancel={onPhoneCallCancel}
        onPhoneCallClick={onPhoneCallClick}
      />
      <CRCCallOutModal
        visible={isCrcModalOpen}
        setVisible={(visible: boolean) => setIsCrcModalOpen(visible)}
      /> */}
    </div>
  );
};

export default MicrophoneButton;
