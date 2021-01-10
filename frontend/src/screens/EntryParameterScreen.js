import React, { useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { createStartlist } from '../actions/simulatorActions'

const EntryParameterScreen = ({ match, history }) => {
    const raceId = match.params.id

    const [minSplit, setMinSplit] = useState('')
    const [maxSplit, setMaxSplit] = useState('')
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

        let minSplitSec = timeInSec(minSplit)
        let maxSplitSec = timeInSec(maxSplit)

        if (maxSplitSec - minSplitSec < 30) {
            setMessage('Difference between fastest and slowest must be at least 30 seconds')
        } else {
            dispatch(createStartlist(raceId, minSplitSec, maxSplitSec))
            console.log('ok')
        }
    }

    return (
        <>
            <Row className='my-4'>
                <Col>
                    <h1>Startlist parameters</h1>
                </Col>
                <Button variant='light' className='align-self-center' onClick={() => goBack()}>Go Back</Button>
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
                            <Form.Label>Fastest Average Split Time</Form.Label>
                            <Form.Control type="time" placeholder='Enter fastest average split time' min="02:00" max="10:00" value={minSplit} onChange={(e) => setMinSplit(e.target.value)} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Slowest Average Split Time</Form.Label>
                            <Form.Control type='time' placeholder='Enter slowest average split time' min="02:00" max="10:00" value={maxSplit} onChange={(e) => setMaxSplit(e.target.value)} required></Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='dark'>Submit</Button>
                    </Form>
                </FormContainer>
            </>
        </>
    );
};

export default EntryParameterScreen;
