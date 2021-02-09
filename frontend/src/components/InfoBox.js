import React from 'react'
import { Button, Popover, OverlayTrigger } from 'react-bootstrap'

const InfoBox = ({ title, text }) => {
    const infoContent = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">
                {title}
            </Popover.Title>
            <Popover.Content>
                {text}
            </Popover.Content>
        </Popover>
    )

    return (
        <OverlayTrigger trigger="click" placement="right" overlay={infoContent}>
            <Button variant='light' className='mb-2 ml-3 btn-sm'>
                <i className="fas fa-info-circle"></i>
            </Button>
        </OverlayTrigger>
    )
}

export default InfoBox
