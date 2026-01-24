import styled from "@emotion/styled"
import { colors } from "../../theme/colors"
import { fonts } from "../../theme/font"
import type { FlexContainerProps } from "../style/FlexContainer"

type PaletteKey = keyof typeof colors.palette
type TextKey = keyof typeof colors.text

export interface ButtonProps extends FlexContainerProps {
    width?: string | number
    height?: string | number
    backgroundColor?: PaletteKey
    textColor?: TextKey
    border?: string
    disabled?: boolean
}

export const Button = styled.button<ButtonProps>`
    ${fonts.body2}

    display: flex;
    flex-direction: row;
    align-items: ${({ alignItems }) => alignItems || "center"};
    justify-content: ${({ justifyContent }) => justifyContent || "center"};

    width: ${({ width }) =>
        typeof width === "number" ? `${width}px` : width || "100%"};
    height: ${({ height }) =>
        typeof height === "number" ? `${height}px` : height || "36px"};

    border: ${({ border }) => border || "none"};
    border-radius: 8px;

    background-color: ${({ backgroundColor = "gray" }) =>
        colors.palette[backgroundColor]};
    color: ${({ textColor, backgroundColor = "gray" }) => {
        if (textColor) {
            return colors.text[textColor]
        }
        if (backgroundColor === "primary") {
            return colors.palette.white
        }
        return colors.text.primary
    }};

    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    transition: all 0.2s;

    &:hover:not(:disabled) {
        opacity: 0.8;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`

export default Button
