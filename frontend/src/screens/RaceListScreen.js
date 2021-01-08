import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listRaces } from '../actions/simulatorActions'

const RaceListScreen = () => {
	const dispatch = useDispatch()

	const raceList = useSelector(state => state.raceList)
	const { loading, error, races } = raceList

	useEffect(() => {
		dispatch(listRaces())
	}, [dispatch])

	return (
		<>
			<Row className='align-items-center my-4'>
				<Col>
					<h1>Race List</h1>
				</Col>
			</Row>
			{loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
				<>
					<Table striped bordered hover responsive className='table-sm'>
						<thead>
							<tr>
								<th>NAME</th>
								<th>DISTANCE</th>
								<th>ENTRIES</th>
							</tr>
						</thead>
						<tbody>
							{races.map(race => (
								<LinkContainer to={`/parameters/${race._id}`}>
									<tr key={race._id}>
										<td>{race.name}</td>
										<td>
											{race.distance}km
                                    </td>
										<td>
											{race.entries}
										</td>
									</tr>
								</LinkContainer>
							))}
						</tbody>
					</Table>
				</>
			)}
		</>
	);
};

export default RaceListScreen;
