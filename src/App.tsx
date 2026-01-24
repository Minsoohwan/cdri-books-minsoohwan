import { BrowserRouter, useLocation } from "react-router-dom"
import Page_Home from "./pages/Page_Home"
import Page_LikedBooks from "./pages/Page_LikedBooks"
import styled from "@emotion/styled"

function AppContent() {
    const location = useLocation()
    const isHomePage = location.pathname === "/"
    const isLikedPage = location.pathname === "/liked"

    return (
        <>
            <PageWrapper isVisible={isHomePage}>
                <Page_Home />
            </PageWrapper>
            {isLikedPage && (
                <PageWrapper isVisible={isLikedPage}>
                    <Page_LikedBooks />
                </PageWrapper>
            )}
        </>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
}

export default App

const PageWrapper = styled.div<{ isVisible: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: ${({ isVisible }) => (isVisible ? "block" : "none")};
    background-color: white;
    z-index: ${({ isVisible }) => (isVisible ? 1 : 0)};
`
