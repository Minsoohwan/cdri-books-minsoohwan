import styled from "@emotion/styled"
import { colors } from "../../theme/colors"
import { fonts } from "../../theme/font"

export const TextBox = styled.input<{
    width?: string | number
    height?: string | number
}>`
    ${fonts.body2}

    width: ${({ width }) =>
        typeof width === "number" ? `${width}px` : width || "100%"};
    height: ${({ height }) =>
        typeof height === "number" ? `${height}px` : height || "36px"};

    padding: 0 8px;

    border: none;
    border-bottom: 1px solid ${colors.palette.black};

    background-color: transparent;
    color: ${colors.text.primary};

    &:focus {
        outline: none;
        border-bottom-color: ${colors.palette.primary};
    }

    &:hover {
        border-bottom-color: ${colors.palette.primary};
    }

    &::placeholder {
        color: ${colors.text.subtitle};
    }
`

export default TextBox
