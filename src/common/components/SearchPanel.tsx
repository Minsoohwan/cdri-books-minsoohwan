import styled from "@emotion/styled"
import { colors } from "../../theme/colors"
import { fonts } from "../../theme/font"
import searchIcon from "../../assets/icon/search.svg"
import Button, { type ButtonProps } from "./Button"
import { FlexRowContainer } from "../style/FlexContainer"

interface ButtonConfig extends ButtonProps {
    text: string
    onClick?: () => void
}

interface SearchPanelProps {
    value?: string
    placeholder?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    buttonConfig?: ButtonConfig
    gap?: string | number
    buttonId?: string
}

function SearchPanel({
    value,
    placeholder = "검색어를 입력하세요",
    onChange,
    buttonConfig,
    gap = "16px",
    buttonId,
}: SearchPanelProps) {
    return (
        <Panel
            gap={typeof gap === "number" ? gap : gap || 16}
            alignItems="flex-end"
        >
            <SearchWrapper>
                <SearchIcon src={searchIcon} alt="" />
                <SearchTextBox
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
            </SearchWrapper>
            {buttonConfig && (
                <Button
                    id={buttonId}
                    width={buttonConfig.width ?? 72}
                    height={buttonConfig.height ?? 35}
                    backgroundColor={buttonConfig.backgroundColor ?? "white"}
                    textColor={buttonConfig.textColor ?? "subtitle"}
                    border={buttonConfig.border}
                    onClick={buttonConfig.onClick}
                >
                    {buttonConfig.text}
                </Button>
            )}
        </Panel>
    )
}

export default SearchPanel

const Panel = styled(FlexRowContainer)<{ gap?: string | number }>`
    width: 100%;
`

const SearchWrapper = styled.div`
    position: relative;
    flex: 1;
`

const SearchIcon = styled.img`
    position: absolute;
    left: 0.75em;
    top: 50%;
    transform: translateY(-50%);
    width: 1.25em;
    height: 1.25em;
    pointer-events: none;
    z-index: 1;
`

const SearchTextBox = styled.input`
    ${fonts.caption}

    width: 100%;
    height: 36px;

    padding: 0 1em;
    text-indent: 2em;

    border: none;

    background-color: ${colors.palette.lightGray};
    border-radius: 9999px;

    color: ${colors.text.primary};

    &:focus {
        outline: none;
    }

    &::placeholder {
        color: ${colors.text.subtitle};
    }
`
