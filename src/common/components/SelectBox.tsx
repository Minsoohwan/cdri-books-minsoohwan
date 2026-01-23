import styled from "@emotion/styled"
import { colors } from "../../theme/colors"
import { fonts } from "../../theme/font"
import { type ReactNode, useState, useRef, useId } from "react"
import chevronIcon from "../../assets/icon/chevron.svg"
import { FlexRowContainer, FlexColumnContainer } from "../style/FlexContainer"
import Popover from "./Popover"

interface SelectBoxProps {
    width?: string | number
    height?: string | number
    label?: ReactNode
    value?: string
    onChange: (value: string) => void
    options: Array<{ value: string; label: string; disabled?: boolean }>
    isOpen?: boolean
}

function SelectBox({
    width = "100%",
    height = "36px",
    label,
    value,
    onChange,
    options,
    isOpen: controlledIsOpen,
}: SelectBoxProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false)
    const selectRef = useRef<HTMLDivElement>(null)
    const selectButtonId = useId()
    const isControlled = controlledIsOpen !== undefined
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen

    const selectedOption = options.find((opt) => opt.value === value)

    const onButtonClick = () => {
        if (!isControlled) {
            setInternalIsOpen(!internalIsOpen)
        }
    }

    const onOptionClick = (optionValue: string, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation()
            event.preventDefault()
        }
        onChange(optionValue)
        if (!isControlled) {
            setInternalIsOpen(false)
        }
    }

    return (
        <Container width={width} ref={selectRef}>
            {label && (
                <Label gap={4} alignItems="center">
                    {label}
                </Label>
            )}
            <SelectWrapper height={height}>
                <SelectButton
                    id={selectButtonId}
                    type="button"
                    onClick={onButtonClick}
                    height={height}
                >
                    <SelectText>
                        {selectedOption?.label || options[0]?.label || ""}
                    </SelectText>
                    <ChevronIcon src={chevronIcon} isOpen={isOpen} />
                </SelectButton>
                <Popover
                    isOpen={isOpen}
                    onClose={() => {
                        if (!isControlled) {
                            setInternalIsOpen(false)
                        }
                    }}
                    target={`#${selectButtonId}`}
                    position={{ target: "bottom", align: "start" }}
                    closeOnOutsideClick={true}
                >
                    <OptionsList>
                        {options.map((option) => (
                            <OptionItem
                                key={option.value}
                                isSelected={option.value === value}
                                onClick={(e) => onOptionClick(option.value, e)}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </OptionItem>
                        ))}
                    </OptionsList>
                </Popover>
            </SelectWrapper>
        </Container>
    )
}

export default SelectBox

const Container = styled(FlexColumnContainer)<{ width?: string | number }>`
    width: ${({ width }) =>
        typeof width === "number" ? `${width}px` : width || "100%"};
    position: relative;
`

const Label = styled(FlexRowContainer)`
    ${fonts.body2}

    color: ${colors.text.primary};

    margin-bottom: 4px;
`

const SelectWrapper = styled.div<{ height?: string | number }>`
    position: relative;

    width: 100%;
    height: ${({ height }) =>
        typeof height === "number" ? `${height}px` : height || "36px"};
`

const SelectButton = styled.button<{ height?: string | number }>`
    ${fonts.body2}

    width: 100%;
    height: ${({ height }) =>
        typeof height === "number" ? `${height}px` : height || "36px"};

    padding: 0 8px;
    padding-right: 24px;

    border: none;
    border-bottom: 1px solid ${colors.palette.gray};

    background-color: transparent;
    color: ${colors.text.primary};

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: space-between;

    &:focus {
        outline: none;
        border-bottom-color: ${colors.palette.primary};
    }

    &:hover {
        border-bottom-color: ${colors.palette.primary};
    }
`

const SelectText = styled.span`
    flex: 1;
    text-align: left;
`

const ChevronIcon = styled.img<{ isOpen?: boolean }>`
    width: 12px;
    height: 12px;
    transition: transform 0.2s;
    transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
    flex-shrink: 0;
`

const OptionsList = styled(FlexColumnContainer)`
    min-width: 120px;
    padding: 8px 0;
    background-color: ${colors.palette.white};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`

const OptionItem = styled.button<{ isSelected?: boolean; disabled?: boolean }>`
    ${fonts.body2}

    width: 100%;
    padding: 12px 16px;
    padding-right: ${({ isSelected }) => (isSelected ? "32px" : "16px")};

    border: none;
    background: none;
    color: ${({ isSelected }) =>
        isSelected ? colors.palette.primary : colors.text.primary};

    text-align: left;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

    position: relative;

    &:hover:not(:disabled) {
        background-color: ${colors.palette.lightGray};
    }

    ${({ isSelected }) =>
        isSelected &&
        `
        &::after {
            content: "";
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 20px;
            background-color: ${colors.palette.primary};
            border-radius: 2px;
        }
    `}
`
