import styled from "styled-components";

export const List = styled.ul<{isShelterColor?: boolean}>`
    position: relative;
    margin: 0;
    padding: 10px;
    display: flex;
    align-items: center;
    margin-top: 12px;
    gap: 14px;
    margin-bottom: 17px;
    // border-radius: 50px;
    white-space: ${props => props.isShelterColor ? 'normal' : 'nowrap'};
    flex-wrap: ${props => props.isShelterColor ? 'wrap' : 'nowrap'};
    justify-content: center;
    // border-top: ${props => props.isShelterColor ? '1.5px solid gray' : ''};

    @media screen and (max-width: 568px) {
        width: 100vw;
        margin-bottom: 12px; 
        transform-origin: 50% 50% 0px;
        // transform: translate3d(-186.507px, 0px, 0px) scale(1, 1);
        position: relative;
        // left: 50vw;
        }
`;
  
export const ListItem = styled.li<{ selected?: boolean }>`
    display: flex;
    flex-direction: column;    
    font: 500 1.1rem/1.5 'Roboto';
    align-items: center;
    text-align: center;
    justify-content: center;
    padding: 0px 10px;    
    cursor: pointer;
    margin: 0 10px;
    width: 152px;
    height: 36px;
    border-color: ${props => props.selected ? 'black' : '#DDD'};
    white-space: nowrap;

    border: 1px solid #297CA3;
    border-radius: 4px;
    background-color: ${props => props.selected ? '#297ca3' : 'white'};
    color: ${props => props.selected ? 'white' : '#297ca3' };

    &:hover {
        background-color: #ffd966;
    }
    @media screen and (max-width: 568px) {
      font: 500 .8rem/1.8 'Roboto';
      margin: 0 7px;
      padding: 0px 7px;
      width: 132px;
      height: 33px;
    }
`;


export const ListItemBig = styled.li<{ selected?: boolean }>`
    display: flex;
    flex-direction: column;    
    font: 500 1.1rem/1.5 'Roboto';
    align-items: center;
    text-align: center;
    justify-content: center;
    padding: 0px 10px;    
    cursor: pointer;
    margin: 0 10px;
    width: 152px;
    height: 36px;
    border-color: ${props => props.selected ? 'black' : '#DDD'};
    white-space: nowrap;

    border: 1px solid #297CA3;
    border-radius: 4px;
    background-color: ${props => props.selected ? '#297ca3' : 'white'};
    color: ${props => props.selected ? 'white' : '#297ca3' };

    &:hover {
        background-color: #ffd966;
    }
    @media screen and (max-width: 568px) {
      font: 500 .8rem/1.8 'Roboto';
      margin: 0 7px;
      padding: 0px 7px;
      width: 132px;
      height: 33px;
    }
`;


export const ListItemColorWithCarousel = styled.li<{ selected?: boolean, selectedColor?: any}>`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
    padding: 0px 5px;
    cursor: pointer;
    margin: 0 3px;
    border-radius: 100%;
    width: 5.5em;
    height: 5.1em;
    white-space: nowrap;  
    font-size: 12px;  
    border-color: ${props => props.selected ? 'black' : '#DDD'};
    
    &:before {
        content: '';
        position: absolute;
        bottom: 20%;
        /* Additional styling for the :before pseudo-element can be added here */
    };

    &:after {
    content: "${props => { return props.selected ? props.selectedColor : ''
                        }}";
    position: absolute;
    top: 110%;
    border-bottom: 1px solid #000;
    font-family: 'Roboto', sans-serif;
    font-size: 13px;    
    }
    
    @media screen and (max-width: 568px) {
    &:after {
      top: 73% !important;
      width: 6.5em;
      height: 6.1em;    
      }
    }`;


export const ListItemColor = styled.li<{ selected?: boolean, selectedColor?: any}>`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
    padding: 0px 10px;
    cursor: pointer;
    margin: 0 11px;
    // border-radius: 100%;
    width: 40px;
    height: 40px;
    white-space: nowrap;  
    font-size: 12px;  
    border-color: ${props => props.selected ? 'black' : '#DDD'};

    &:hover {
        background-color: #D8D8D8;
    };
    
    &:before {
        content: '';
        position: absolute;
        bottom: 20%;
        /* Additional styling for the :before pseudo-element can be added here */
    };

    &:after {
    // content: "${props => { return props.selected ? props.selectedColor : '' }}";
    position: absolute;
    bottom: 7%;
    }
        
    @media screen and (max-width: 568px) {
    &:after {
     bottom: -65%;  
     }
    }`;


    export const ListItemColorBig = styled.li<{ selected?: boolean, selectedColor?: any}>`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
    padding: 0px 10px;
    cursor: pointer;
    margin: 0 11px;
    border-radius: 20%;
    width: 100px;
    height: 100px;
    white-space: nowrap;  
    font-size: 20px;  
    border-color: ${props => props.selected ? 'black' : '#DDD'};

    &:hover {
        background-color: #D8D8D8;
    };
    
    &:before {
        content: '';
        position: absolute;
        bottom: 20%;
        /* Additional styling for the :before pseudo-element can be added here */
    };

    &:after {
    // content: "${props => { return props.selected ? props.selectedColor : '' }}";
    position: absolute;
    bottom: 7%;
    }
        
    @media screen and (max-width: 568px) {
    &:after {
     bottom: -65%;  
     }
    }`;

 
 export const ListItemImage = styled.img<{ selected?: any }>`
    width: 40px;
    height: 40px;
    object-fit: contain;
    margin: 0px 11px;
    border-radius: 10%;
    border: 1px solid rgb(168 161 161);
    
    @media screen and (max-width: 568px) {
      width: 36px;
      height: 36px;
      margin: 0px 8px;
    }
`;


