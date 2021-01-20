import React from 'react'
import { Button, Table, Row, Col } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'

const StartListScreen = ({ match, history }) => {
    const raceId = match.params.id

    const goBack = () => {
        history.push('/')
    }

    const nextPage = () => {
        history.push(`/race-parameters/${raceId}`)
    }

    const startInfo = useSelector(state => state.startInfo)
    const { loading, error, startList } = startInfo

    const { raceName, distance } = startList

    const entryTime = (startTime) => {
        let timeLeft = startTime

        let minutes = Math.floor(timeLeft / 60)
        timeLeft = timeLeft - (minutes * 60)

        let seconds = Math.floor(timeLeft)
        timeLeft = timeLeft - seconds

        const mm = minutes < 10 ? '0' + minutes.toString() : minutes.toString()
        const ss = seconds < 10 ? '0' + seconds.toString() : seconds.toString()

        const time = `${mm}:${ss}`

        return time
    }

    return (
        <>
            <Row className='align-items-center text-center my-4'>
                <Button variant='light' className='align-self-center' onClick={() => goBack()}>Back to race list</Button>
                <Col>
                    <h1>Startlist</h1>
                </Col>
                <Button variant='light' className='align-self-center' onClick={() => nextPage()}>Next</Button>
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
                            {startList.startListInfo.map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{entry.runnerName}</td>
                                    <td>{entry.startNumber}</td>
                                    <td className='table-right'>{`${entryTime(entry.startTime)}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )
            }
        </>
    );
};

export default StartListScreen;
