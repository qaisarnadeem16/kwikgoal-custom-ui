import { EditTextItem } from '../widgets/ItemText';
import { EditImageItem } from '../widgets/ItemImage';
import { DialogWindow } from '../dialog/Dialogs';
import styled from 'styled-components/macro';
import { Icon } from '../Atomic';

export const GroupItem = styled.div`
display: flex;
flex-flow: column;
justify-content: center;
align-items: center;
height: 100px;
width: 100px;
margin-bottom: 20px;
text-align: center;
cursor: pointer;
padding: 0px 10px 0px 10px;

&:hover {
    background-color: white;
}

&.selected {
    background-color: white;
}

span {
    font-size: 12px;
}

@media (max-width: 1025px) {
    min-width: 90px;
    padding-right: 5px;
}

@media (max-width: 1024px) {
    min-width: 110px;
    margin-bottom: 0;
    margin-right: 10px;
}
@media (max-width: 42px) {
    min-width: 100px;
}
`;

export const GroupIcon = styled.img`
width: 100%;
height: 40px;
object-fit: contain;
margin-bottom: 10px;
`;


export const TemplatesContainer = styled.div`
	display: flex;
	flex-direction: row;
	grid-gap: 5px;
	align-items: flex-start;
	margin-bottom: 40px;
	overflow: hidden;
	min-height: 0;
`;

export const Template = styled.div<{ selected?: boolean }>`
	padding: 10px;
	cursor: pointer;

	&:hover {
		background-color: #f4f4f4;
	}

	${(props) =>
		props.selected &&
		`
       background-color: #f4f4f4;
    `}
`;


export const SelectContainer = styled.div`
	margin-bottom: 30px;
	padding-bottom: 30px;
	border-bottom: 1px #ccc dotted;
	position: relative;
	// width: 100%;
	span {
		margin-bottom: 10px;
		font-size: 16px;
		display: block;
	}
`;

export const Center = styled.div`
	text-align: center;
	font-size: 18px;
	padding: 30px;
`;

export const CustomQuotationConfirmMessage = styled(DialogWindow)`
	display: flex;
	align-items: center;
	justify-content: center;
`;


export const ZoomInIcon = styled(Icon) <{ isMobile?: boolean }>`
	position: absolute;
	left: 20px;
	width: 32px;
	height: 32px;
	z-index: 3;
	${(props) =>
		props.isMobile
			? `
		top: calc(20%);
		`
			: `top: calc(30%);`}
	@media (max-height: 550px) {
		top: calc(5%);
	}
`;

export const ZoomOutIcon = styled(Icon) <{ isMobile?: boolean }>`
	position: absolute;
	left: 20px;
	width: 32px;
	height: 32px;
	z-index: 3;
	${(props) =>
		props.isMobile
			? `
		top: calc(20% + 50px);
		`
			: `top: calc(30% + 50px);`};
	@media (max-height: 550px) {
		top: calc(5% + 40px);
	}
`;


export const SupportedFormatsList = styled.span`
	font-size: 16px;
	font-style: italic;
	text-align: center;
	color: #313c46;
	padding-top: 5px;
`;

export const ZakekeDesignerContainer = styled.div<{ isMobile?: boolean }>`
	height: 50vh;
	width: 97%;
	position: relative;
	display: flex;
	flex-direction: column;
	background: rgb(235, 237, 242);
	// #ffffff;
	
	${(props) =>
		props.isMobile &&
		`
		position:fixed;
        inset:0;
        z-index:13;
		height: 94%;
		width: 99%;
    `}
`;

export const IconsAndDesignerContainer = styled.div`
	position: absolute;
	left: 0;
	top: calc(50% - 30px);
	z-index: 2;
	display: flex;
	flex-direction: column;
	
`;

export const ItemName = styled.span`
	font-size: 12px;
	font-weight: 600;
`;


export const SelectorMobileContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	width: 100%;
	position: relative;
	// overflow: auto;
`;

export const StepsMobileContainer = styled.div`
	border-top: 1px #fff solid;
	height: 45px;
