import React, { FC, useCallback, useState } from "react";
import styled from "styled-components/macro";
import { FontFamily, useZakeke } from 'zakeke-configurator-react';
import { debounce } from 'lodash';

import type { PropChangeHandler } from "../layouts/Designer";

import { ReactComponent as CloseIcon } from '../../assets/icons/times-solid.svg'
import ColorPicker from "./colorpicker";
import { T } from "../../Helpers";

export interface EditTextItem {
    guid: string,
    name: string,
    text: string,
    fillColor: string,
    fontFamily: string,
    fontWeight: string,
    fontSize: number,
    isTextOnPath: boolean;
    constraints: { [key: string]: any } | null,
}

enum ItemType {
    Text = 0,
    Image = 1
}

export interface TextItem {
    type: ItemType;
    areaId: number;
    guid: string;
    name: string;
    text: string;
    strokeColor: string;
    strokeWidth: number;
    fillColor: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    fontStyle: string | undefined;
    fontStretch: string;
    justification: string;
    isTextOnPath: boolean;
    constraints: ({
        [key: string]: any;
    }) | null;
}

const ItemTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
    width: 100%;
`;

const AddedTextBar = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 22px 44px;
    box-sizing: border-box;
    border-radius: 6px;
    background-color: #d9d9d9;
`;

const AddedTextInput = styled.input`
    width: 100%;
    max-width: calc(100% - 56px);
    border: none;
    outline: none;
    background: white;
    text-align: center;
    font-family: 'Roboto', sans-serif;
    font-size: 24px;
    font-weight: 400;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #6b6b6b;

    &::placeholder {
        color: #6b6b6b;
    }

    &:focus {
        color: #1a1a1a;
    }
`;

const AddedTextRemoveButton = styled.button`
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    padding: 0;
    border: none;
    border-radius: 50%;
    // background-color: #ffffff;
    // color: #6b6b6b;
    cursor: pointer;

    svg {
        width: 12px;
        height: 12px;
    }

    &:hover {
        color: #cf3339;
    }
`;

const MoveElementsButton = styled.button`
    display: flex;
    align-self: flex-start;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    border-radius: 24px;
    border: 1px solid #1a1a1a;
    background-color: #ffffff;
    color: #1a1a1a;
    font-family: 'Roboto', sans-serif;
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    cursor: pointer;

    svg {
        width: 16px;
        height: 16px;
    }

    &:hover {
        border-color: #cf3339;
        color: #cf3339;
    }
`;

const FieldRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
`;

const FieldColumn = styled.div`
    flex: 1;
    min-width: 180px;
`;

const FieldLabel = styled.span`
    display: block;
    margin-bottom: 10px;
    font-family: 'Roboto', sans-serif;
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #1a1a1a;
`;

const FontSelectWrap = styled.div`
    position: relative;
`;

const FontSelect = styled.select`
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 14px 40px 14px 16px;
    appearance: none;
    -webkit-appearance: none;
    border: 1px solid #1a1a1a;
    border-radius: 8px;
    background-color: #ffffff;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    color: #1a1a1a;
    cursor: pointer;
`;

const FontSelectChevron = styled.div`
    position: absolute;
    top: 50%;
    right: 16px;
    display: flex;
    transform: translateY(-50%);
    color: #4a4a4a;
    pointer-events: none;

    svg {
        width: 14px;
        height: 14px;
    }
`;

const ColorRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
`;

const CurrentColorSwatch = styled.div`
    width: 70px;
    height: 70px;
    flex-shrink: 0;

    > div {
        width: 100% !important;
        height: 100% !important;
        border-radius: 8px;
    }
`;

const PresetSwatchStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const PresetSwatchRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
`;

const PresetSwatch = styled.button<{ color: string; selected?: boolean }>`
    width: 46px;
    height: 33px;
    padding: 0;
    border: 1px solid ${props => props.selected ? '#1a1a1a' : '#d0d0d0'};
    border-radius: 4px;
    background-color: ${props => props.color};
    cursor: pointer;
