import styled from "@emotion/styled"
import { colors } from "../../theme/colors"
import { fonts } from "../../theme/font"
import Menu from "../components/Menu"
import { FlexRowContainer, FlexColumnContainer } from "../style/FlexContainer"
import { useNavigate, useLocation } from "react-router-dom"

interface PageCommonProps {
    children: React.ReactNode
}

function PageCommon({ children }: PageCommonProps) {
    const navigate = useNavigate()
    const location = useLocation()

    const headerMenuItems = [
        { id: "/", label: "도서 검색" },
        { id: "/liked", label: "내가 찜한 책" },
    ]

    const currentMenu = location.pathname

    const onMenuClick = (menuId: string) => {
        navigate(menuId)
    }

    return (
        <PageContainer>
            <Header justifyContent="space-between" alignItems="center">
                <Logo>CERTICOS BOOKS</Logo>
                <Menu
                    items={headerMenuItems}
                    activeItemId={currentMenu}
                    onItemClick={onMenuClick}
                />
            </Header>
            {children}
        </PageContainer>
    )
}

export default PageCommon

const PageContainer = styled(FlexColumnContainer)`
    width: 100%;
    height: 100%;
    background-color: ${colors.palette.white};
    padding: 0 24px;
`

const Header = styled(FlexRowContainer)`
    height: 80px;
    margin-bottom: 60px;
`

const Logo = styled.div`
    ${fonts.title1}
    color: ${colors.text.primary};
`
