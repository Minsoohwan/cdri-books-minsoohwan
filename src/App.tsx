import { BrowserRouter, Routes, Route } from "react-router-dom"
import Page_Home from "./pages/Page_Home"
import Page_LikedBooks from "./pages/Page_LikedBooks"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Page_Home />} />
                <Route path="/liked" element={<Page_LikedBooks />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
