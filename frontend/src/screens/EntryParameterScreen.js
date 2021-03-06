import React, { useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Message from '../components/Message'
import InfoBox from '../components/InfoBox'
import FormContainer from '../components/FormContainer'
import { createStartlist } from '../actions/simulatorActions'

const EntryParameterScreen = ({ match, history }) => {
    const raceId = match.params.id

    const [minKmTime, setMinKmTime] = useState('')
    const [maxKmTime, setMaxKmTime] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const goBack = () => {
        history.push('/')
    }

    const timeInSec = (timeStr) => {
        const timeArray = timeStr.split(':')

        let seconds = 0
        let minNum = parseInt(timeArray[0], 10)
        let secNum = parseInt(timeArray[1], 10)

        seconds = minNum * 60 + secNum

        return seconds
    }

    const submitHandler = (e) => {
        e.preventDefault()

        let minKmTimeSec = timeInSec(minKmTime)
        let maxKmTimeSec = timeInSec(maxKmTime)

        if (maxKmTimeSec - minKmTimeSec < 30) {
            setMessage('Difference between fastest and slowest must be at least 30 seconds')
        } else {
            dispatch(createStartlist(raceId, minKmTimeSec, maxKmTimeSec))
            history.push(`/startlist/${raceId}`)
        }
    }

    return (
        <>
            <Row className='align-items-center text-center my-4'>
                <Button variant='light' className='align-self-center' onClick={() => goBack()}>Back to race list</Button>
                <Col>
                    <h1>Startlist parameters</h1>
                </Col>
            </Row>
            <>
                {message && <Message variant='danger'>{message}</Message>}
                <Row className='text-center my-4'>
                    <Col>
                        <h5 className='secondary'>Select parameters for creating a startlist</h5>
                    </Col>
                </Row>
                <FormContainer>
                    <Form onSubmit={submitHandler}>
                        <Form.Group>
                            <Form.Label>Fastest Average Km Time</Form.Label>
                            <InfoBox title='Fastest Average Km Time' text='Enter the fastest possible average km time in the start list.' />
                            <Form.Control type="time" min="02:00" max="10:00" value={minKmTime} onChange={(e) => setMinKmTime(e.target.value)} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Slowest Average Km Time</Form.Label>
                            <InfoBox title='Slowest Average Km Time' text='Enter the slowest possible average km time in the start list.' />
                            <Form.Control type='time' min="02:00" max="10:00" value={maxKmTime} onChange={(e) => setMaxKmTime(e.target.value)} required></Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='dark'>Submit</Button>
                    </Form>
                </FormContainer>
            </>
        </>
    );
};

export default EntryParameterScreen;