`;

export const MobileItemContainer = styled.div<{ selected?: boolean }>`
    color: #297ca3;
	align-items: center;
	justify-content: center;
	min-width: 140px;
	max-width: 140px;
	width: 140px;
	height: 140px;
	min-height: 140px;
	max-height: 140px;
	flex: 1;
	display: flex;
	flex-direction: column;
	border-right: 2px #fff solid;
	position: relative;
	${(props) => props.selected && `background-color: rgb(235 227 227);`}
`;

export const StepsContainer = styled.div`
	position: relative;
	padding: 0px 20px 20px 20px;

	@media (max-width: 1024px) {
		width: 100%;
		height: 50%;
		flex-direction: column;
		position: relative;
	}
`;

export const MenuItemImage = styled.img<{ isRound?: boolean }>`
	width: 47px;
	height: 47px;
	object-fit: ${(props) => (props.isRound ? 'cover' : 'contain')};
	margin-bottom: 20px;
	border-radius: ${(props) => (props.isRound ? '64px!important' : '0')};
	border: 1px solid rgb(239 233 233);
`;

export const MenuItemImagesWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	position: relative;
	top: -10px;
`;

export const MenuItemImagesImageWrapper = styled.div`
	width: 35px;
	height: 35px;
	&:nth-child(1) {
		border-right: 1px #ddd dotted;
		border-bottom: 1px #ddd dotted;
	}

	&:nth-child(2) {
		border-bottom: 1px #ddd dotted;
	}

	&:nth-child(3) {
		border-right: 1px #ddd dotted;
	}
`;

export const MenuItemLabel = styled.span`
	font-size: 13px;
	font-weight: 400;
	position: absolute;
	bottom: 2px;
	left: 0;
	right: 0;
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
	// white-space: nowrap;
`;

export const MenuItemImagesImage = styled.img<{ isRound?: boolean }>`
	width: 100%;
	height: 100%;
	object-fit: cover;
	padding: 3px;
	border: 1px solid rgb(239, 233, 233);
	border-radius: ${(props) => (props.isRound ? '64px!important' : '0')};
`;

export const MenuItemIcon = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40px;
	margin-bottom: 20px;
	width: 64px;
	height: 64px;
`;


export const ExtensionFieldsContainer = styled.div`
	margin: 0px auto;
	display: flex;
	flex-direction: row;
`;

export const ExtensionFieldItem = styled.div`
	border-right: 1px solid black;
	padding: 0px 5px;
	text-align: right;
`;

export const QuantityContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 70px;
	background-color: white;
	padding-left: 10px;
	color: #313c46;
	grid-gap: 10px;
	/* min-width: 150px; */
	/* input{
		min-width: 100px;
	} */
`;

export const FooterContainer = styled.div`
	background-color: transparent;
	display: flex;
	flex-direction: row;
	align-items: center;
	height: auto;
`;

export const FooterRightElementsContainer = styled.div`
	background: transparent;
	display: flex;
	justify-content: flex-end;
	background-color: transparent;
	flex-direction: row;
	grid-gap: 10px;
	align-items: center;
	font-size: 14px;
`;

export const PriceContainer = styled.div<{ isMobile?: boolean }>`
	font-size: 20px;
	font-weight: 600;
	color: #313c46;
	margin-right: 20px;
	${(props) =>
		props.isMobile &&
		`
    margin-right: 0px;
    color:rgb(41, 124, 163);`};
`;

export const FooterMobileContainer = styled.div<{ isQuoteEnable?: boolean }>`
	z-index: 0;
    height: 55px;
	display: grid;
	grid-template-columns: repeat(1fr), 1fr);
	background-color: #fff;
	font-size: 12px;
	margin-top: 4px;
	border-top: 1px #fff solid;
	grid-template-areas: 'back pdf save share cart'; 
	${(props) => props.isQuoteEnable && `
	grid-template-columns: repeat(6, 1fr);
	grid-template-areas: 'back pdf save share cart quote' 
	`};
`;

export const BottomRightIcons = styled.div`
	position: absolute;
	right: 10px;
	bottom: 40px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 3;
	gap: 20px;
	@media (max-height: 550px) {
		bottom: 20px;
	}
`;


export const CollapseIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const ExplodeIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const FullscreenIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const SecondScreenIcon = styled(Icon)`
	width: 32px;
	height: 32px;
`;

