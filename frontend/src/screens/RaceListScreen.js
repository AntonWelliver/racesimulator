import React, { useEffect } from 'react'
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
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
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
								<th></th>
							</tr>
						</thead>
						<tbody>
							{races.map(race => (
								<tr key={race._id}>
									<td>{race.name}</td>
									<td>
										{race.distance}km
                                    </td>
									<td>
										{race.entries}
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</>
			)}
		</>
	);
};

export default RaceListScreen;
