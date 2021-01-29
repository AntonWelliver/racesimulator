import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Form, Popover, OverlayTrigger } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getSingleRaceInfo, createResultlist } from '../actions/simulatorActions'
import { SINGLE_RACE_RESET } from '../constants/simulatorConstants'

const RaceParameterScreen = ({ match, history }) => {
    const raceId = match.params.id
    const dispatch = useDispatch()

    const singleRaceInfo = useSelector(state => state.singleRaceInfo)
    const { loading, error, race } = singleRaceInfo

    const startInfo = useSelector(state => state.startInfo)
    const { startListInfo } = startInfo

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

    const backToRaceList = () => {
        dispatch({ type: SINGLE_RACE_RESET })
        history.push('/')
    }

    const backToStartList = () => {
        history.push(`/startlist/${raceId}`)
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
                const raceParams = { minSplitSec, maxSplitSec, variationSec, initialVariationSec }
                dispatch(createResultlist(startListInfo, raceParams))
                history.push(`/resultList/${raceId}`)
            }
        }
    }

    const fastestSplitTime = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Fastest Split Time</Popover.Title>
            <Popover.Content>
                Enter the fastest possible split time for the race.
            </Popover.Content>
        </Popover>
    )
    const slowestSplitTime = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Slowest Split Time</Popover.Title>
            <Popover.Content>
                Enter the slowest possible split time for the race.
            </Popover.Content>
        </Popover>
    )
    const variationTime = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Variation</Popover.Title>
            <Popover.Content>
                Enter the maximum variation in seconds for the each kilometer split time.
            </Popover.Content>
        </Popover>
    )
    const initialVariationTime = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Initial variation</Popover.Title>
            <Popover.Content>
                Enter the maximum variation in seconds for the first kilometer split time.
            </Popover.Content>
        </Popover>
    )

    return (
        <>
            <Row className='align-items-center text-center my-4'>
                <Button variant='light' className='align-self-center' onClick={() => backToRaceList()}>Back to race list</Button>
                <Button variant='light' className='align-self-center' onClick={() => backToStartList()}>Back to start list</Button>
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
                                <OverlayTrigger trigger="click" placement="right" overlay={fastestSplitTime}>
                                    <Button variant='light' className='mb-2 ml-3 btn-sm'>
                                        <i class="fas fa-info-circle"></i>
                                    </Button>
                                </OverlayTrigger>
                                <Form.Control type="time" min="02:00" max="10:00" value={minSplit} onChange={(e) => setMinSplit(e.target.value)} required></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Slowest Split Time</Form.Label>
                                <OverlayTrigger trigger="click" placement="right" overlay={slowestSplitTime}>
                                    <Button variant='light' className='mb-2 ml-3 btn-sm'>
                                        <i className="fas fa-info-circle"></i>
                                    </Button>
                                </OverlayTrigger>
                                <Form.Control type='time' min="02:00" max="10:00" value={maxSplit} onChange={(e) => setMaxSplit(e.target.value)} required></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Variation</Form.Label>
                                <OverlayTrigger trigger="click" placement="right" overlay={variationTime}>
                                    <Button variant='light' className='mb-2 ml-3 btn-sm'>
                                        <i className="fas fa-info-circle"></i>
                                    </Button>
                                </OverlayTrigger>
                                <Form.Control type='time' min="00:10" max="01:00" value={variation} onChange={(e) => setVariation(e.target.value)} required></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Initial Variation</Form.Label>
                                <OverlayTrigger trigger="click" placement="right" overlay={initialVariationTime}>
                                    <Button variant='light' className='mb-2 ml-3 btn-sm'>
                                        <i className="fas fa-info-circle"></i>
                                    </Button>
                                </OverlayTrigger>
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
