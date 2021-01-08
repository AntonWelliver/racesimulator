import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'

const ParameterScreen = ({ match, history }) => {
    const raceId = match.params.id

    const [maxSplit, setMaxSplit] = useState('')
    const [minSplit, setMinSplit] = useState('')
    const [midSplit, setMidSplit] = useState('')
    const [devSplit, setDevSplit] = useState('')

    return (
        <>
            <Row className='my-4'>
                <Col>
                    <h1>Simulator parameters</h1>
                </Col>
                <LinkContainer to='/'>
                    <Button variant='light' className='align-self-center'>Go Back</Button>
                </LinkContainer>
            </Row>
            <Row className='text-center my-4'>
                <Col>
                    <h5 className='secondary'>Select simulator parameters for the race</h5>
                </Col>
            </Row>
            <FormContainer>
                <Form>
                    <Form.Group>
                        <Form.Label>Max Split Time</Form.Label>
                        <Form.Control type='number' placeholder='Enter race maximum split time' value={maxSplit} onChange={(e) => setMaxSplit(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Min Split Time</Form.Label>
                        <Form.Control type='number' placeholder='Enter race minimum split time' value={minSplit} onChange={(e) => setMinSplit(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Mid Split</Form.Label>
                        <Form.Control type='number' placeholder='Enter race mid split time' value={midSplit} onChange={(e) => setMidSplit(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Deviation</Form.Label>
                        <Form.Control type='number' placeholder='Enter race deviation' value={devSplit} onChange={(e) => setDevSplit(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='dark'>Submit and start sim</Button>
                </Form>
            </FormContainer>
        </>
    );
};

export default ParameterScreen;
