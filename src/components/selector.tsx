import "./selector.css";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
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
    selectColorName("");
    setCurrentIndex((currentIndex - 1 + groups.length) % groups.length);
    selectGroup(groups[(currentIndex - 1 + groups.length) % groups.length].id);

    if (items.filter((item) => item.type === 0).length === 0) {
      if (groups[groups.length - 1].name === "MODALITATE IMPRIMARE")
        if (items?.filter((item) => item.type === 0)) {
          groups.splice(groups.length - 1, 1);
        }
    }
  };

  const handleRightClick = () => {
    selectColorName("");
    setCurrentIndex((currentIndex + 1) % groups.length);
    selectGroup(groups[(currentIndex + 1) % groups.length].id);

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
    height: !selectedTrayPreviewOpenButton ? "370px" : "70px",
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
  const observerErrorHandler = (error: { message: string; }) => {
    if (error.message === "ResizeObserver loop completed with undelivered notifications.") {
      return;
    }
    console.error(error);
  };
  window.addEventListener("error", observerErrorHandler);

  console.log('selectedFilteredAreas', selectedFilteredAreas)
  // console.log('selectOptionName', selectedOptionName)
  const viewerOverlayContent = (
    <>
      {!isMobile && !isTrayOpen ? (
        <ViewerControlsPanel>
          <ViewerControlGroup>
            <ViewerControlLabel>View</ViewerControlLabel>
            <ZoomButtonStack>
              <ZoomButton onClick={zoomIn} aria-label="Zoom in">
                <SearchPlusSolid />
              </ZoomButton>
              <ZoomButton onClick={zoomOut} aria-label="Zoom out">
                <SearchMinusSolid />
              </ZoomButton>
            </ZoomButtonStack>
          </ViewerControlGroup>

          <ViewerControlGroup>
            <ViewerControlLabel>Background</ViewerControlLabel>
            <ToggleSwitchWrap>
              <ToggleSwitch
                isOn={isBackgroundOn}
                onClick={() => setIsBackgroundOn(!isBackgroundOn)}
                aria-label="Toggle background"
                aria-pressed={isBackgroundOn}
              />
              <ToggleSwitchState>{isBackgroundOn ? "On" : "Off"}</ToggleSwitchState>
            </ToggleSwitchWrap>
          </ViewerControlGroup>
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
          height: "45%",
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
                muted={currentIndex + 1 === 1}
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
                muted={currentIndex + 1 === groups.length - 2}
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
                                  <RalColorsLink>RAL colors</RalColorsLink>{" "}
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
                                    gap: "16px",
                                    width: "100%",
                                    alignItems: "flex-start",
                                    justifyContent: "center",
                                  }}
                                >
                                  {opts.options.map((atrOpts) => {
                                    if (!atrOpts.enabled) return null;

                                    return (
                                      <ColorChipItem key={atrOpts.id}>
                                        <ColorChip
                                          type="button"
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
                              // spaceBetween={0}
                              slidesPerView={20} //20
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
            <div style={{ width: "80%", maxWidth: "900px" }}>
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
