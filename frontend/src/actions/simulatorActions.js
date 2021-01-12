import axios from 'axios';
import {
    RACE_LIST_REQUEST,
    RACE_LIST_SUCCESS,
    RACE_LIST_FAIL,
    SINGLE_RACE_REQUEST,
    SINGLE_RACE_SUCCESS,
    SINGLE_RACE_FAIL,
    CREATE_STARTLIST_REQUEST,
    CREATE_STARTLIST_SUCCESS,
    CREATE_STARTLIST_FAIL,
} from '../constants/simulatorConstants';

export const listRaces = () => async (dispatch) => {
    try {
        dispatch({ type: RACE_LIST_REQUEST });

        const { data } = await axios.get(`/api/v1/race-list`);

        dispatch({
            type: RACE_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: RACE_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getSingleRaceInfo = (id) => async (dispatch) => {
    try {
        dispatch({ type: SINGLE_RACE_REQUEST });

        const { data } = await axios.get(`/api/v1/race-list/${id}`);

        dispatch({
            type: SINGLE_RACE_SUCCESS,
            payload: data.race,
        });
    } catch (error) {
        dispatch({
            type: SINGLE_RACE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

const calculateStartTime = (minSplit, maxSplit, distance) => {
    let startTime = (minSplit + Math.random() * (maxSplit - minSplit)) * distance
    return startTime
}

const generateStartlist = (raceEntries, minSplit, maxSplit, distance, raceName) => {
    const startList = raceEntries.map(raceEntry => {
        let startTime = calculateStartTime(minSplit, maxSplit, distance)
        return {
            startTime,
            _id: raceEntry._id,
            runnerName: raceEntry.name,
            startNumber: raceEntry.startNumber
        }
    })
    const list = {
        distance,
        raceName,
        startList
    }
    return list
}

export const createStartlist = (id, minSplit, maxSplit) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_STARTLIST_REQUEST })

        const raceResult = await axios.get(`/api/v1/race-list/${id}`)

        const race = raceResult.data.race
        const distance = race.distance
        const raceName = race.name

        const { data } = await axios.get(`/api/v1/race-list/${id}/race-entries`)

        const raceEntries = data.raceEntries

        const startInfo = generateStartlist(raceEntries, minSplit, maxSplit, distance, raceName)

        dispatch({
            type: CREATE_STARTLIST_SUCCESS,
            payload: startInfo
        });
    } catch (error) {
        dispatch({
            type: CREATE_STARTLIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
