import React from 'react';
import { Button, Table, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';

const ResultListScreen = ({ match, history }) => {
    const raceId = match.params.id;

    const backToRaceList = () => {
        history.push('/');
    };

    const backToStartList = () => {
        history.push(`/startlist/${raceId}`);
    };

    const resultInfo = useSelector((state) => state.resultInfo);
    const { loading, error, resultListInfo: resultInformation } = resultInfo;

    const { raceName, distance } = resultInformation;

    const boldText = {
        fontWeight: 'bold',
    };
    const splitTimes = (allTimes) => {
        let splitTimesArray = [];
        allTimes.forEach((split, index) => {
            let splitStr = runnerTime(split.kmTime);
            let totalStr = runnerTime(split.totalTime);
            if (index === 0) {
                splitTimesArray = [
                    ...splitTimesArray,
                    <span style={boldText}>Km {index + 1}:</span>,
                    <span>{'\u00A0'}</span>,
                    totalStr,
                    <span>{'\u00A0\u00A0\u00A0\u00A0'}</span>,
                    `(${splitStr})`
                ];
            } else {
                if ((index % 5) === 0 && distance > 5) {
                    splitTimesArray = [...splitTimesArray, <br />]
                    splitTimesArray = [
                        ...splitTimesArray,
                        <span style={boldText}>
                            Km {index + 1}:
                        </span>,
                        <span>{'\u00A0'}</span>,
                        totalStr,
                        <span>{'\u00A0\u00A0\u00A0\u00A0'}</span>,
                        `(${splitStr})`,
                    ]
                } else {
                    splitTimesArray = [
                        ...splitTimesArray,
                        <span style={boldText}>
                            {
                                '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'
                            }
                            Km {index + 1}:
                        </span>,
                        <span>{'\u00A0'}</span>,
                        totalStr,
                        <span>{'\u00A0\u00A0\u00A0\u00A0'}</span>,
                        `(${splitStr})`,
                    ]
                }
            }
        });
        return splitTimesArray;
    };

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
                                        <th className='table-right'>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultInformation.resultList.map(
                                        (runner, index) => (
                                            <tr key={index}>
                                                <td className='text-center'>
                                                    {index + 1}
                                                </td>
                                                <td>{runner.runnerName}</td>
                                                <td className='splitTimes'>
                                                    {splitTimes(runner.allTimes)}
                                                </td>
                                                <td className='table-right'>{`${runnerTime(
                                                    runner.totalTime
                                                )}`}</td>
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
