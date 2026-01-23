import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Global, css } from "@emotion/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "./App.tsx"
import NotoSansKR from "./assets/font/NotoSansKR.ttf"

const globalStyles = css`
    @font-face {
        font-family: "Noto Sans KR";
        src: url(${NotoSansKR}) format("truetype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }

    html,
    body,
    #root {
        width: 100vw;
        height: 100vh;
        margin: 0;
        padding: 0;
    }

    * {
        font-family: "Noto Sans KR";
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        box-sizing: border-box;
    }

    *:disabled {
        opacity: 0.6;
        pointer-events: none;
    }
`

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Global styles={globalStyles} />
            <App />
        </QueryClientProvider>
    </StrictMode>
)
