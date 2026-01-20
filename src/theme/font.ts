import { css } from "@emotion/react"

export const fonts = {
    title1: css`
        font-size: 24px;
        font-weight: 700;
        line-height: 24px;
    `,
    title2: css`
        font-size: 22px;
        font-weight: 700;
        line-height: 24px;
    `,
    title3: css`
        font-size: 18px;
        font-weight: 700;
        line-height: 18px;
    `,

    body1: css`
        font-size: 20px;
        font-weight: 500;
        line-height: 20px;
    `,
    body2: css`
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
    `,
    body2Bold: css`
        font-size: 14px;
        font-weight: 700;
        line-height: 14px;
    `,

    caption: css`
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
    `,

    small: css`
        font-size: 10px;
        font-weight: 500;
        line-height: 10px;
    `,
} as const

export type Font = typeof fonts
