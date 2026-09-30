import {
  ZakekeImage as Image,
  ImageItem,
  Item,
  ProductArea,
  TemplateArea,
  TextItem,
  ZakekeDesigner,
  useZakeke,
} from "zakeke-configurator-react";
import useStore from "../../Store";
import React, { FC, useEffect, useRef, useState } from "react";
import Select, {
  GroupBase,
  OptionProps,
  SingleValueProps,
  components
} from "react-select";
import styled from "styled-components/macro";
import { T } from "../../Helpers";
import { ReactComponent as ArrowLeftIcon } from "../../assets/icons/arrow-left-solid.svg";
import { ReactComponent as ArrowRightIcon } from "../../assets/icons/arrow-right-solid.svg";
import { ReactComponent as Arrows } from "../../assets/icons/arrows-alt-solid.svg";
import { ReactComponent as Add } from "../../assets/icons/plus-circle-solid.svg";
import { ReactComponent as SearchMinusSolid } from "../../assets/icons/search-minus-solid.svg";
import { ReactComponent as SearchPlusSolid } from "../../assets/icons/search-plus-solid.svg";
import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg';
import {
  ArrowLeft,
  ArrowLeftIconStyled,
  ArrowRight,
  ArrowRightIconStyled,
  Button,
  CarouselContainer,
  CloseEditorButton,
  Icon,
} from "../Atomic";
import { useDialogManager } from "../dialog/Dialogs";
import ErrorDialog from "../dialog/ErrorDialog";
import ImagesGalleryDialog from "../dialog/ImagesGalleryDialog";
import ItemImage, { EditImageItem, ItemImageHandle } from "../widgets/ItemImage";
import ItemText, { EditTextItem } from "../widgets/ItemText";
import {
  Center,
  IconsAndDesignerContainer,
  SelectContainer,
  SupportedFormatsList,
  Template,
  TemplatesContainer,
  ZakekeDesignerContainer,
  ZoomInIcon,
  ZoomOutIcon,
} from "./LayoutStyled";
import { PillOption } from "../list";
import Footer from "./Footer";

import { Tooltip } from 'react-tooltip'

export type PropChangeHandler = (
  item: EditTextItem | EditImageItem,
  prop: string,
  value: string | boolean | File
) => void;

export interface TranslatedTemplate {
  id: number;
  name: string;
}

const ZoomIconIn = styled(ZoomInIcon)`
  left: 0px;
`;
const ZoomIconOut = styled(ZoomOutIcon)`
  left: 0px;
`;

const DesignerContainer = styled.div<{ isMobile?: boolean }>`
  // display: flex;
  flex-flow: wrap;
  justify-content: center;
  user-select: none;
  width: 100%;
  padding: 24px 24px 32px;
  background-color: #ffffff;
  height: 34em;
  overflow-y: auto;
  font-family: Roboto, sans-serif;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow-y: auto;

  ${(props) =>
    props.isMobile &&
    `
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:11;
        background-color:#ffffff;
        overflow-y:scroll;
    `}
`;

const PopupHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 4px 0 20px;
  text-align: center;
`;

const PopupTitle = styled.h2`
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 22px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #1a1a1a;

  span {
    text-transform: none;
    font-weight: 400;
  }
`;

const PopupSubtitle = styled.p`
  margin: 4px 0 0;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #6b6b6b;
`;

const PopupCloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
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

const PanelSelectorRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  margin-bottom: 8px;
`;

const PopupFooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 24px;
`;

const ArtworkSection = styled.div`
  width: 100%;
  margin-top: 22px;
`;

const ArtworkLabel = styled.span`
  display: block;
  margin-bottom: 10px;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #4a4a4a;
`;

const ArtworkGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  align-items: stretch;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ArtworkPreviewColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AddArtworkBox = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border: none;
  border-radius: 8px;
  background-color: #f2f2f2;
  cursor: pointer;
`;

const AddArtworkPillButton = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 24px;
  border: 1px solid #1a1a1a;
  background-color: #ffffff;
  color: #1a1a1a;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ArtworkActionColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 50%;
`;

const AddTextCenteredWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 160px;
  margin-top: 20px;
`;

const TextItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  align-items: start;
  justify-items: center;
  width: 100%;
  margin-top: 20px;
`;

const RoundOutlineButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 24px;
  border: 1px solid ${(props) => (props.disabled ? '#d0d0d0' : '#1a1a1a')};
  background-color: #ffffff;
  color: ${(props) => (props.disabled ? '#b0b0b0' : '#1a1a1a')};
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  white-space: nowrap;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    border-color: ${(props) => (props.disabled ? '#d0d0d0' : '#cf3339')};
    color: ${(props) => (props.disabled ? '#b0b0b0' : '#cf3339')};
  }
`;

const ArtworkFooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  align-items: center;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ArtworkFooterLeft = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const AddTextPanel = styled.div`
  margin-top: 22px;
  width: 50%;
  box-sizing: border-box;
  padding: 20px 24px 24px;
  border-radius: 10px;
  background-color: #d9d9d9;
`;

const AddTextHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const AddTextTitle = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: #1a1a1a;
`;

const AddTextCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: #1a1a1a;
  color: #ffffff;
  cursor: pointer;

  svg {
    width: 10px;
    height: 10px;
  }
`;

const AddTextInput = styled.textarea`
  display: block;
  width: 100%;
  min-height: 46px;
  margin-bottom: 18px;
  padding: 12px 14px;
  box-sizing: border-box;
  resize: none;
  border: none;
  border-radius: 6px;
  background-color: #f2f2f2;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-style: italic;
  color: #6b6b6b;

  &:focus {
    outline: none;
    font-style: normal;
    color: #1a1a1a;
  }
`;

const AddTextFontLabel = styled.span`
  display: block;
  margin-bottom: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #1a1a1a;
`;

const AddTextFontRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddTextFontSelectWrap = styled.div`
  position: relative;
  flex: 1;
`;

const AddTextFontSelect = styled.select`
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 12px 36px 12px 14px;
  appearance: none;
  -webkit-appearance: none;
  border: none;
  border-radius: 6px;
  background-color: #f2f2f2;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
`;

const AddTextFontChevron = styled.div`
  position: absolute;
  top: 50%;
  right: 14px;
  display: flex;
  transform: translateY(-50%);
  color: #4a4a4a;
  pointer-events: none;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const AddTextConfirmButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background-color: #f2f2f2;
  color: ${(props) => (props.disabled ? "#b0b0b0" : "#1a1a1a")};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background-color: ${(props) => (props.disabled ? "#f2f2f2" : "#e2e2e2")};
  }
`;

const Area = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: center;
  
    justify-content: space-around;
    // s// min-width: 51px;
    /* width: 100%; */
    cursor: pointer;
    padding: 1px 8px;
    text-align: center;
    margin: 0px 0px 6px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0px;
    word-spacing: 1px;
    border: 1px solid rgb(41, 124, 163);
    font-size: 12px;
    border-radius: 4px;
    background-color: white;
    color: rgb(41, 124, 163);


  &:hover {
    border: 3px solid #297CA3;
  }

  ${(props) =>
    props.selected &&
    `
	border: 4px solid #297CA3;
    `}
`;

const OptionContainer = styled(components.Option)`
  // width: 100%;
  // padding: 31px;
  border: 1px solid #297ca3;
  background-color: white !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  span {
    color: #297ca3;
  }
  &:hover {
    background-color: #ddd !important;
  }
`;

const SingleValueContainer = styled(components.SingleValue)`
  // width: 100%;
  border: 1px solid none;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    color: #297ca3;
  }
`;

const CopyrightMessage = styled.div`
  display: flex;
  flex-direction: column;
`;

const CopyrightMandatoryMessageContainer = styled.div`
  display: grid;
  grid-template-columns: 20px auto;
  grid-gap: 5px;
`;

const CopyrightCheckbox = styled.input`
  width: 13px;
