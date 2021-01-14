import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getSingleRaceInfo } from '../actions/simulatorActions'
import { SINGLE_RACE_RESET } from '../constants/simulatorConstants'

const RaceParameterScreen = ({ match, history }) => {
    const raceId = match.params.id
    const dispatch = useDispatch()

    const singleRaceInfo = useSelector(state => state.singleRaceInfo)
    const { loading, error, race } = singleRaceInfo

    const [maxSplit, setMaxSplit] = useState('')
    const [minSplit, setMinSplit] = useState('')
    const [variation, setVariation] = useState('')
    const [initialVariation, setInitialVariation] = useState('')
    const [message, setMessage] = useState(null)

    useEffect(() => {
        if (!race.name) {
            dispatch(getSingleRaceInfo(raceId))
        }
    }, [dispatch, race, raceId])

    const goBack = () => {
        dispatch({ type: SINGLE_RACE_RESET })
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

        const splitDiff = 30
        const varDiff = 10

        let minSplitSec = timeInSec(minSplit)
        let maxSplitSec = timeInSec(maxSplit)

        if (maxSplitSec - minSplitSec < splitDiff) {
            setMessage(`Difference between fastest and slowest must be at least ${splitDiff} seconds`)
        } else {
            let variationSec = timeInSec(variation)
            let initialVariationSec = timeInSec(initialVariation)

            if (variationSec - initialVariationSec < varDiff) {
                setMessage(`Initial variation must be at least ${varDiff} seconds faster than variation`)
            } else {
                console.log('Run simulation')
            }
        }
    }

    return (
        <>
            <Row className='align-items-center text-center my-4'>
                <Button variant='light' className='align-self-center' onClick={() => goBack()}>Go Back</Button>
                <Col>
                    <h1>Simulator parameters</h1>
                </Col>
            </Row>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                    {message && <Message variant='danger'>{message}</Message>}
                    <Row className='text-center my-4'>
                        <Col>
                            <h5 className='secondary'>Select simulator parameters for {race.name}, {race.distance}km</h5>
                        </Col>
                    </Row>
                    <FormContainer>
                        <Form onSubmit={submitHandler}>
                            <Form.Group>
                                <Form.Label>Fastest Split Time</Form.Label>
                                <Form.Control type="time" min="02:00" max="10:00" value={minSplit} onChange={(e) => setMinSplit(e.target.value)} required></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Slowest Split Time</Form.Label>
                                <Form.Control type='time' min="02:00" max="10:00" value={maxSplit} onChange={(e) => setMaxSplit(e.target.value)} required></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Variation</Form.Label>
                                <Form.Control type='time' min="00:10" max="01:00" value={variation} onChange={(e) => setVariation(e.target.value)} required></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Initial Variation</Form.Label>
                                <Form.Control type='time' min="00:10" max="01:00" value={initialVariation} onChange={(e) => setInitialVariation(e.target.value)} required></Form.Control>
                            </Form.Group>

                            <Button type='submit' variant='dark'>Submit and start simulation</Button>
                        </Form>
                    </FormContainer>
                </>
            )}
        </>
    );
};

export default RaceParameterScreen;
