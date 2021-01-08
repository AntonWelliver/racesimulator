import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getSingleRaceInfo } from '../actions/simulatorActions'
import { SINGLE_RACE_RESET } from '../constants/simulatorConstants'

const ParameterScreen = ({ match, history }) => {
    const raceId = match.params.id
    const dispatch = useDispatch()

    const singleRaceInfo = useSelector(state => state.singleRaceInfo)
    const { loading, error, race } = singleRaceInfo

    const [maxSplit, setMaxSplit] = useState('')
    const [minSplit, setMinSplit] = useState('')
    const [midSplit, setMidSplit] = useState('')
    const [devSplit, setDevSplit] = useState('')

    useEffect(() => {
        if (!race.name) {
            dispatch(getSingleRaceInfo(raceId))
        }
    }, [dispatch, race, raceId])

    const goBack = () => {
        dispatch({ type: SINGLE_RACE_RESET })
        history.push('/')
    }

    const submitHandler = (e) => {
        e.preventDefault()
        console.log(maxSplit, minSplit, midSplit, devSplit)
    }

    return (
        <>
            <Row className='my-4'>
                <Col>
                    <h1>Simulator parameters</h1>
                </Col>
                <Button variant='light' className='align-self-center' onClick={() => goBack()}>Go Back</Button>
            </Row>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                    <Row className='text-center my-4'>
                        <Col>
                            <h5 className='secondary'>Select simulator parameters for {race.name}, {race.distance}km</h5>
                        </Col>
                    </Row>
                    <FormContainer>
                        <Form onSubmit={submitHandler}>
                            <Form.Group>
                                <Form.Label>Max Split Time</Form.Label>
                                <Form.Control type="time" placeholder='Enter race maximum split time' value={maxSplit} onChange={(e) => setMaxSplit(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Min Split Time</Form.Label>
                                <Form.Control type='time' placeholder='Enter race minimum split time' value={minSplit} onChange={(e) => setMinSplit(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Mid Split</Form.Label>
                                <Form.Control type='time' placeholder='Enter race mid split time' value={midSplit} onChange={(e) => setMidSplit(e.target.value)}></Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Deviation</Form.Label>
                                <Form.Control type='time' placeholder='Enter race deviation' value={devSplit} onChange={(e) => setDevSplit(e.target.value)}></Form.Control>
                            </Form.Group>

                            <Button type='submit' variant='dark'>Submit and start simulation</Button>
                        </Form>
                    </FormContainer>
                </>
            )}
        </>
    );
};

export default ParameterScreen;