`;

const CopyrightMandatoryMessage = styled.div``;

const Designer: FC<{
  onCloseClick?: () => void;
  togglePersonalize?: () => void;
  selectedPersonalize?: () => void;
  updateSelectedFilter?: any;
  selectedFilteredAreas?: any;
}> = ({ onCloseClick, togglePersonalize, selectedPersonalize, updateSelectedFilter, selectedFilteredAreas }) => {
  const { showDialog, closeDialog } = useDialogManager();
  const [forceUpdate, setForceUpdate] = useState(false);
  const { setIsLoading, isMobile } = useStore();

  const {
    currentTemplate,
    items,
    isAreaVisible,
    product,
    templates,
    setTemplate,
    setCamera,
    removeItem,
    setItemImageFromFile,
    setItemImage,
    setItemText,
    setItemItalic,
    setItemBold,
    setItemColor,
    setItemFontFamily,
    setItemTextOnPath,
    addItemText,
    addItemImage,
    createImage,
    getTemplateUploadRestrictictions,
    eventMessages,
    setCopyrightMessageAccepted,
    getCopyrightMessageAccepted,
    translations,
    fonts,
  } = useZakeke();

  const dynamicVals = translations?.dynamics;

  const customizerRef = useRef<any | null>(null);
  const [selectedCarouselSlide, setSelectedCarouselSlide] = useState<number>(0);

  const [isAddingText, setIsAddingText] = useState(false);
  const [newTextValue, setNewTextValue] = useState("");
  const [newTextFontFamily, setNewTextFontFamily] = useState<string>("");

  const primaryImageItemRef = useRef<ItemImageHandle | null>(null);

  const filteredAreas =
    product?.areas.filter((area) => isAreaVisible(area.id)) ?? [];

  let finalVisibleAreas: ProductArea[] = [];

  const [moveElements, setMoveElements] = useState(false);

  let translatedTemplates = templates.map((template) => {
    return { id: template.id, name: template.name, areas: template.areas };
  });

  let translatedCurrentTemplate = {
    id: currentTemplate?.id,
    name: currentTemplate?.name ?? "",
    areas: currentTemplate?.areas,
  };
  let translatedAreas = filteredAreas.map((area) => {
    return { id: area.id, name: area.name };
  });

  filteredAreas.length > 0 &&
    filteredAreas.forEach((filteredArea) => {
      let currentTemplateArea = currentTemplate!.areas.find(
        (x) => x.id === filteredArea.id
      );
      let itemsOfTheArea = items.filter(
        (item) => item.areaId === filteredArea.id
      );
      const areAllItemsStatic = !itemsOfTheArea.some((item) => {
        return (
          !item.constraints ||
          item.constraints.canMove ||
          item.constraints.canRotate ||
          item.constraints.canResize ||
          item.constraints.canEdit
        );
      });
      if (
        !areAllItemsStatic ||
        !currentTemplateArea ||
        currentTemplateArea?.canAddImage ||
        currentTemplateArea?.canAddText
      )
        finalVisibleAreas.push(filteredArea);
    });

  const [actualAreaId, setActualAreaId] = useState<number>(
    finalVisibleAreas && finalVisibleAreas.length > 0
      ? finalVisibleAreas[0].id
      : 0
  );


  let currentTemplateArea = currentTemplate!.areas.find(
    (x) => x.id === actualAreaId
  );
  let itemsFiltered = items.filter((item) => item.areaId === actualAreaId);
  const allStaticElements = !itemsFiltered.some((item) => {
    return (
      !item.constraints ||
      item.constraints.canMove ||
      item.constraints.canRotate ||
      item.constraints.canResize
    );
  });
  const showAddTextButton =
    !currentTemplateArea || currentTemplateArea.canAddText;
  const showUploadButton =
    !currentTemplateArea ||
    (currentTemplateArea.canAddImage &&
      currentTemplateArea.uploadRestrictions.isUserImageAllowed);
  const showGalleryButton =
    !currentTemplateArea ||
    (currentTemplateArea.canAddImage &&
      !currentTemplateArea.disableSellerImages);

  const supportedFileFormats = getSupportedUploadFileFormats(
    currentTemplate!.id,
    actualAreaId
  ).join(", ");

  const [copyrightMandatoryCheckbox, setCopyrightMandatoryCheckbox] = useState(
    getCopyrightMessageAccepted()
  );
  const copyrightMessage =
    eventMessages && eventMessages.find((message) => message.eventID === 8);

  const slidesToShow = window.innerWidth <= 1600 ? 3 : 4;

  useEffect(() => {
    if (templates.length > 0 && !currentTemplate) setTemplate(templates[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);

  useEffect(() => {
    const area = filteredAreas.filter((a) => a.id === actualAreaId);
    if (area && area.length > 0) setCamera(area[0].cameraLocationID as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualAreaId]);

  useEffect(() => {
    if (finalVisibleAreas.length > 0 && actualAreaId === 0)
      setActualAreaId(finalVisibleAreas[0].id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalVisibleAreas]);


  useEffect(() => {
    if (selectedFilteredAreas > 0) {
      setActualAreaId(selectedFilteredAreas)
    }
  }, [selectedFilteredAreas])


  function getSupportedUploadFileFormats(templateId: number, areaId: number) {
    const restrictions = getTemplateUploadRestrictictions(templateId, areaId);
    const fileFormats: string[] = [];

    if (restrictions.isJpgAllowed) fileFormats.push(".jpg", ".jpeg");

    if (restrictions.isPngAllowed) fileFormats.push(".png");

    if (restrictions.isSvgAllowed) fileFormats.push(".svg");

    if (restrictions.isEpsAllowed) fileFormats.push(".eps");

    if (restrictions.isPdfAllowed) fileFormats.push(".pdf");

    return fileFormats;
  }

  const isItemEditable = (item: Item, templateArea?: TemplateArea) => {
    if (!item.constraints) return false;

    let {
      canEdit,
      canMove,
      canRotate,
      canResize,
      canDelete,
      canChangeFontColor,
      canChangeFontFamily,
      canChangeFontWeight,
      isPrintable,
    } = item.constraints;

    if (!isPrintable) return false;

    let common = canEdit || canMove || canRotate || canResize || canDelete;
    let text = canChangeFontColor || canChangeFontFamily || canChangeFontWeight;
    let image =
      canEdit ||
      (templateArea &&
        (templateArea.uploadRestrictions.isUserImageAllowed ||
          !templateArea.disableSellerImages));

    if (item.type === 0) return common || text;
    else return common || image;
  };


  ;

  // Function to get the logo id
  function getLogoId(productId: any) {
    // Find the product with the given id
    const product = finalVisibleAreas.find((item) => item.id === productId);

    if (!product) {
      return null; // Product not found
    }

    // Initialize the logo name based on product name
    let logoName = '';
    if (product.name === "Rear Panel") {
      logoName = "Rear Panel Logo";
    } else if (product.name === "Right Side Panel") {
      logoName = "Side Logo Right";
    } else if (product.name === "Left Side Panel") {
      logoName = "Side Logo Left";
    } else {
      return null; // No corresponding logo for the product
    }

    // Find the logo product and return its id
    const logoProduct = finalVisibleAreas.find((item) => item.name === logoName);
    return logoProduct ? logoProduct.id : null;
  }


  function getTextId(productId: any) {
    // Find the product with the given id
    const product = finalVisibleAreas.find((item) => item.id === productId);

    if (!product) {
      return null; // Product not found
    }

    // Initialize the logo name based on product name
    let logoName = '';
    if (product.name === "Rear Panel Logo") {
      logoName = "Rear Panel";
    } else if (product.name === "Side Logo Right") {
      logoName = "Right Side Panel";
    } else if (product.name === "Side Logo Left") {
      logoName = "Left Side Panel";
    } else {
      return null; // No corresponding logo for the product
    }

    // Find the logo product and return its id
    const logoProduct = finalVisibleAreas.find((item) => item.name === logoName);
    return logoProduct ? logoProduct.id : null;
  }
  console.log(getLogoId(actualAreaId)); // Outputs: 403940 (or the respective logo id)


  const handleAddTextClick = () => {
    setNewTextValue("");
    setNewTextFontFamily(fonts?.[0]?.name ?? "");
    setIsAddingText(true);
  };

  const handleAddTextCancel = () => {
    setIsAddingText(false);
  };

  const handleAddTextConfirm = () => {
    if (!newTextValue.trim()) return;

    // Add the text item to the actual area
    addItemText({ text: newTextValue, fontFamily: newTextFontFamily }, actualAreaId);

    // Get the logo ID corresponding to the actual area
    const removeItemLogoId = getLogoId(actualAreaId);

    if (removeItemLogoId) {
      // Filter items that match the logo ID's areaId
      const logoItems = items.filter((item) => item.areaId === removeItemLogoId);

      // Iterate through and remove items
      logoItems.forEach((logoItem) => {
        removeItem(logoItem.guid);
      });
    }

    setIsAddingText(false);
  };


  const handleAddImageFromGalleryClick = async () => {
    showDialog(
      "add-image",
      <ImagesGalleryDialog
        onClose={() => closeDialog("add-image")}
        onImageSelected={(image: { imageID: number }) => {
          console.log("image", image);

          addItemImage(image.imageID, actualAreaId);

          const removeItemTextId = getTextId(actualAreaId);

          if (removeItemTextId) {
            // Filter items that match the logo ID's areaId
            const logoItems = items.filter((item) => item.areaId === removeItemTextId);

            // Iterate through and remove items
            logoItems.forEach((logoItem) => {
              removeItem(logoItem.guid);
            });
          }



          closeDialog("add-image");
        }}
      />
    );
  };

  const handleUploadImageClick = async (
    addItemImage: (guid: any, imageId: number) => Promise<void>,
    createImage: (
      file: File,
      progress?: (percentage: number) => void
    ) => Promise<Image>
  ) => {
    if (currentTemplate && actualAreaId) {
      const fileFormats = getSupportedUploadFileFormats(
        currentTemplate.id,
        actualAreaId
      );
      let input = document.createElement("input");
      input.setAttribute("accept", fileFormats.join(","));
      input.setAttribute("type", "file");
      input.addEventListener("change", async (e) => {
        const files = (e.currentTarget as HTMLInputElement).files;
        if (files && files.length > 0 && actualAreaId) {
          setIsLoading(true);
          try {
            const image = await createImage(files[0], (progress: number) =>
              console.log(progress)
            );
            addItemImage(image.imageID, actualAreaId);
            input.remove();
          } catch (ex) {
            console.error(ex);
            showDialog(
              "error",
              <ErrorDialog
                error={"Failed uploading image."}
                onCloseClick={() => closeDialog("error")}
              />
            );
          } finally {
            setIsLoading(false);
          }
        }
      });
      document.body.appendChild(input);
      input.click();
    }
  };

  const handleAddArtworkClick = () => {
    if (showGalleryButton) handleAddImageFromGalleryClick();
    else if (showUploadButton) handleUploadImageClick(addItemImage, createImage);
  };

  const handleItemRemoved = (guid: string) => {
    removeItem(guid);
  };

  const handleItemImageChange = async (item: EditImageItem, file: File) => {
    try {
      setIsLoading(true);
      await setItemImageFromFile(item.guid, file);
    } catch (ex) {
      console.error(ex);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemImageGallery = async (item: EditImageItem) => {
    showDialog(
      "add-image",
      <ImagesGalleryDialog
        onClose={() => closeDialog("add-image")}
        onImageSelected={async (image) => {
          closeDialog("add-image");
          try {
            setIsLoading(true);
            await setItemImage(item.guid, image.imageID);
          } catch (ex) {
            console.error(ex);
          } finally {
            setIsLoading(false);
          }
        }}
      />
    );
  };

  const handleItemPropChange = (
    item: EditTextItem | EditImageItem,
    prop: string,
    value: string | boolean | File
  ) => {
    switch (prop) {
      case "remove":
        handleItemRemoved(item.guid);
        break;
      case "image-upload":
        handleItemImageChange(item as EditImageItem, value as File);
        break;
      case "image-gallery":
        handleItemImageGallery(item as EditImageItem);
        break;
      case "text":
        setItemText(item.guid, value as string);
        break;
      case "font-italic":
        setItemItalic(item.guid, value as boolean);
        break;
      case "font-bold":
        setItemBold(item.guid, value as boolean);
        break;
      case "font-color":
        setItemColor(item.guid, value as string);
        break;
      case "font-family":
        setItemFontFamily(item.guid, value as string);
        break;
      case "text-path":
        setItemTextOnPath(item.guid, actualAreaId, value as boolean);
        setTimeout(() => setForceUpdate(!forceUpdate), 100);
        break;
    }
  };

  const SelectOption = (
    props: JSX.IntrinsicAttributes & OptionProps<any, boolean, GroupBase<any>>
  ) => {
    return (
      <OptionContainer {...props}>
        {<span>{props.data.name}</span>}
      </OptionContainer>
    );
  };

  const SelectSingleValue = (
    props: JSX.IntrinsicAttributes &
      SingleValueProps<any, boolean, GroupBase<any>>
  ) => {
    return (
      <SingleValueContainer {...props}>
        {<span>{props.data.name}</span>}
      </SingleValueContainer>
    );
  };
  // console.log('actualAreaId', actualAreaId)

  const getTooltipDetail = (name: string) => {
    switch (name) {
      case "Rear Panel":
        return "Add customization across the rear panels.";
      case "Right Side Panel":
        return "Add matching customization on  right side panel.";
      case "Left Side Panel":
        return "Add matching customization on left  side panel.";
      case "Top Crossbar":
        return "Add customization to the top cross bar.";
      case "Post Wrap":
        return "Add matching customization to the left and right posts.";
      case "Rear Panel Logo":
        return "Add matching customization to each rear panel.";
      case "Side Logo Left":
        return "Add customization to the left side panel.";
      case "Side Logo Right":
        return "Add customization to the right side panel.";
      case "Bench Plank":
        return "Add customization to the backrest bench plank.";
      case "Luxury Seat Bottom":
        return "Add customization to the front of the seat bottom.";
      case "Luxury Seat Top":
        return "Add customization to the headrest of the luxury seat.";
      default:
        return "";
    }
  };


  // console.log('item', item)
  console.log('itemsFiltered', itemsFiltered)
  console.log('items', items)
  console.log('finalVisibleAreas', finalVisibleAreas)

  const editableItemsFiltered = itemsFiltered.filter((item) =>
    isItemEditable(item, currentTemplateArea)
  );
  const textItemsFiltered = editableItemsFiltered.filter(
    (item) => item.type === 0
  ) as TextItem[];
  const imageItemsFiltered = editableItemsFiltered.filter(
    (item) => item.type === 1
  ) as ImageItem[];
  const showMoveElementsGlobal = itemsFiltered.length > 0 && !allStaticElements;
  const hasArtworkCapability =
    imageItemsFiltered.length > 0 || showUploadButton || showGalleryButton;

  return (
    <>

      {!moveElements && (
        <DesignerContainer isMobile={isMobile}>
          <PopupHeader>
            <div>
              <PopupTitle>Custom Panels:</PopupTitle>
              <PopupSubtitle>Select a Panel or Area of Shelter Frame</PopupSubtitle>
            </div>
            <PopupCloseButton onClick={togglePersonalize} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 4L20 20M20 4L4 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </PopupCloseButton>
          </PopupHeader>
          {/* Templates */}
          {!isMobile && templates.length > 1 && (
            <TemplatesContainer>
              {templates.map((template) => (
                <Template
                  key={template.id}
                  selected={currentTemplate === template}
                  onClick={() => {
                    setTemplate(template.id);
                  }}
                >
                  {template.name}
                </Template>
              ))}
            </TemplatesContainer>
          )}

          {/* Areas */}
          {/* {!isMobile && finalVisibleAreas.length > 1 && (
            <CarouselContainer
              slidesToScroll={1}
              speed={50}
              slidesToShow={slidesToShow}
              slideIndex={selectedCarouselSlide}
              afterSlide={setSelectedCarouselSlide}
              renderBottomCenterControls={() => <span />}
              renderCenterRightControls={() => {
                if (
                  selectedCarouselSlide !==
                  (finalVisibleAreas.length - slidesToShow > 0
                    ? finalVisibleAreas.length - slidesToShow
                    : selectedCarouselSlide)
                )
                  return (
                    <ArrowRight
                      onClick={() =>
                        setSelectedCarouselSlide(selectedCarouselSlide + 1)
                      }
                    >
                      <ArrowRightIconStyled>
                        <ArrowRightIcon />
                      </ArrowRightIconStyled>
                    </ArrowRight>
                  );
              }}
              renderCenterLeftControls={() => {
                if (selectedCarouselSlide !== 0)
                  return (
                    <ArrowLeft
                      onClick={() =>
                        setSelectedCarouselSlide(selectedCarouselSlide - 1)
                      }
                    >
                      <ArrowLeftIconStyled>
                        <ArrowLeftIcon />
                      </ArrowLeftIconStyled>
                    </ArrowLeft>
                  );
              }}
            >
              {finalVisibleAreas.map((area) => (
                <Area
                  key={area.id}
                  selected={actualAreaId === area.id}
                  onClick={() => setActualAreaId(area.id)}
                >
                  {area.name}
                </Area>
              ))}
            </CarouselContainer>
          )} */}



          <PanelSelectorRow>
            {finalVisibleAreas.map((area) => (
              <React.Fragment key={area.id}>
                <PillOption
                  roundedRed
                  style={{ margin: 0 }}
                  selected={actualAreaId === area.id}
                  onClick={() => {
                    setActualAreaId(area.id);
                    if (area) {
                      updateSelectedFilter(area.id);
                    }
                  }}
                  data-tooltip-id={`tooltip-${area.name.replace(/\s+/g, "-")}`}
                  data-tooltip-variant="light"
                  data-tooltip-content={getTooltipDetail(area.name)}
                >
                  {area.name}
                </PillOption>

                <Tooltip id={`tooltip-${area.name.replace(/\s+/g, "-")}`} place="top" style={{
                  zIndex: 12,
                  border: "1px solid #000",
                  borderRadius: "4px",
                }} />
              </React.Fragment>
            ))}
          </PanelSelectorRow>

          {isMobile && translatedTemplates.length > 1 && (
            <SelectContainer>
              <span>{"Templates"}</span>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    minWidth: 300
                  }),
                }}
                isSearchable={false}
                options={translatedTemplates}
                menuPosition="fixed"
                components={{
                  Option: SelectOption,
                  SingleValue: SelectSingleValue,
                }}
                value={translatedTemplates!.find(
                  (x) => x.id === translatedCurrentTemplate.id
                )}
                onChange={(template: any) => setTemplate(template.id)}
              />
            </SelectContainer>
          )}
          {isMobile && translatedAreas.length > 1 && (
            <SelectContainer>
              {/* <span>{T._("Customizable Areas", "Composer")}</span> */}
              <span>{dynamicVals?.get('Customizable Areas')}</span>
              <Select
                styles={{
                  control: (base) => ({
                    ...base,
                    width: '100% !important',
                    display: 'flex !important',
                    alignItems: 'center !important',
                    justifyContent: 'center !important',
                  }),
                }}
                isSearchable={false}
                options={translatedAreas}
                menuPosition="fixed"
                components={{
                  Option: SelectOption,
                  SingleValue: SelectSingleValue,
                }}
                value={[translatedAreas!.find((x) => x.id === actualAreaId)]}
                onChange={(area: any) => setActualAreaId(area.id)}
              />
            </SelectContainer>
          )}

          {itemsFiltered.length === 0 &&
            !(showAddTextButton || showUploadButton || showGalleryButton) && (
              <Center>{"No customizable items"}</Center>
            )}

          {hasArtworkCapability ? (
            textItemsFiltered.map((item) => (
              <ItemText
                key={item.guid}
                handleItemPropChange={handleItemPropChange}
                item={item}
                showMoveElementsButton={showMoveElementsGlobal}
                onMoveElementsClick={() => setMoveElements(true)}
              />
            ))
          ) : textItemsFiltered.length === 0 ? (
            showAddTextButton && !isAddingText && (
              <AddTextCenteredWrap>
                <RoundOutlineButton onClick={handleAddTextClick}>
                  <Add />
                  <span>{T._("Add Text", "Composer")}</span>
                </RoundOutlineButton>
              </AddTextCenteredWrap>
            )
          ) : (
            <TextItemsGrid>
              {textItemsFiltered.map((item) => (
                <ItemText
                  key={item.guid}
                  handleItemPropChange={handleItemPropChange}
                  item={item}
                  showMoveElementsButton={showMoveElementsGlobal}
                  onMoveElementsClick={() => setMoveElements(true)}
                />
              ))}

              {showAddTextButton && !isAddingText && (
                <RoundOutlineButton onClick={handleAddTextClick}>
                  <Add />
                  <span>{T._("Add Text", "Composer")}</span>
                </RoundOutlineButton>
              )}
            </TextItemsGrid>
          )}

          {isAddingText && (
            <AddTextPanel>
              <AddTextHeader>
                <AddTextTitle>{T._("Add Text", "Composer")}</AddTextTitle>
                <AddTextCloseButton onClick={handleAddTextCancel} aria-label="Close">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 4L20 20M20 4L4 20"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </AddTextCloseButton>
              </AddTextHeader>

              <AddTextInput
                placeholder="Input your text here"
                value={newTextValue}
                onChange={(e) => setNewTextValue(e.currentTarget.value)}
                autoFocus
              />

              <AddTextFontLabel>{T._("Font", "Composer")}</AddTextFontLabel>
              <AddTextFontRow>
                <AddTextFontSelectWrap>
                  <AddTextFontSelect
                    value={newTextFontFamily}
                    onChange={(e) => setNewTextFontFamily(e.currentTarget.value)}
                  >
                    {fonts?.map((font) => (
                      <option key={font.name} value={font.name}>
                        {font.name}
                      </option>
                    ))}
                  </AddTextFontSelect>
                  <AddTextFontChevron>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </AddTextFontChevron>
                </AddTextFontSelectWrap>

                <AddTextConfirmButton
                  disabled={!newTextValue.trim()}
                  onClick={handleAddTextConfirm}
                  aria-label="Confirm"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 12L10 18L20 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </AddTextConfirmButton>
              </AddTextFontRow>
            </AddTextPanel>
          )}

          {hasArtworkCapability && (
            <ArtworkSection>
              <ArtworkLabel>
                {imageItemsFiltered[0]?.name || T._("Artwork", "Composer")}
              </ArtworkLabel>

              <ArtworkGrid>
                <ArtworkPreviewColumn>
                    {imageItemsFiltered.length > 0 ? (
                      imageItemsFiltered.map((item, idx) => (
                        <ItemImage
                          uploadImgDisabled={
                            copyrightMessage && copyrightMessage.additionalData.enabled
                              ? !copyrightMandatoryCheckbox
                              : false
                          }
                          key={item.guid}
                          ref={idx === 0 ? primaryImageItemRef : undefined}
                          handleItemPropChange={handleItemPropChange}
                          item={item}
                          currentTemplateArea={currentTemplateArea!}
                        />
                      ))
                    ) : (
                      <AddArtworkBox onClick={handleAddArtworkClick}>
                        <AddArtworkPillButton>
                          <Add />
                          <span>{T._("Add Artwork", "Composer")}</span>
                        </AddArtworkPillButton>
                      </AddArtworkBox>
                    )}
                </ArtworkPreviewColumn>

                {imageItemsFiltered.length > 0 && (showUploadButton || showGalleryButton) && (
                  <AddArtworkBox onClick={handleAddArtworkClick}>
                    <AddArtworkPillButton>
                      <Add />
                      <span>{T._("Add Additional Artwork", "Composer")}</span>
                    </AddArtworkPillButton>
                  </AddArtworkBox>
                )}

                {showAddTextButton && !isAddingText && (
                  <ArtworkActionColumn>
                    <RoundOutlineButton onClick={handleAddTextClick}>
                      <Add />
                      <span>{T._("Add Text", "Composer")}</span>
                    </RoundOutlineButton>
                  </ArtworkActionColumn>
                )}
              </ArtworkGrid>

              <ArtworkFooterGrid>
                <ArtworkFooterLeft>
                  {imageItemsFiltered.length > 0 && showUploadButton && (
                    <RoundOutlineButton
                      disabled={
                        copyrightMessage && copyrightMessage.additionalData.enabled
                          ? !copyrightMandatoryCheckbox
                          : false
                      }
                      onClick={() => primaryImageItemRef.current?.openFileDialog()}
                    >
                      <span>{T._("Replace", "Composer")}</span>
                    </RoundOutlineButton>
                  )}
                  {showMoveElementsGlobal && textItemsFiltered.length === 0 && (
                    <RoundOutlineButton onClick={() => setMoveElements(true)}>
                      <Icon>
                        <Arrows />
                      </Icon>
                      <span>{T._("Move elements", "Composer")}</span>
                    </RoundOutlineButton>
                  )}
                </ArtworkFooterLeft>

                {showUploadButton && (
                  <SupportedFormatsList>
                    {T._("Supported file formats:", "Composer") +
                      " " +
                      supportedFileFormats}
                  </SupportedFormatsList>
                )}
              </ArtworkFooterGrid>

              {copyrightMessage && copyrightMessage.visible && (
                <CopyrightMessage>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: copyrightMessage.description,
                    }}
                  />
                  {copyrightMessage &&
                    copyrightMessage.additionalData.enabled && (
                      <CopyrightMandatoryMessageContainer>
                        <CopyrightCheckbox
                          type="checkbox"
                          defaultChecked={copyrightMandatoryCheckbox}
                          onClick={() => {
                            setCopyrightMessageAccepted(
                              !copyrightMandatoryCheckbox
                            );
                            setCopyrightMandatoryCheckbox(
                              !copyrightMandatoryCheckbox
                            );
                          }}
                        />
                        <CopyrightMandatoryMessage
                          dangerouslySetInnerHTML={{
                            __html: copyrightMessage.additionalData.message,
                          }}
                        />
                      </CopyrightMandatoryMessageContainer>
                    )}
                </CopyrightMessage>
              )}
            </ArtworkSection>
          )}
          {isMobile && (
            <CloseEditorButton onClick={onCloseClick}>
              {"OK"}
            </CloseEditorButton>
          )}
          {!isMobile && (
            <PopupFooterRow>
              <Footer />
            </PopupFooterRow>
          )}
        </DesignerContainer>
      )}
      {moveElements && (
        <ZakekeDesignerContainer
          isMobile={isMobile}
          className="zakeke-container"
        >

          <ZakekeDesigner ref={customizerRef} areaId={actualAreaId} />

          {/* <IconsAndDesignerContainer> */}
          {/* <ZoomIconIn hoverable onClick={() => customizerRef.current.zoomIn()}>
							<SearchPlusSolid />
						</ZoomIconIn>
						<ZoomIconOut hoverable onClick={() => customizerRef.current.zoomOut()}>
							<SearchMinusSolid />
						</ZoomIconOut> */}
          {/* </IconsAndDesignerContainer> */}
          <div style={{ position: "relative", top: "26px" }}>
            <Button isFullWidth primary onClick={() => setMoveElements(false)}>
              <span>{"OK"} </span>
            </Button>
          </div>
        </ZakekeDesignerContainer>
      )}
    </>
  );
};

export default Designer;
