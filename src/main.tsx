import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Global, css } from "@emotion/react"
import App from "./App.tsx"
import NotoSansKR from "./assets/font/NotoSansKR.ttf"

const globalStyles = css`
    @font-face {
        font-family: "Noto Sans KR";
        src: url(${NotoSansKR}) format("truetype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;

        box-sizing: border-box;
    }

    * {
        font-family: "Noto Sans KR";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Global styles={globalStyles} />
        <App />
    </StrictMode>
)
