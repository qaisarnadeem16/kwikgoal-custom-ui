import "./selector.css";
import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { ReactComponent as SearchPlusSolid } from "../assets/icons/search-plus-solid.svg";
import { ReactComponent as SearchMinusSolid } from "../assets/icons/search-minus-solid.svg";
import { useZakeke } from "zakeke-configurator-react";
import {
  List,
  ListItem,
  ListItemColor,
  ListItemImage,
  ListItemImageNoCarousel,
  ListItemColorBig,
  ListItemImageBig,
  PillOption,
  PillOptionWrapper,
  PillOptionCaption,
  ColorFamilySection,
  ColorFamilyHeading,
  ColorSwatchRow,
  ColorSwatch,
  ColorSwatchItem,
  ColorSwatchLabel,
  ColorFamilyFooter,
  RalColorsLink,
  IconCardItem,
  IconCard,
  IconCardImage,
  IconCardLabel,
  ColorChipItem,
  ColorChip,
  ColorChipInner,
  ColorChipLabel
} from "./list";
import { PreviewContainer, BlurOverlay } from "./previewContainer";
import TrayPreviewOpenButton from "./TrayPreviewOpenButton";
import MenuTriggerButton from "./MenuTriggerButton";
import ProgressBarLoadingOverlay from "./widgets/ProgressBarLoadingOverlay";
import Designer from "./layouts/Designer";
import {
  GroupItem,
  GroupIcon,
  ViewerControlsPanel,
  ViewerControlGroup,
  ViewerControlLabel,
  ZoomButtonStack,
  ZoomButton,
  ToggleSwitchWrap,
  ToggleSwitch,
  ToggleSwitchState,
  CustomizePanelsButton,
  BottomBar,
  BottomBarMenu,
  BottomBarStepNav,
  BottomBarStepArrow,
  BottomBarStepLabel,
  BottomBarActions,
  MenuOverlay,
  MenuOverlayHeader,
  MenuOverlayTitle,
  MenuOverlayCloseButton,
  MenuOverlayBody,
  MenuSection,
  MenuSectionTitle,
  MenuItemsGrid,
  MenuItem,
} from "./layouts/LayoutStyled";
import { createPortal } from "react-dom";
import useStore from "../Store";
import { T } from "../Helpers";
import Footer from "./layouts/Footer";
import FooterMobile from "./layouts/FooterMobile";
import Pagination from "swiper";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import { Tooltip } from 'react-tooltip'

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import 'swiper/swiper-bundle.css';
import Loader from "./Loader";

const dialogsPortal = document.getElementById("dialogs-portal")!;
// const Container = styled.div`
// overflow: auto;
// width: 100%;
// ${!selectedTrayPreviewOpenButton
//     ? css`
//         height: 230px;
//       `
//     : css`
//         height: 70px;
//       `}
// `;

const validCodes: any = ['Seats', 'Shelter', 'Logo', 'Wheels', "Without Wheel Seats 9ft", "With Wheel Seats 9ft",
  "Without Wheel Seats 12ft", "With Wheel Seats 12ft",
  "Without Wheel Seats 15ft", "With Wheel Seats 15ft",
  "Without Wheel Seats 18ft", "With Wheel Seats 18ft",
  "Without Wheel Seats 21ft", "With Wheel Seats 21ft",
  "Without Wheel Seats 24ft", "With Wheel Seats 24ft",
  "Without Wheel Seats 30ft", "With Wheel Seats 30ft",

];

const FRAME_COLOR_HEX: { [name: string]: string } = {
  Green: "#5C8B3A",
  Blue: "#1E3FCB",
  Yellow: "#EAC54F",
  Orange: "#C97B45",
  White: "#FFFFFF",
  Red: "#B23A32",
  Black: "#1A1A1A",
  Purple: "#5C3A54",
  Brown: "#7A5230",
  Gray: "#8B8F94",
  Grey: "#8B8F94",
};

interface TrayPreviewOpenButton3DProps {
  trayPreviewOpenButton3DFunc: (data: any) => void;
  viewerOverlayEl?: HTMLDivElement | null;
}

