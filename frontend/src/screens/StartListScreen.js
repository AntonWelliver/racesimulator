import React from 'react'
import { Button, Table, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'

const StartListScreen = ({ history }) => {
    const goBack = () => {
        history.push('/')
    }

    const startList = useSelector(state => state.startList)
    const { loading, error, startInfo } = startList

    const { raceName, distance } = startInfo

    return (
        <>
            <Row className='align-items-center text-center my-4'>
                <Col>
                    <h1>Startlist</h1>
                </Col>
                <Button variant='light' className='align-self-center' onClick={() => goBack()}>Go Back</Button>
            </Row>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                    <Row className='text-center my-4'>
                        <Col>
                            <h5 className='secondary'>{raceName}, {distance}km</h5>
                        </Col>
                    </Row>
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Start No.</th>
                                <th className='table-right'>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {startInfo.startList.map((entry, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{entry.runnerName}</td>
                                    <td>{entry.startNumber}</td>
                                    <td className='table-right'>{entry.startTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </>
    );
};

export default StartListScreen;
