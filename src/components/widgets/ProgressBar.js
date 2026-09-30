import { useZakeke } from "zakeke-configurator-react";
import { T } from "../../Helpers";
import React, { FC, useEffect, useRef } from "react";
import styled from "styled-components/macro";
// import { ReactComponent as CheckSolid } from '../../assets/icons/check-circle-solid_1.svg';
// import { Icon } from 'components/Atomic';

const LoadingLabel = styled.div`
  color: #000;
  font-size: 12px;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
`;

const LoaderContainer = styled.div`
  height: 10px;
  width: 100%;
  margin: 10px 0 auto;
  border-radius: 4px;
  background-color: #dbe2e6;
  box-sizing: border-box;
`;

const LoadingPercentageLabel = styled.span`
  color: #8fa4ae;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  font-style: normal;
  font-family: "Roboto";
`;

const LoadingPercentageandIconContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

// const CheckIcon = styled(Icon)`
//   cursor: unset;
//   color: #008556;
// `;

const LoaderFill = styled.div`
  height: 100%;
  border-radius: 4px;
  margin: 0;
  width: ${({ completed }) => completed && `${completed}%`};
  background-color: #008556;
  border-radius: "inherit";
`;

const VideoPlayer = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
`;

const LoadingUIOverlay = styled.div`
  position: fixed;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  z-index: 1;
  width: 77vw;
  max-width: 600px;
  padding: 16px 30px;
  box-sizing: border-box;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.15);

  @media screen and (max-width: 766px) {
    width: 90vw;
    bottom: 24px;
  }
`;


const ProgressBar = ({ bgColor, completed }) => {
  const { isSceneLoading, translations } = useZakeke();
  const dynamicVals = translations?.dynamics;

  const videoRef = useRef(null);


  useEffect(() => {
    const video = videoRef.current;
    video.muted = true; // Mute the video to allow autoplay
    video.play();

    const handleVideoEnd = () => {
      console.log("Video has played completely at least once.");
      video.play()
    };

    const handleMetadataLoaded = () => {
      console.log(`Video duration: ${video.duration} seconds`);
    };

    video.addEventListener('ended', handleVideoEnd);

    // Unmute the video after it starts playing (optional)
    video.addEventListener('playing', () => {
      video.muted = true;
    });

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('loadedmetadata', handleMetadataLoaded);
    };
  }, []);



  return (
    <div>
      <VideoPlayer ref={videoRef} id="myVideo" loop  auto>
        <source src="kwikgoal-new-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </VideoPlayer>

      <LoadingUIOverlay>
        <LoadingLabel>
          {/* {console.log(T.d('Loading..'),'esfdfsfdssfds');} */}
          {dynamicVals?.get("Loading...")}

          {/* {isSceneLoading ? T._('Loading your product...', 'Composer') : T._('Loading complete.', 'Composer')} */}
        </LoadingLabel>
        <LoaderContainer>
          <LoaderFill
            completed={isSceneLoading ? completed : 100}
            bgColor={bgColor}
            isCompleted={!isSceneLoading}
          />
        </LoaderContainer>
        <LoadingPercentageandIconContainer>
          <LoadingPercentageLabel>
            {isSceneLoading ? `${completed}%` : "100%"}
            {/* {isSceneLoading ? T._('In progress | ', 'Composer') + `${completed}%` : '100%'} */}
          </LoadingPercentageLabel>
          {/* // {!isSceneLoading && (
            // <CheckIcon>
            //   <CheckSolid />
            // </CheckIcon>
          )} */}
        </LoadingPercentageandIconContainer>
      </LoadingUIOverlay>
    </div>
  );
};

export default ProgressBar;
