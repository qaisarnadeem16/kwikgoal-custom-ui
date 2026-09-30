import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components/macro';
import ProgressBar from './ProgressBar';
import { useZakeke } from 'zakeke-configurator-react';

const ProgressBarLoadingBackground = styled.div`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ProgressBarLoadingOverlay = () => {
  const { isSceneLoading } = useZakeke();
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    let currentProgress = 0;
    let step = 0.3;

    if (!isSceneLoading) setCompleted(100.0);
    else if (isSceneLoading) {
      const interval = setInterval(() => {
        currentProgress += step;
        setCompleted(Math.round((Math.atan(currentProgress / 2) / (Math.PI / 2)) * 100 * 100) / 100);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isSceneLoading]);

  return createPortal(
    <ProgressBarLoadingBackground>
      <ProgressBar bgColor={'#F46200'} completed={completed} />
    </ProgressBarLoadingBackground>,
    document.body
  );
};

export default ProgressBarLoadingOverlay;