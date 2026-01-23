import styled from "@emotion/styled"
import { colors } from "../../theme/colors"
import { fonts } from "../../theme/font"
import Menu from "./Menu"
import { FlexRowContainer, FlexColumnContainer } from "../style/FlexContainer"

interface PageCommonProps {
    children: React.ReactNode
    currentMenu: string
    onMenuClick: (menuId: string) => void
}

function PageCommon({ children, currentMenu, onMenuClick }: PageCommonProps) {
    const headerMenuItems = [
        { id: "search", label: "도서 검색" },
        { id: "like", label: "내가 찜한 책" },
    ]

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