const Selector: FunctionComponent<TrayPreviewOpenButton3DProps> = ({
  trayPreviewOpenButton3DFunc,
  viewerOverlayEl,
}) => {
  const {
    isSceneLoading,
    isAssetsLoading,
    loadComposition,
    isAddToCartLoading,
    price,
    groups,
    selectOption,
    addToCart,
    templates,
    setTemplate,
    setCamera,
    productName,
    zoomIn,
    zoomOut,
    items,
    product,
    isAreaVisible,
    backgroundColor,
    setBackgroundColor,
    getMeshIDbyName,
    hideMeshAndSaveState,
    restoreMeshVisibility,
  } = useZakeke();


  const { setIsLoading, isMobile } = useStore();

  // Keep saved the ID and not the refereces, they will change on each update
  const [selectedGroupId, selectGroup] = useState<number | null>(null);
  const [selectedStepId, selectStep] = useState<number | null>(null);
  const [selectedAttributeId, selectAttribute] = useState<number | null>(null);
  const [selectedOptionId, selectOptionId] = useState<number | null>(null);
  const [selectedOptionName, selectOptionName] = useState<string | null>(null);

  const [selectedColorName, selectColorName] = useState<any | null>(null);
  const [hasTypeZero, setHasTypeZero] = useState<boolean | null>(null);
  const [stitchTypeGroup, setStitchTypeGroup] = useState<any | null>(null);

  // Get a list of all group names so we can populate on the tray
  const [selectedGroupList, selectGroupList] = useState<any | null>(null);

  // Open tray for menu
  const [isTrayOpen, setIsTrayOpen] = useState<any | null>(false);
  // console.log("grups", groups)
  // Get the id of the selected group from the tray
  const [selectedGroupIdFromTray, selectGroupIdFromTray] = useState<
    number | null
  >(null);

  // Update tray preview open button
  const [selectedTrayPreviewOpenButton, selectTrayPreviewOpenButton] =
    useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [width, setWidth] = useState(window.innerWidth);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId);
  const selectedStep = selectedGroup
    ? selectedGroup.steps.find((step) => step.id === selectedStepId)
    : null;

  const [selectedPersonalize, setSelectedPersonalize] = useState<any | null>(
    false
  );

  const [isNextDisabled, setIsNextDisabled] = useState<any | null>(false)

  const [selectedFilteredAreas, setSelectedFilteredAreas] = useState<number>(0);

  const [isBackgroundOn, setIsBackgroundOn] = useState<boolean>(false);
  const originalBackgroundColorRef = useRef<string | null>(null);

  // The flat backdrop color (setBackgroundColor) only paints the sky/skybox area.
  // The ground/grass is a separate mesh in the scene, so we also have to find and
  // hide it. We don't know its exact name in this GLB, so we try common ones.
  const GROUND_MESH_NAME_CANDIDATES = [
    "Ground", "ground", "Ground_Plane", "GroundPlane", "Ground Plane",
    "Floor", "floor", "Floor_Plane", "FloorPlane",
    "Grass", "grass", "Grass_Plane", "GrassPlane",
    "Terrain", "terrain",
    "Environment", "environment",
  ];
  const groundMeshIdsRef = useRef<string[] | null>(null);

  const getGroundMeshIds = () => {
    if (groundMeshIdsRef.current) return groundMeshIdsRef.current;

    const foundIds: string[] = [];
    GROUND_MESH_NAME_CANDIDATES.forEach((name) => {
      const meshId = getMeshIDbyName(name);
      if (meshId && !foundIds.includes(meshId)) foundIds.push(meshId);
    });

    if (foundIds.length === 0) {
      console.warn(
        "[Background toggle] Could not find a ground/grass mesh by any of the known candidate names. " +
        "Check the model's actual mesh name in the scene and add it to GROUND_MESH_NAME_CANDIDATES."
      );
    } else {
      console.log("[Background toggle] Ground mesh id(s) found:", foundIds);
    }

    groundMeshIdsRef.current = foundIds;
    return foundIds;
  };

  const toggleBackground = () => {
    const nextIsBackgroundOn = !isBackgroundOn;
    const groundMeshIds = getGroundMeshIds();

    if (nextIsBackgroundOn) {
      // Remember the model's current background so it can be restored later
      if (originalBackgroundColorRef.current === null) {
        originalBackgroundColorRef.current = backgroundColor;
      }
      setBackgroundColor("#F2F2F2", 1);
      groundMeshIds.forEach((meshId) => hideMeshAndSaveState(meshId));
    } else {
      setBackgroundColor(originalBackgroundColorRef.current ?? backgroundColor, 0);
      groundMeshIds.forEach((meshId) => restoreMeshVisibility(meshId));
    }

    setIsBackgroundOn(nextIsBackgroundOn);
  };


  const updateSelectedFilter = (id: number) => {
    setSelectedFilteredAreas(id)
  }

  const handleShelterMenuClick = (name: string) => {
    groupIdFromFunc(name);
    toggleTray();
  };

  // Attributes can be in both groups and steps, so show the attributes of step or in a group based on selection
  const attributes = useMemo(
    () => (selectedStep || selectedGroup)?.attributes ?? [],
    [selectedGroup, selectedStep]
  );

  const selectedAttribute = attributes.find(
    (attribute) => attribute.id === selectedAttributeId
  );

  let indexToRemove = groups.findIndex((obj) => obj.id === -1);
  if (indexToRemove !== -1) {
    groups.splice(indexToRemove, 1);
  }

  const hasEnabled = groups[4]?.attributes.some(attribute => attribute.enabled);

  if (!hasEnabled) {
    groups.splice(4, 1);
  }

  useEffect(() => {
    const itemAvailable = items?.filter((item) => item.type === 0).length > 0;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }
  }, [hasTypeZero, groups, items]);

  const dialogsPortal = document.getElementById("dialogs-portal");

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    //window.addEventListener('resize', handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [items]);

  // Open the first group and the first step when loaded
  useEffect(() => {

    if (items?.some((obj) => obj.type === 0)) {
      setHasTypeZero(items?.some((obj) => obj.type === 0));
    } else {
      setHasTypeZero(false);
    }

    if (!selectedGroup && groups.length > 0) {
      selectGroup(groups[0].id);

      if (groups[0].steps.length > 0) selectStep(groups[0].steps[0].id);

      if (templates.length > 0) setTemplate(templates[0].id);
    }

    if (groups.length > 0) {
      var groupRec: string[] = [];
      groups.map((group) => {
        groupRec.push(group.name);
      });
      selectGroupList(groupRec);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup, groups]);

  // useEffect(() => {
  // 	const textItems = items.filter((item) => item.type === 0) // as TextItem[];
  // 	//const newItems = textItems.filter((item) => !prevItems.some((prevItem) => prevItem.guid === item.guid));
  // 	// newItems.forEach((item) => {
  // 	// 	if (item.isTemplateElement) setItemText(item.guid, T._d(item.text));
  // 	// });
  // 	// setPrevItems(textItems);

  //   textItems.map((item) => {
  //     setItemText(item.guid,'first tezzt')
  //   })

  // 	// eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [items]);

  // Select attribute first time
  useEffect(() => {
    if (!selectedAttribute && attributes.length > 0)
      selectAttribute(attributes[0].id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAttribute, attributes]);

  useEffect(() => {
    if (selectedGroup) {
      const camera = selectedGroup.cameraLocationId;
      if (camera) setCamera(camera);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroupId]);

  if (isSceneLoading || !groups || groups.length === 0)
    return (
      <PreviewContainer>
        <BlurOverlay>
          {/* <span>Loading scene...</span>; */}
          <ProgressBarLoadingOverlay />
        </BlurOverlay>
      </PreviewContainer>
    );

  if (isAssetsLoading || !groups || groups.length === 0) return <Loader />;

  const visibleAreas = product?.areas.filter((area) => isAreaVisible(area.id)) ?? [];

  console.group("DEBUG: groups/attributes/options");
  groups.forEach((group) => {
    console.log(`GROUP name="${group.name}" id=${group.id}`);
    group.attributes.forEach((attr) => {
      console.log(
        `  ATTRIBUTE name="${attr.name}" code="${attr.code}" enabled=${attr.enabled}`
      );
      attr.options.forEach((opt) => {
        console.log(
          `    OPTION name="${opt.name}" selected=${opt.selected} enabled=${opt.enabled} imageUrl=${JSON.stringify(opt.imageUrl)}`
        );
      });
    });
  });
  console.groupEnd();

  const handlePanelMenuClick = (name: string) => {
    const area = visibleAreas.find((a) => a.name === name);
    if (area) {
      setSelectedPersonalize(true);
      updateSelectedFilter(area.id);
    }
    toggleTray();
  };

  // console.log(groups[1], groups);

  // groups
  // -- attributes
  // -- -- options
  // -- steps
  // -- -- attributes
  // -- -- -- options

  const handleLeftClick = () => {
    if (currentIndex === 0) return;

    selectColorName("");
    setCurrentIndex(currentIndex - 1);
    selectGroup(groups[currentIndex - 1].id);

    if (items.filter((item) => item.type === 0).length === 0) {
      if (groups[groups.length - 1].name === "MODALITATE IMPRIMARE")
        if (items?.filter((item) => item.type === 0)) {
          groups.splice(groups.length - 1, 1);
        }
    }
  };

  const handleRightClick = () => {
    if (currentIndex === groups.length - 1) return;

    selectColorName("");
    setCurrentIndex(currentIndex + 1);
    selectGroup(groups[currentIndex + 1].id);

    if (items.filter((item) => item.type === 0).length === 0) {
      if (groups[groups.length - 1].name === "MODALITATE IMPRIMARE")
        if (items?.filter((item) => item.type === 0)) {
          groups.splice(groups.length - 1, 1);
        }
    }
  };

  const toggleTray = () => {
    if (selectedTrayPreviewOpenButton) {
      selectTrayPreviewOpenButton(!selectedTrayPreviewOpenButton);
    }
    // trayPreviewOpenButton();
    setIsTrayOpen(!isTrayOpen);
  };

  const trayPreviewOpenButton = () => {
    selectTrayPreviewOpenButton(!selectedTrayPreviewOpenButton);

    //trayPreviewOpenButton3DFunc(selectedTrayPreviewOpenButton);
    trayPreviewOpenButton3DFunc(selectedTrayPreviewOpenButton);
  };

  const groupIdFromFunc = (data: any) => {
    //console.log('ayyy',groups,data);
    const filteredArray = groups.filter((group) => group.name === data);
    // const filteredArrayId = groups.filter((group) => group.name === data);

    //  console.log(filteredArrayId, 'sddfasfdafdsf');

    const filteredArrayId = groups.filter((i: any, index: number) => {
      // Perform the desired comparison
      return i.name === data;
    });

    if (filteredArrayId.length > 0) {
      const foundItem = filteredArrayId[0];
      const foundItemIndex = groups.indexOf(foundItem);
      setCurrentIndex(foundItemIndex);
    }

    selectGroup(filteredArray[0].id);
    selectGroupIdFromTray(filteredArray[0].id);
  };

  const togglePersonalize = () => {
    setSelectedPersonalize(!selectedPersonalize);
  };

  const containerStyles = {
    overflow: "auto",
    width: "100%",
    height: !selectedTrayPreviewOpenButton ? "420px" : "70px",
  };
  const getShelterPanelCount = (sizeName: string): number | null => {
    const match = sizeName.match(/(\d+)/);
    if (!match) return null;
    const size = parseInt(match[1], 10);
    return 3 + (size - 9) / 3;
  };

  const getTooltipDetail = (name: string) => {
    switch (name) {
      case "Shelter":
        return "Select various sizes for Shelter.";
      case "Shelter Colors":
        return "Choose colors available for Shelter.";
      case "Wheels":
        return "Select from different types of wheels.";
      case "Seats":
        return "Choose seats available in various styles.";
      case "Shelter Logo":
        return "Add custom logos to your Shelter.";
      default:
        return "Explore options available for this category.";
    }
  };
  console.log('selectedFilteredAreas', selectedFilteredAreas)
  // console.log('selectOptionName', selectedOptionName)
  const viewerOverlayContent = (
    <>
      {!isMobile && !isTrayOpen ? (
        <ViewerControlsPanel>
          <ViewerControlGroup>
            <ViewerControlLabel active={isBackgroundOn}>View</ViewerControlLabel>
            <ZoomButtonStack>
              <ZoomButton active={isBackgroundOn} onClick={zoomIn} aria-label="Zoom in">
                {/* <SearchPlusSolid /> */}
                <svg width="28" height="28" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2_16)">
                    <path d="M1.01461 26.0001H1.52394C1.89179 25.9112 2.12624 25.6847 2.41325 25.4017L12.4462 15.3656C15.0292 17.2297 18.356 17.5612 21.2786 16.1298C23.8333 14.8804 25.713 12.2682 25.9555 9.27197L26 9.0334L25.9798 7.98612C25.6524 3.1743 21.5414 -0.37593 16.7229 0.0324683C13.7317 0.283168 11.1163 2.15937 9.86318 4.71894C8.43221 7.64242 8.76368 10.9743 10.6312 13.5541L0.347637 23.8449C-0.0121269 24.2048 -0.0768051 24.7304 0.0970135 25.1914C0.242537 25.5715 0.594215 25.8667 1.01866 26.0001H1.01461ZM11.5367 8.50774C11.5367 5.22034 14.2006 2.55564 17.4869 2.55564C20.7733 2.55564 23.4372 5.22034 23.4372 8.50774C23.4372 11.7951 20.7733 14.4598 17.4869 14.4598C14.2006 14.4598 11.5367 11.7951 11.5367 8.50774Z" fill="currentColor" />
                    <path d="M16.6623 12.1104C16.6623 12.6199 17.0544 12.9798 17.495 12.9919C17.968 13.004 18.3924 12.6361 18.3924 12.1306V9.32845L21.222 9.3244C21.7152 9.3244 22.0668 8.88366 22.0547 8.44695C22.0466 7.96982 21.6707 7.59377 21.1735 7.59377H18.3964V4.81181C18.3964 4.31445 18.0205 3.9384 17.5435 3.93031C17.107 3.92223 16.6663 4.26997 16.6663 4.76328L16.6583 7.58972H13.861C13.3678 7.58972 13.0121 7.99003 13 8.44291C12.9879 8.89579 13.3638 9.32036 13.861 9.3244H16.6583V12.1064L16.6623 12.1104Z" fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2_16">
                      <rect width="26" height="26" fill="white" transform="matrix(-1 0 0 1 26 0)" />
                    </clipPath>
                  </defs>
                </svg>
              </ZoomButton>
              <ZoomButton active={isBackgroundOn} onClick={zoomOut} aria-label="Zoom out">
                {/* <SearchMinusSolid /> */}
                <svg width="28" height="28" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2_20)">
                    <path d="M1.01461 26.0001H1.52394C1.89179 25.9112 2.12624 25.6847 2.41325 25.4017L12.4462 15.3656C15.0292 17.2297 18.356 17.5612 21.2786 16.1298C23.8333 14.8804 25.713 12.2682 25.9555 9.27197L26 9.0334L25.9798 7.98612C25.6524 3.1743 21.5414 -0.37593 16.7229 0.0324683C13.7317 0.283168 11.1163 2.15937 9.86318 4.71894C8.43221 7.64242 8.76368 10.9743 10.6312 13.5541L0.347637 23.8449C-0.0121269 24.2048 -0.0768051 24.7304 0.0970135 25.1914C0.242537 25.5715 0.594215 25.8667 1.01866 26.0001H1.01461ZM11.5367 8.50774C11.5367 5.22034 14.2006 2.55564 17.4869 2.55564C20.7733 2.55564 23.4372 5.22034 23.4372 8.50774C23.4372 11.7951 20.7733 14.4598 17.4869 14.4598C14.2006 14.4598 11.5367 11.7951 11.5367 8.50774Z" fill="currentColor" />
                    <path d="M13.861 7.5979L16.6583 7.61407L18.3965 7.5979H21.1735C21.6707 7.5979 22.0466 7.97395 22.0547 8.45109C22.0628 8.88779 21.7152 9.32854 21.222 9.32854H18.5218L16.6583 9.33258H13.861C13.3598 9.33258 12.9879 8.91205 13 8.45109C13.0121 7.99821 13.3679 7.60194 13.861 7.60194V7.5979Z" fill="currentColor" />
                  </g>
                  <defs>
                    <clipPath id="clip0_2_20">
                      <rect width="26" height="26" fill="white" transform="matrix(-1 0 0 1 26 0)" />
                    </clipPath>
                  </defs>
                </svg>
              </ZoomButton>
            </ZoomButtonStack>
          </ViewerControlGroup>

          {/* <ViewerControlGroup>
            <ViewerControlLabel active={isBackgroundOn}>Background</ViewerControlLabel>
            <ToggleSwitchWrap>
              <ToggleSwitch
                isOn={isBackgroundOn}
                onClick={toggleBackground}
                aria-label="Toggle background"
                aria-pressed={isBackgroundOn}
              />
              <ToggleSwitchState active={isBackgroundOn}>{isBackgroundOn ? "On" : "Off"}</ToggleSwitchState>
            </ToggleSwitchWrap>
          </ViewerControlGroup> */}
        </ViewerControlsPanel>
      ) : (
        ""
      )}

      {/* Personalize / Customize Panels */}
      {!isMobile && (
        <>
          <CustomizePanelsButton
            onClick={() => setSelectedPersonalize(!selectedPersonalize)}
          >
            {"Customize Panels"}
          </CustomizePanelsButton>
        </>
      )}
    </>
  );

  return (
    <>
      {viewerOverlayEl
        ? createPortal(viewerOverlayContent, viewerOverlayEl)
        : viewerOverlayContent}

      <div
        className="animate-wrapper-0"
        style={{
          position: "relative",
          height: "37%",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          // overflowY: "auto",
        }}
      >
        {/* Personalize A */}

        <div style={containerStyles}>
          {/* {groups[currentIndex].name === "MODALITATE IMPRIMARE" && (!hasTypeZero) ? null : ( */}
          <BottomBar>
            <BottomBarMenu onClick={toggleTray} aria-label="Open menu">
              <svg width="35" height="22" viewBox="0 0 35 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_34_66)">
                  <path d="M1.5 1.5H33.14" stroke="#636363" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
                  <path d="M1.5 10.6299H33.14" stroke="#636363" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
                  <path d="M1.5 19.77H33.14" stroke="#636363" strokeWidth="3" strokeMiterlimit="10" strokeLinecap="round" />
                </g>
                <defs>
                  <clipPath id="clip0_34_66">
                    <rect width="34.64" height="21.27" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {"Menu"}
            </BottomBarMenu>

            <BottomBarStepNav>
              <BottomBarStepArrow
                muted={currentIndex === 0}
                disabled={currentIndex === 0}
                onClick={handleLeftClick}
                aria-label="Previous"
              >
                <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_2_28)">
                    <path
                      d="M0.371449 13.8616C-0.111429 13.3798 -0.130002 12.6571 0.334305 12.1938L12.1648 0.389056C12.6663 -0.1113 13.372 -0.129832 13.8735 0.370525C14.2821 0.759691 14.3749 1.51949 13.8735 2.01985L4.0859 11.8046H30.8671C31.5357 11.8046 31.9814 12.3791 32 12.935C32.0186 13.491 31.5914 14.1767 30.8857 14.1767H4.04876L13.8549 23.9799C14.3378 24.4618 14.3192 25.1845 13.8921 25.6478C13.4835 26.074 12.7034 26.2037 12.2205 25.7034L0.371449 13.8616Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2_28">
                      <rect width="32" height="26" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </BottomBarStepArrow>

              <BottomBarStepLabel>
                {"Select: "}
                {groups[currentIndex]?.name}
              </BottomBarStepLabel>

              <Tooltip
                id={`tooltip-${groups[currentIndex]?.id}`}
                place="top"
                style={{
                  zIndex: 9999,
                  padding: "8px",
                  border: "1px solid #000",
                  borderRadius: "4px",
                }}
              />

              <BottomBarStepArrow
                muted={currentIndex === groups.length - 1}
                disabled={currentIndex === groups.length - 1}
                onClick={handleRightClick}
                aria-label="Next"
              >
                <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_2_31)">
                    <path
                      d="M31.6285 12.1383C32.1114 12.6201 32.13 13.3428 31.6657 13.8061L19.8351 25.6108C19.3337 26.1112 18.6279 26.1297 18.1265 25.6294C17.7179 25.2402 17.625 24.4804 18.1265 23.9801L27.9326 14.1768H1.13288C0.464278 14.1768 0.0185438 13.6023 -2.84482e-05 13.0463C-0.0186007 12.4904 0.408561 11.8047 1.11431 11.8047H27.9698L18.1451 2.0385C17.6622 1.55667 17.6808 0.833938 18.1079 0.370645C18.5165 -0.0555848 19.2965 -0.185307 19.7794 0.31505L31.6285 12.1383Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2_31">
                      <rect width="32" height="26" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </BottomBarStepArrow>
            </BottomBarStepNav>

            <BottomBarActions>
              {!isMobile && <Footer />}
            </BottomBarActions>

            {/* Closed on request of Paul */}
            {/* <MenuTriggerButton width={width} toggleTray={toggleTray} /> */}
          </BottomBar>
          {/* )} */}

          {/* <List>
            {groups.map(group => {
                return <ListItem key={group.id} onClick={() => {
                    selectGroup(group.id)
                }} selected={selectedGroup === group}> {group.id === -1 ? 'Other' : group.name}</ListItem>;
            })}
        </List> */}

          <div style={{ marginTop: 28 }} className={`animate-wrapper${isTrayOpen ? "-2 show" : ""}`}>
            {selectedGroup &&
              !selectedTrayPreviewOpenButton &&
              selectedGroup.steps.length > 0 &&
              !isTrayOpen && (
                <>
                  <List
                    isShelterColor={
                      selectedAttribute?.code === "Shelter Colors" ||
                      selectedAttribute?.code === "Frame Colors"
                    }
                  >
                    {selectedGroup.steps.map((step) => {
                      return (
                        <ListItem
                          key={step.id}
                          onClick={() => selectStep(step.id)}
                          selected={selectedStep === step}
                        >
                          {step.name}
                        </ListItem>
                      );
                    })}
                  </List>
                </>
              )}

            {!selectedTrayPreviewOpenButton && !isTrayOpen && (
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    // display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "roboto",
                    //textDecoration: "underline",
                  }}
                >
                  {/* {selectedAttribute?.code === "Shelter Colors" && (
                    <h5 style={{ paddingBottom: "16px" }}>
                      <span>Select Color From Palette</span>
                    </h5>
                  )} */}
                  {selectedGroup &&
                    selectedGroup.attributes &&
                    selectedGroup.attributes.length > 0 && (
                      <List
                        isShelterColor={
                          selectedAttribute?.code === "Shelter Colors" ||
                          selectedAttribute?.code === "Frame Colors"
                        }
                      >

                        {selectedGroup.attributes.map((opts, i) => {
                          // Frame Colors
                          if (opts.code === "Frame Colors") {
                            if (!opts.enabled) return null;

                            return (
                              <ColorFamilySection key={`frame-colors-${i}`}>
                                <ColorFamilyHeading>
                                  Choose From One of Our Color Families
                                </ColorFamilyHeading>

                                <ColorSwatchRow>
                                  {opts.options.map((atrOpts) => {
                                    if (!atrOpts.enabled) return null;

                                    const bgColor =
                                      FRAME_COLOR_HEX[atrOpts.name] || "#e0e0e0";

                                    return (
                                      <ColorSwatchItem key={atrOpts.id}>
                                        <ColorSwatch
                                          type="button"
                                          selected={atrOpts.selected}
                                          bgColor={bgColor}
                                          bgImage={atrOpts.imageUrl || undefined}
                                          onClick={() => {
                                            selectOption(atrOpts.id);
                                            selectOptionId(atrOpts.id);
                                            selectOptionName(atrOpts.name);
                                          }}
                                          aria-label={atrOpts.name}
                                        />
                                        {atrOpts.selected && (
                                          <ColorSwatchLabel>
                                            {atrOpts.name}
                                          </ColorSwatchLabel>
                                        )}
                                      </ColorSwatchItem>
                                    );
                                  })}
                                </ColorSwatchRow>

                                {selectedAttribute &&
                                  selectedAttribute.code === "Shelter Colors" &&
                                  selectedAttribute.enabled === true &&
                                  selectedAttribute.options.length > 0 && (
                                    <ColorSwatchRow>
                                      {selectedAttribute.options.map((option) => {
                                        if (option.enabled === false) return null;
                                        return (
                                          <ColorSwatchItem key={option.id}>
                                            <ColorSwatch
                                              type="button"
                                              small
                                              selected={option.selected}
                                              bgImage={option.imageUrl || undefined}
                                              onClick={() => {
                                                selectOption(option.id);
                                                selectOptionId(option.id);
                                                selectOptionName(option.name);
                                                selectColorName(option.name);
                                              }}
                                              aria-label={option.name}
                                            />
                                            {option.selected && (
                                              <ColorSwatchLabel>
                                                {option.name}
                                              </ColorSwatchLabel>
                                            )}
                                          </ColorSwatchItem>
                                        );
                                      })}
                                    </ColorSwatchRow>
                                  )}

                                <ColorFamilyFooter>
                                  View our full list of{" "}
                                  <RalColorsLink
                                    href="https://kwikgoal.com/ral-color-options/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    RAL colors
                                  </RalColorsLink>{" "}
                                  for custom frames.
                                </ColorFamilyFooter>
                              </ColorFamilySection>
                            );
                          }

                          // Other options
                          if (!validCodes.includes(opts.code)) {
                            if (opts.options.length <= 16 && opts.enabled) {
                              return (
                                <div
                                  key={`option-group-${i}`}
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    width: "100%",
                                    alignItems: "flex-start",
                                    justifyContent: "center",
                                  }}
                                >
                                  {opts.options.map((atrOpts) => {
                                    if (!atrOpts.enabled) return null;

                                    const isRalFamilyColor = opts.code === "Shelter Colors";

                                    return (
                                      <ColorChipItem key={atrOpts.id}>
                                        <ColorChip
                                          type="button"
                                          big={!isRalFamilyColor}
                                          selected={atrOpts.selected}
                                          onClick={() => {
                                            selectOption(atrOpts.id);
                                            selectOptionId(atrOpts.id);
                                            selectOptionName(atrOpts.name);
                                          }}
                                          aria-label={atrOpts.name}
                                        >
                                          {atrOpts.imageUrl && (
                                            <ColorChipInner
                                              src={atrOpts.imageUrl}
                                              alt={atrOpts.name}
                                              selected={atrOpts.selected}
                                            />
                                          )}
                                        </ColorChip>

                                        {atrOpts.selected && (
                                          <ColorChipLabel>
                                            {atrOpts.name}
                                          </ColorChipLabel>
                                        )}
                                      </ColorChipItem>
                                    );
                                  })}
                                </div>
                              );
                            }

                            return null;
                          }

                          return null;
                        })}


                        {selectedGroup.attributes.map((opts, i) => {
                          //  if (opts.code === 'Seats' || opts.code === 'Shelter' || 
                          //  opts.code ===  'Logo' || opts.code ===  'Wheels') {
                          if (validCodes.includes(opts.code)) {
                            if (opts.options.length <= 9) {
                              if (opts.enabled) {
                                return (
                                  opts.enabled &&
                                  opts.options.map((atrOpts) => {
                                    if (atrOpts.enabled) {
                                      const isShelterSize = opts.code === "Shelter";

                                      if (isShelterSize) {
                                        const panelCount = getShelterPanelCount(
                                          atrOpts.name
                                        );
                                        return (
                                          <PillOptionWrapper key={atrOpts.id}>
                                            <PillOption
                                              roundedRed
                                              style={{ margin: 0 }}
                                              onClick={() => {
                                                selectOption(atrOpts.id);
                                                selectOptionId(atrOpts.id);
                                                selectOptionName(atrOpts.name);
                                              }}
                                              selected={atrOpts.selected}
                                            >
                                              {atrOpts.name}
                                            </PillOption>
                                            {panelCount !== null && (
                                              <PillOptionCaption>
                                                {panelCount} Panels
                                              </PillOptionCaption>
                                            )}
                                          </PillOptionWrapper>
                                        );
                                      }

                                      const isWheelsOrSeats =
                                        opts.code === "Wheels" ||
                                        opts.code.includes("Seats");

                                      if (isWheelsOrSeats && atrOpts.imageUrl) {
                                        return (
                                          <IconCardItem key={atrOpts.id}>
                                            <IconCard
                                              type="button"
                                              selected={atrOpts.selected}
                                              onClick={() => {
                                                selectOption(atrOpts.id);
                                                selectOptionId(atrOpts.id);
                                                selectOptionName(atrOpts.name);
                                              }}
                                              aria-label={atrOpts.name}
                                            >
                                              <IconCardImage
                                                src={atrOpts.imageUrl}
                                                alt={atrOpts.name}
                                              />
                                            </IconCard>
                                            <IconCardLabel>
                                              {atrOpts.name}
                                            </IconCardLabel>
                                          </IconCardItem>
                                        );
                                      }

                                      if (!atrOpts.imageUrl) {
                                        return (
                                          <PillOption
                                            key={atrOpts.id}
                                            onClick={() => {
                                              selectOption(atrOpts.id);
                                              selectOptionId(atrOpts.id);
                                              selectOptionName(atrOpts.name);
                                            }}
                                            selected={atrOpts.selected}
                                          >
                                            {atrOpts.name}
                                          </PillOption>
                                        );
                                      }
                                      return (
                                        <ListItemColorBig
                                          onClick={() => {
                                            selectOption(atrOpts.id);
                                            selectOptionId(atrOpts.id);
                                            selectOptionName(atrOpts.name);
                                          }}
                                          selected={atrOpts.selected}
                                          selectedColor={selectedColorName}
                                        >
                                          {atrOpts.imageUrl && (
                                            <ListItemImageBig
                                              src={atrOpts.imageUrl}
                                            />
                                          )}

                                          <div
                                            style={{
                                              position: "absolute",
                                              top: "100%",
                                              fontSize: "14px",
                                            }}
                                          >
                                            {atrOpts.id === selectedOptionId
                                              ? atrOpts.name
                                              : ""}
                                          </div>
                                        </ListItemColorBig>
                                      );
                                    }
                                  })
                                );
                              } else return null;
                            }
                          }
                        })}
                      </List>

                    )}

                  <List>
                    {selectedGroup &&
                      selectedGroup.attributes &&
                      selectedGroup.attributes.map((opts, i) => {
                        if (opts.enabled === false) return <></>;
                        if (i > 0 && opts.enabled && opts.options.length >= 17) {
                          return (
                            <Swiper
                              spaceBetween={8}
                              slidesPerView="auto"
                              slidesPerGroup={1}
                              pagination={{ clickable: true }}
                              navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                              }}
                              modules={[Navigation]}
                              onReachEnd={() => setIsNextDisabled(true)}
                            >
                              <div className="swiper-button-prev"></div>
                              {opts.enabled &&
                                opts.options.map((atrOpts) => (
                                  <SwiperSlide key={atrOpts.id}>
                                    <ListItemColor
                                      onClick={() => {
                                        selectOption(atrOpts.id);
                                        selectOptionId(atrOpts.id);
                                        selectOptionName(atrOpts.name);
                                      }}
                                      selected={atrOpts.selected}
                                      selectedColor={selectedColorName}
                                    >
                                      {atrOpts.imageUrl && (
                                        <ListItemImage src={atrOpts.imageUrl} />
                                      )}

                                      <div
                                        style={{
                                          position: "absolute",
                                          top: "70%",
                                        }}
                                      >
                                        {/* {atrOpts.name} */}
                                        {atrOpts.id === selectedOptionId
                                          ? atrOpts.name
                                          : ""}
                                      </div>
                                    </ListItemColor>
                                  </SwiperSlide>
                                ))}

                              <div className={`swiper-button-next ${isNextDisabled ? 'swiper-button-disabled' : ''}`}></div>
                            </Swiper>

                          );
                        }
                      })}
                  </List>

                  <div>
                    <List>
                      {/* {selectedGroup &&
                        selectedGroup.attributes &&
                        // selectedGroup.attributes?.name =! 'Shelter Colors' &&
                        selectedGroup.attributes.map((opts, i) => {
                          if (opts.enabled === false) return <></>;
                          if (i > 0 && (opts.name != 'White' && opts.name != 'Black' && opts.name != 'Molded Seats Colors' && opts.name != 'Seats') && opts.enabled && opts.options.length <= 16) {
                            if (!validCodes.includes(opts.code)) {
                              return opts.options.map((atrOpts) => (
                                <ListItemColor
                                  key={atrOpts.id} // Always include a unique key when rendering lists
                                  onClick={() => {
                                    selectOption(atrOpts.id);
                                    selectOptionId(atrOpts.id);
                                    selectOptionName(atrOpts.name);
                                  }}
                                  selected={atrOpts.selected}
                                  selectedColor={selectedColorName}
                                >
                                  {atrOpts.imageUrl && (
                                    <ListItemImage src={atrOpts.imageUrl} />
                                  )}

                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "96%",
                                    }}
                                  >
                                    {atrOpts.id === selectedOptionId ? atrOpts.name : ""}
                                  </div>
                                </ListItemColor>
                              ));
                            }
                          } else {
                            // Ensure map always returns something, even if it's null
                            return null;
                          }
                        })} */}
                    </List>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>

        {isTrayOpen && !selectedTrayPreviewOpenButton && (
          <MenuOverlay>
            <MenuOverlayHeader>
              <MenuOverlayTitle>Menu</MenuOverlayTitle>
              <MenuOverlayCloseButton onClick={toggleTray} aria-label="Close menu">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 4L20 20M20 4L4 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </MenuOverlayCloseButton>
            </MenuOverlayHeader>

            <MenuOverlayBody>
              {selectedGroupList && selectedGroupList.length > 0 && (
                <MenuSection>
                  <MenuSectionTitle>Custom Shelter</MenuSectionTitle>
                  <MenuItemsGrid>
                    {selectedGroupList.map((name: string) => (
                      <MenuItem
                        key={name}
                        active={name === selectedGroup?.name}
                        onClick={() => handleShelterMenuClick(name)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </MenuItemsGrid>
                </MenuSection>
              )}

              {visibleAreas.length > 0 && (
                <MenuSection>
                  <MenuSectionTitle>Custom Panels</MenuSectionTitle>
                  <MenuItemsGrid>
                    {visibleAreas.map((area) => (
                      <MenuItem
                        key={area.name}
                        active={
                          !!selectedPersonalize && area.id === selectedFilteredAreas
                        }
                        onClick={() => handlePanelMenuClick(area.name)}
                      >
                        {area.name}
                      </MenuItem>
                    ))}
                  </MenuItemsGrid>
                </MenuSection>
              )}
            </MenuOverlayBody>
          </MenuOverlay>
        )}

        {selectedPersonalize && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 60,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              overflowY: "auto",
              padding: "12px",
            }}
          >
            <div style={{ width: "100%" }}>
              <Designer togglePersonalize={togglePersonalize} selectedPersonalize={selectedPersonalize}
                updateSelectedFilter={updateSelectedFilter} selectedFilteredAreas={selectedFilteredAreas} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Selector;
