import styled from "@emotion/styled"
import { colors } from "../../theme/colors"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

type PositionTarget = "top" | "bottom" | "left" | "right"
type PositionAlign = "start" | "center" | "end"

export interface PopoverPosition {
    target: PositionTarget
    align: PositionAlign
}

interface PopoverProps {
    isOpen: boolean
    onClose?: () => void
    target: string | HTMLElement | null
    position?: PopoverPosition
    children: ReactNode
    closeOnOutsideClick?: boolean
    offset?: number
}

const POPOVER_Z_INDEX = 9999

function Popover({
    isOpen,
    onClose,
    target,
    position = { target: "bottom", align: "start" },
    children,
    closeOnOutsideClick = false,
    offset = 8,
}: PopoverProps) {
    const popoverRef = useRef<HTMLDivElement>(null)
    const [popoverPosition, setPopoverPosition] = useState<{
        top: number
        left: number
    }>({ top: 0, left: 0 })

    useEffect(() => {
        if (!isOpen || !target) return

        const updatePosition = () => {
            const targetElement =
                typeof target === "string"
                    ? document.querySelector<HTMLElement>(target)
                    : target

            if (!targetElement || !popoverRef.current) return

            const targetRect = targetElement.getBoundingClientRect()
            const popoverRect = popoverRef.current.getBoundingClientRect()

            if (popoverRect.width === 0 && popoverRect.height === 0) {
                requestAnimationFrame(updatePosition)
                return
            }

            let top = 0
            let left = 0

            switch (position.target) {
                case "top":
                    top = targetRect.top - popoverRect.height - offset
                    break
                case "bottom":
                    top = targetRect.bottom + offset
                    break
                case "left":
                    left = targetRect.left - popoverRect.width - offset
                    break
                case "right":
                    left = targetRect.right + offset
                    break
            }

            switch (position.target) {
                case "top":
                case "bottom":
                    switch (position.align) {
                        case "start":
                            left = targetRect.left
                            break
                        case "center":
                            left =
                                targetRect.left +
                                targetRect.width / 2 -
                                popoverRect.width / 2
                            break
                        case "end":
                            left = targetRect.right - popoverRect.width
                            break
                    }
                    break
                case "left":
                case "right":
                    switch (position.align) {
                        case "start":
                            top = targetRect.top
                            break
                        case "center":
                            top =
                                targetRect.top +
                                targetRect.height / 2 -
                                popoverRect.height / 2
                            break
                        case "end":
                            top = targetRect.bottom - popoverRect.height
                            break
                    }
                    break
            }

            const viewportWidth = window.innerWidth
            const viewportHeight = window.innerHeight

            if (left < 0) left = 8
            if (left + popoverRect.width > viewportWidth) {
                left = viewportWidth - popoverRect.width - 8
            }
            if (top < 0) top = 8
            if (top + popoverRect.height > viewportHeight) {
                top = viewportHeight - popoverRect.height - 8
            }

            setPopoverPosition({ top, left })
        }

        updatePosition()
    }, [isOpen, target, position, offset])

    if (!isOpen) return null

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnOutsideClick && onClose && e.target === e.currentTarget) {
            onClose()
        }
    }

    return createPortal(
        <>
            {closeOnOutsideClick && <Outside onClick={handleBackdropClick} />}
            <PopoverContainer
                ref={popoverRef}
                style={{
                    top: `${popoverPosition.top}px`,
                    left: `${popoverPosition.left}px`,
                    zIndex: POPOVER_Z_INDEX,
                }}
            >
                {children}
            </PopoverContainer>
        </>,
        document.body
    )
}

export default Popover

const Outside = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: ${POPOVER_Z_INDEX - 1};
    background-color: transparent;
`

const PopoverContainer = styled.div`
    position: fixed;
    background-color: ${colors.palette.white};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`
