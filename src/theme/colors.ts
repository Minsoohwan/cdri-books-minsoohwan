export const colors = {
    palette: {
        primary: "#4880EE",
        red: "#E84118",
        gray: "#888888",
        lightGray: "#F5F5F5",
        white: "#FFFFFF",
        black: "#000000",
    },

    text: {
        primary: "#353C49",
        secondary: "#6D7582",
        subtitle: "#8D94A0",
    },
} as const

export type Colors = typeof colors