export const RecapPanelIcon = styled(Icon)`
	position: absolute;
	left: 20px;
	bottom: 40px;
	width: 32px;
	height: 32px;
	z-index: 3;
	@media (max-height: 550px) {
		bottom: 20px;
	}
`;

export const TopRightIcons = styled.div`
	position: absolute;
	right: 10px;
	top: 10px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	z-index: 3;
	gap: 20px;
`;

export const HeaderBar = styled.div`
	display: flex;
	align-items: center;
	height: 64px;
	min-height: 64px;
	width: 100%;
	padding: 0 24px;
	background-color: #ffffff;
	border-bottom: 1px solid #1a1a1a;
	box-sizing: border-box;
	z-index: 5;

	@media (max-width: 1024px) {
		height: 52px;
		min-height: 52px;
		padding: 0 16px;
	}
`;

export const HeaderTitle = styled.h1`
	margin: 0;
	font-family: 'Roboto', sans-serif;
	font-weight: 800;
	font-style: italic;
	font-size: 22px;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	color: #111111;

	@media (max-width: 1024px) {
		font-size: 16px;
	}
`;

export const ViewerControlsPanel = styled.div`
	position: absolute;
	left: 24px;
	// top: 32px;
	bottom:60px;
	display: flex;
	flex-direction: column;
	gap: 24px;
	z-index: 4;
	font-family: 'Roboto', sans-serif;

	@media (max-width: 1024px) {
		left: 12px;
		top: 16px;
		gap: 16px;
	}
`;

export const ViewerControlGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

export const ViewerControlLabel = styled.span<{ active?: boolean }>`
	font-size: 12px;
	font-weight: 500;
	font-family: 'Roboto', sans-serif;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	color: ${(props) => (props.active ? "#ffffff" : "#000000")};
	transition: color 0.2s ease;
`;

export const ZoomButtonStack = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

