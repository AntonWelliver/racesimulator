import React from 'react';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import SplitTimes from '../components/SplitTimes';
import { saveResult } from '../actions/simulatorActions'

const ResultListScreen = ({ match, history }) => {
    const raceId = match.params.id;

    const dispatch = useDispatch()

    const backToRaceList = () => {
        history.push('/');
    };

    const backToStartList = () => {
        history.push(`/startlist/${raceId}`);
    };

    const resultInfo = useSelector((state) => state.resultInfo);
    const { loading, error, resultListInfo: resultInformation } = resultInfo;

    const { raceName, distance } = resultInformation;

    const runnerTime = (times) => {
        let timeLeft = times;

        let minutes = Math.floor(timeLeft / 60);
        timeLeft = timeLeft - minutes * 60;

        let seconds = Math.floor(timeLeft);
        timeLeft = timeLeft - seconds;

        /* const mm = minutes < 10 ? '0' + minutes.toString() : minutes.toString() */
        const mm = minutes.toString();
        const ss = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

        const time = `${mm}:${ss}`;

        return time;
    };

    const saveResultList = () => {
        dispatch(saveResult(raceId, resultInformation))
    }

    return (
        <>
            <Row className='align-items-center text-center my-4'>
                <Button
                    variant='light'
                    className='align-self-center'
                    onClick={() => backToRaceList()}
                >
                    Back to race list
				</Button>
                <Button
                    variant='light'
                    className='align-self-center'
                    onClick={() => backToStartList()}
                >
                    Back to start list
				</Button>
                <Col>
                    <h1>ResultList</h1>
                </Col>
                <Button variant='light' className='align-self-center' onClick={() => saveResultList()}>Save</Button>
            </Row>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                        <>
                            <Row className='text-center my-4'>
                                <Col>
                                    <h5 className='secondary'>
                                        {raceName}, {distance}km
							</h5>
                                </Col>
                            </Row>
                            <Table
                                striped
                                bordered
                                hover
                                responsive
                                className='table-sm'
                            >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th className='text-center'>Split times</th>
                                        <th className='table-center'>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultInformation.resultList.map(
                                        (runner, index) => (
                                            <tr key={index}>
                                                <td className='text-center font-weight-bold'>
                                                    {index + 1}
                                                </td>
                                                <td className='font-weight-bold'>{runner.runnerName}</td>
                                                <td className='splitTimes'>
                                                    <SplitTimes
                                                        allTimes={runner.allTimes}
                                                    />
                                                </td>
                                                <td className='table-center font-weight-bold'>
                                                    {`${runnerTime(
                                                        runner.totalTime
                                                    )}`}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </Table>
                        </>
                    )}
        </>
    );
};

export default ResultListScreen;