`;

const defaultColorsPalette = ['#FFFFFF', '#000000'];

const ItemText: FC<{
    item: EditTextItem,
    handleItemPropChange: PropChangeHandler,
    fonts?: FontFamily[],
    hideRemoveButton?: boolean,
    showMoveElementsButton?: boolean,
    onMoveElementsClick?: () => void,
}> = ({ item, handleItemPropChange, hideRemoveButton, showMoveElementsButton, onMoveElementsClick }) => {
    const { removeItem, fonts, disableTextColors, textColors } = useZakeke();

    // Used for performance cache
    const [fillColor, setFillColor] = useState(item.fillColor);

    //eslint-disable-next-line
    const handleFillColorChange = useCallback(debounce((color: string) => {
        handleItemPropChange(item, 'font-color', color);
    }, 300), []);

    if (!item) return null;

    const isUpperCase = item.constraints?.toUppercase ?? false;

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        handleItemPropChange(item, 'text', isUpperCase ? value.toUpperCase() : value);
    };

    const showColorSection = !!item.constraints?.canChangeFontColor &&
        (!disableTextColors || !(disableTextColors && textColors.length === 1));

    return (
        <ItemTextContainer>
            <AddedTextBar>
                <AddedTextInput
                    value={isUpperCase ? item.text.toUpperCase() : item.text}
                    onChange={handleTextChange}
                    placeholder={T._("Added Text", "Composer")}
                    maxLength={!item.constraints ? undefined : (item.constraints.maxNrChars || undefined)}
                />
                {!hideRemoveButton && item.constraints?.canDelete && (
                    <AddedTextRemoveButton onClick={() => removeItem(item.guid)} aria-label="Remove">
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9.5" cy="9.5" r="9.5" fill="#636363" />
                            <g clip-path="url(#clip0_432_443)">
                                <path d="M6 13.5L13.5 5.5" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" />
                                <path d="M6.5 5.5L14 13.5" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_432_443">
                                    <rect width="10" height="11" fill="white" transform="translate(5 4)" />
                                </clipPath>
                            </defs>
                        </svg>

                    </AddedTextRemoveButton>
                )}
            </AddedTextBar>

            {showMoveElementsButton && (
                <MoveElementsButton onClick={onMoveElementsClick}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 2V22M2 12H22M6 6L2 12L6 18M18 6L22 12L18 18"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>{T._("Move elements", "Composer")}</span>
                </MoveElementsButton>
            )}

            <FieldRow>
                {(!item.constraints || item.constraints.canChangeFontFamily) && (
                    <FieldColumn>
                        <FieldLabel>{T._("Font", "Composer")}</FieldLabel>
                        <FontSelectWrap>
                            <FontSelect
                                value={item.fontFamily}
                                onChange={(e) => handleItemPropChange(item, 'font-family', e.currentTarget.value)}
                            >
                                {fonts?.map((font) => (
                                    <option key={font.name} value={font.name}>{font.name}</option>
                                ))}
                            </FontSelect>
                            <FontSelectChevron>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M6 9L12 15L18 9"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </FontSelectChevron>
                        </FontSelectWrap>
                    </FieldColumn>
                )}

                {showColorSection && (
                    <FieldColumn>
                        <FieldLabel>{T._("Color", "Composer")}</FieldLabel>
                        <ColorRow>
                            {disableTextColors ? (
                                <PresetSwatchRow>
                                    {textColors.map((textColor) => (
                                        <PresetSwatch
                                            key={textColor.colorCode}
                                            type="button"
                                            color={textColor.colorCode}
                                            selected={textColor.colorCode.toLowerCase() === fillColor.toLowerCase()}
                                            onClick={() => {
                                                handleItemPropChange(item, 'font-color', textColor.colorCode);
                                                setFillColor(textColor.colorCode);
                                            }}
                                            aria-label={textColor.colorCode}
                                        />
                                    ))}
                                </PresetSwatchRow>
                            ) : (
                                <>
                                    <CurrentColorSwatch>
                                        <ColorPicker
                                            color={fillColor}
                                            onChange={(color) => {
                                                handleFillColorChange(color);
                                                setFillColor(color);
                                            }}
                                        />
                                    </CurrentColorSwatch>
                                    <PresetSwatchStack>
                                        {defaultColorsPalette.map((hex) => (
                                            <PresetSwatch
                                                key={hex}
                                                type="button"
                                                color={hex}
                                                selected={hex.toLowerCase() === fillColor.toLowerCase()}
                                                onClick={() => {
                                                    handleItemPropChange(item, 'font-color', hex);
                                                    setFillColor(hex);
                                                }}
                                                aria-label={hex}
                                            />
                                        ))}
                                    </PresetSwatchStack>
                                </>
                            )}
                        </ColorRow>
                    </FieldColumn>
                )}
            </FieldRow>
        </ItemTextContainer>
    );
}

export default ItemText;
