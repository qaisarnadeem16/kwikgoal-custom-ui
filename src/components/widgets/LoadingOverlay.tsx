import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import { TailSpin } from 'react-loader-spinner';
import styled from 'styled-components/macro';

const LoadingBackground = styled.div`
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	position: fixed;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
`;

const LoadingContainer = styled.div`
	width: 68px;
	height: 68px;
	background-color: white;
	border-radius: 5px;
	padding: 10px;
`;

// Portaled straight to document.body so it reliably covers the full
// viewport even when rendered deep inside popups whose ancestors may set
// a transform/filter/z-index (which would otherwise contain a plain
// position:fixed element and clip or bury it).
const LoadingOverlay: FC<{}> = () => {
	return createPortal(
		<LoadingBackground>
			<LoadingContainer>
				<TailSpin color='#000000' height={48} width={48} />
			</LoadingContainer>
		</LoadingBackground>,
		document.body
	);
};

export default LoadingOverlay;
