import styled from "@emotion/styled"
import { colors } from "../../theme/colors"
import { fonts } from "../../theme/font"
import { FlexRowContainer } from "../style/FlexContainer"

interface MenuItem {
    id: string
    label: string
}

interface MenuProps {
    items: MenuItem[]
    activeItemId: string
    onItemClick: (itemId: string) => void
}

function Menu({ items, activeItemId, onItemClick }: MenuProps) {
    return (
        <MenuContainer as="nav" gap={32} alignItems="center">
            {items.map((item) => (
                <MenuItem
                    key={item.id}
                    isActive={item.id === activeItemId}
                    onClick={() => onItemClick(item.id)}
                >
                    {item.label}
                </MenuItem>
            ))}
        </MenuContainer>
    )
}

export default Menu

const MenuContainer = styled(FlexRowContainer)``

const MenuItem = styled.button<{ isActive: boolean }>`
    ${fonts.body2}

    position: relative;

    padding: 0;
    padding-bottom: 8px;

    border: none;

    background: none;
    color: ${colors.text.primary};

    cursor: pointer;
    transition: all 0.2s;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: ${({ isActive }) => (isActive ? "100%" : "0%")};
        height: 2px;
        background-color: ${colors.palette.primary};
        transition: width 0.3s ease;
    }

    &:hover {
        opacity: 0.7;
        color: ${colors.palette.primary};

        &::after {
            width: 100%;
        }
    }
`
