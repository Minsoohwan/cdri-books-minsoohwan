import styled from "@emotion/styled"

export interface FlexContainerProps {
    alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline"
    justifyContent?:
        | "flex-start"
        | "flex-end"
        | "center"
        | "space-between"
        | "space-around"
        | "space-evenly"
    gap?: string | number
    flex?: string | number
    width?: string | number
    height?: string | number
}

export const FlexRowContainer = styled.div<FlexContainerProps>`
    display: flex;
    flex-direction: row;
    align-items: ${({ alignItems }) => alignItems || "stretch"};
    justify-content: ${({ justifyContent }) => justifyContent || "flex-start"};
    gap: ${({ gap }) => (typeof gap === "number" ? `${gap}px` : gap || "0")};
    flex: ${({ flex }) => flex || "none"};
    width: ${({ width }) =>
        typeof width === "number" ? `${width}px` : width || "auto"};
    height: ${({ height }) =>
        typeof height === "number" ? `${height}px` : height || "auto"};
`

export const FlexColumnContainer = styled.div<FlexContainerProps>`
    display: flex;
    flex-direction: column;
    align-items: ${({ alignItems }) => alignItems || "stretch"};
    justify-content: ${({ justifyContent }) => justifyContent || "flex-start"};
    gap: ${({ gap }) => (typeof gap === "number" ? `${gap}px` : gap || "0")};
    flex: ${({ flex }) => flex || "none"};
    width: ${({ width }) =>
        typeof width === "number" ? `${width}px` : width || "auto"};
    height: ${({ height }) =>
        typeof height === "number" ? `${height}px` : height || "auto"};
`