export const ListItemImageBig = styled.img<{ selected?: any }>`
width: 100px;
height: 100px;
object-fit: contain;
margin: 0px 11px;
border-radius: 20%;
border: 1px solid rgb(229, 229, 229);

@media screen and (max-width: 568px) {
  width: 36px;
  height: 36px;
  margin: 0px 8px;
}
`

export const ListItemImageNoCarousel = styled.img<{ selected?: any }>`
    position: relative;
    width: 40px;
    height: 40px;
    object-fit: contain;
    margin: 0px 11px;
    border-radius: 100%;
    border: 1px solid rgb(168 161 161);
    
    @media screen and (max-width: 568px) {
    width: 30px;
    height: 30px;
    margin: 0px 8px;
    }
`;


export const PillOption = styled.li<{ selected?: boolean; roundedRed?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
    padding: 10px 32px;
    margin: 6px;
    min-width: 64px;
    border-radius: ${props => props.roundedRed ? '12px' : '6px'};
    border: ${props => props.roundedRed
        ? (props.selected ? 'none' : '1px solid #636363')
        : `1px solid ${props.selected ? '#cf3339' : '#1a1a1a'}`};
    background-color: ${props => props.roundedRed
        ? (props.selected ? '#D32F37' : '#ffffff')
        : (props.selected ? '#cf3339' : '#ffffff')};
    color: ${props => props.roundedRed
        ? (props.selected ? '#ffffff' : '#636363')
        : (props.selected ? '#ffffff' : '#1a1a1a')};
    font-family: 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
        border-color: ${props => props.roundedRed ? '#D32F37' : '#cf3339'};
        color: ${props => props.selected ? '#ffffff' : (props.roundedRed ? '#D32F37' : '#cf3339')};
    }

    @media screen and (max-width: 568px) {
        padding: 8px 14px;
        font-size: 13px;
        min-width: 52px;
    }
`;

export const PillOptionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2px;
`;

export const PillOptionCaption = styled.span`
    // margin-top: 8px;
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #8c8c8c;
    text-transform: uppercase;
    letter-spacing: 0.3px;
`;

export const ColorFamilySection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
`;

export const ColorFamilyHeading = styled.h4`
    margin: 0 0 30px;
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: #4a4a4a;
    text-align: center;
`;

export const ColorSwatchRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    gap: 16px;
`;

export const ColorSwatch = styled.button<{ selected?: boolean; bgColor?: string; bgImage?: string; small?: boolean }>`
    width: ${props => props.small ? '40px' : '70px'};
    height: ${props => props.small ? '40px' : '70px'};
    border-radius: ${props => props.small ? '8px' : '12px'};
    padding: 0;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.bgColor || '#e0e0e0'};
    background-image: ${props => props.bgImage ? `url(${props.bgImage})` : 'none'};
    background-color: ${props => props.bgColor || '#e0e0e0'};
    background-image: ${props => props.bgImage ? `url(${props.bgImage})` : 'none'};
    background-size: cover;
    background-position: center;
    border: 1px solid #d9d9d9;
    outline: ${props => props.selected ? '2px solid #1a1a1a' : 'none'};
    outline-offset: 2px;

    @media screen and (max-width: 568px) {
        width: ${props => props.small ? '32px' : '52px'};
        height: ${props => props.small ? '32px' : '52px'};
    }
`;

export const ColorSwatchItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
`;

export const ColorSwatchLabel = styled.span`
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    color: #4a4a4a;
    text-align: center;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const IconCardItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

export const IconCard = styled.button<{ selected?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90px;
    height: 90px;
    padding: 10px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    gap: 12px;
    background-color: ${props => props.selected ? ' rgb(207, 51, 57)' : 'transparent'};
    outline: ${props => props.selected ? 'none' : '1px solid #1a1a1a'};
    // outline-offset: 2px;

    @media screen and (max-width: 568px) {
        width: 52px;
        height: 52px;
    }
`;

export const IconCardImage = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
`;

export const IconCardLabel = styled.span`
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #4a4a4a;
    text-align: center;
    max-width: 90px;
`;

export const ColorChipItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
`;

export const ColorChip = styled.button<{ selected?: boolean; big?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${props => props.big ? '90px' : '50px'};
    height: ${props => props.big ? '90px' : '50px'};
    padding: 0;
    border-radius: 10px;
    cursor: pointer;
    background-color: ${props => props.selected ? 'transparent' : 'transparent'};
    border: ${props => props.selected ? '2px solid #636363' : '1px solid #636363'};
    outline: none;

    @media screen and (max-width: 568px) {
        width: 52px;
        height: 52px;
    }
`;

export const ColorChipInner = styled.img<{ selected?: boolean }>`
    width: ${props => props.selected ? '90%' : '85%'};
    height: ${props => props.selected ? '90%' : '85%'};
    object-fit: cover;
    border-radius: ${props => props.selected ? '12px' : '8px'};
    transition: width 0.15s ease, height 0.15s ease;
`;

export const ColorChipLabel = styled.span`
    font-family: 'Roboto', sans-serif;
    font-size: 13px;
    color: #4a4a4a;
    text-align: center;
`;

export const ColorFamilyFooter = styled.p`
    margin: 24px 0 0;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    color: #4a4a4a;
    text-align: center;
`;

export const RalColorsLink = styled.a`
    color: #cf3339;
    text-decoration: underline;
    cursor: pointer;
    font-weight: 500;

    &:hover {
        color: #a82228;
    }
`;

export const ListItemImageNoCarouselBig = styled.img<{ selected?: any }>`
    position: relative;
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin: 0px 11px;
    border-radius: 100%;
    border: 1px solid rgb(229, 229, 229);
    
    @media screen and (max-width: 568px) {
    width: 30px;
    height: 30px;
    margin: 0px 8px;
    }
`