export const ZoomButton = styled.button<{ active?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	padding: 0;
	border: none;
	background: transparent;
	cursor: pointer;
	color: ${(props) => (props.active ? "#ffffff" : "#1a1a1a")};
	transition: color 0.2s ease;

	svg {
		width: 16px;
		height: 16px;
	}

	&:hover {
		color: #297ca3;
	}
`;

export const ToggleSwitchWrap = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 4px;
`;

export const ToggleSwitch = styled.button<{ isOn?: boolean }>`
	position: relative;
	width: 55px;
	height: 24px;
	border-radius: 14px;
	border: none;
	padding: 0;
	cursor: pointer;
	background-color: #D9D9D9;
	transition: background-color 0.2s ease;

	${(props) =>
		props.isOn &&
		`
    background-color: #D32F37;
  `
	}

	&::after {
		content: '';
		position: absolute;
		top: 3px;
		left: ${(props) => (props.isOn ? "31px" : "3px")};
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background-color:${(props) => (props.isOn ? "#ffffff" : "#636363")};
		transition: left 0.2s ease;
	}
`;

export const ToggleSwitchState = styled.span<{ active?: boolean }>`
	font-size: 11px;
	color: ${(props) => (props.active ? "#ffffff" : "#D9D9D9")};
	text-transform: uppercase;
	transition: color 0.2s ease;
`;

export const CustomizePanelsButton = styled.button`
	position: absolute;
	right: 24px;
	bottom: 24px;
	z-index: 4;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 12px 24px;
	background-color: #ffffff;
	border: 1px solid #1a1a1a;
	border-radius: 6px;
	font-family: 'Roboto', sans-serif;
	font-size: 14px;
	font-weight: 500;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	color: #1a1a1a;
	cursor: pointer;

	&:hover {
		background-color: #f2f2f2;
	}

	@media (max-width: 1024px) {
		right: 12px;
		bottom: 12px;
		padding: 10px 16px;
		font-size: 12px;
	}
`;

export const BottomBar = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	min-height: 72px;
	padding: 12px 24px;
	background-color: #ffffff;
	// border-top: 1px solid #1a1a1a;
	box-sizing: border-box;
	font-family: 'Roboto', sans-serif;
	z-index: 5;
	gap: 1s6px;
	flex-wrap: wrap;

	@media (max-width: 1024px) {
		padding: 10px 12px;
		min-height: 60px;
	}
`;

export const BottomBarMenu = styled.button`
	display: flex;
	align-items: center;
	gap: 8px;
	font-family: 'Roboto', sans-serif;
	font-size: 14px;
	font-weight: 600;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	color: #1a1a1a;
	white-space: nowrap;
	background: transparent;
	border: none;
	padding: 0;
	cursor: pointer;

	svg {
		width: 18px;
		height: 18px;
	}

	&:hover {
		color: #297ca3;
	}
`;

export const BottomBarStepNav = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 75px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);

	@media (max-width: 1024px) {
		position: static;
		left: auto;
		top: auto;
		transform: none;
		flex: 1;
	}
`;

export const BottomBarStepArrow = styled.button<{ muted?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	// width: 24px;
	// height: 20px;
	padding: 0;
	border: none;
	background: transparent;
	cursor: ${(props) => (props.muted ? "not-allowed" : "pointer")};
	pointer-events: ${(props) => (props.muted ? "none" : "auto")};
	color: ${(props) => (props.muted ? "#BCBEC0" : "#292521")};

	// svg {
	// 	width: 20px;
	// 	height: 16px;
	// }

	&:hover {
		color: ${(props) => (props.muted ? "#BCBEC0" : "#D32F37")};
	}
`;

export const BottomBarStepLabel = styled.span`
	font-family: 'Roboto', sans-serif;
	font-size: 24px;
	font-weight: 700;
	letter-spacing: 0.5px;
	text-transform: uppercase;
	color: #1a1a1a;
	text-align: center;
	white-space: nowrap;
`;

export const BottomBarActions = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const ViewerContainer = styled.div`
	position: relative;
	min-height: 0;
	font-family: 'Roboto', sans-serif;

	@media (max-width: 1024px) {
		height: 100%;
	}
`;

export const DownloadButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 60px;
	min-height: 42px;
	padding: 0;
	background-color: #4a4a4a;
	border: none;
	border-radius: 6px;
	color: #ffffff;
	cursor: pointer;

	svg {
		width: 18px;
		height: 18px;
	}

	&:hover {
		background-color: #1a1a1a;
	}
`;

export const MenuOverlay = styled.div`
	position: absolute;
	inset: 0;
	z-index: 100;
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	font-family: 'Roboto', sans-serif;
	overflow-y: auto;
`;

export const MenuOverlayHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 32px 48px 16px;

	@media (max-width: 1024px) {
		padding: 20px 20px 8px;
	}
`;

export const MenuOverlayTitle = styled.h2`
	margin: 0;
	font-family: 'Roboto', sans-serif;
	font-size: 24px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	color: #1a1a1a;
`;

export const MenuOverlayCloseButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	padding: 0;
	background: transparent;
	border: none;
	cursor: pointer;
	color: #1a1a1a;

	svg {
		width: 22px;
		height: 22px;
	}

	&:hover {
		color: #cf3339;
	}
`;

export const MenuOverlayBody = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 48px;
	padding: 8px 48px 48px;

	@media (max-width: 1024px) {
		padding: 8px 20px 24px;
		gap: 24px;
	}
`;

export const MenuSection = styled.div`
	flex: 1 1 300px;
	min-width: 260px;
`;

export const MenuSectionTitle = styled.h3`
	margin: 0 0 20px;
	padding-bottom: 8px;
	display: inline-block;
	font-family: 'Roboto', sans-serif;
	font-size: 16px;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	color: #1a1a1a;
	border-bottom: 2px solid #1a1a1a;
`;

export const MenuItemsGrid = styled.div`
	column-count: 2;
	column-gap: 40px;
`;

export const MenuItem = styled.div<{ active?: boolean }>`
	break-inside: avoid;
	padding: 12px 0;
	font-family: 'Roboto', sans-serif;
	font-size: 16px;
	text-transform: uppercase;
	letter-spacing: 0.3px;
	color: ${(props) => (props.active ? '#000000' : '#636363')};
	font-weight: ${(props) => (props.active ? 700 : 400)};
	cursor: pointer;

	&:hover {
		color: #cf3339;
	}
`;
