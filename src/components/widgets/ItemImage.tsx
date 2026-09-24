import React, { forwardRef, useImperativeHandle, useRef } from "react";
import styled from "styled-components";
import { TemplateArea } from 'zakeke-configurator-react';

export interface EditImageItem {
    guid: string,
    name: string,
    imageID: number,
    url: string,
    constraints: { [key: string]: any } | null
}

declare enum ItemType {
    Text = 0,
    Image = 1
}
export interface Item {
    type: ItemType;
    guid: string;
    name: string;
    areaId: number;
    constraints: ({
        [key: string]: any;
    }) | null;
}

interface ImageItem {
    type: ItemType;
    imageID: number;
    areaId: number;
    guid: string;
    name: string;
    url: string;
    deleted: boolean;
    constraints: ({
        [key: string]: any;
    }) | null;
}

export interface ItemImageHandle {
    openFileDialog: () => void;
}

const ArtworkPreviewBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 200px;
    background-color: #f2f2f2;
    border-radius: 8px;
    padding: 12px;
    box-sizing: border-box;

    img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
`;

const ItemImage = forwardRef<
    ItemImageHandle,
    { item: ImageItem, handleItemPropChange: any, currentTemplateArea: TemplateArea, uploadImgDisabled: boolean }
>(({ item, handleItemPropChange }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => ({
        openFileDialog: () => inputRef.current?.click(),
    }));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files && e.currentTarget.files.length > 0) {
            handleItemPropChange(item, 'image-upload', e.currentTarget.files![0])
        }
        if (inputRef.current) inputRef.current.value = "";
    }

    return (
        <ArtworkPreviewBox>
            <img src={item.url} alt="" />
            <input
                type="file"
                ref={inputRef}
                style={{ display: 'none' }}
                onChange={handleInputChange}
            />
        </ArtworkPreviewBox>
    );
});

export default ItemImage;
