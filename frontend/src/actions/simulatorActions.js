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
    CREATE_RESULTINFO_REQUEST,
    CREATE_RESULTINFO_SUCCESS,
    CREATE_RESULTINFO_FAIL,
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

const calculateStartTime = (minKmTimeSec, maxKmTimeSec, distance) => {
    let startTime = (minKmTimeSec + Math.random() * (maxKmTimeSec - minKmTimeSec)) * distance
    return startTime
}

const generateStartlist = (raceEntries, minKmTimeSec, maxKmTimeSec, distance, raceName) => {
    const startInfo = raceEntries.map(raceEntry => {
        let startTime = calculateStartTime(minKmTimeSec, maxKmTimeSec, distance)
        return {
            startTime,
            _id: raceEntry._id,
            runnerName: raceEntry.name,
            startNumber: raceEntry.startNumber
        }
    })

    const sortedStartlist = startInfo.sort((a, b) => {
        return a.startTime - b.startTime
    })

    const info = {
        distance,
        raceName,
        startList: sortedStartlist
    }
    return info
}

export const createStartlist = (id, minKmTimeSec, maxKmTimeSec) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_STARTLIST_REQUEST })

        const raceResult = await axios.get(`/api/v1/race-list/${id}`)

        const race = raceResult.data.race
        const distance = race.distance
        const raceName = race.name

        const { data } = await axios.get(`/api/v1/race-list/${id}/race-entries?limit=100`)

        const raceEntries = data.raceEntries

        const startListInfo = generateStartlist(raceEntries, minKmTimeSec, maxKmTimeSec, distance, raceName)

        dispatch({
            type: CREATE_STARTLIST_SUCCESS,
            payload: startListInfo
        });

        sessionStorage.setItem('startlist', JSON.stringify(startListInfo))

    } catch (error) {
        dispatch({
            type: CREATE_STARTLIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

const minusOrPlus = () => {
    const number = Math.random()
    if (number > 0.5) {
        return 1
    } else {
        return -1
    }
}

const calculateResultTime = (startTime, minSplitSec, maxSplitSec, variationSec, initialVariationSec, distance) => {
    const kilometers = [...Array(distance).keys()]

    let previousSplit = 0
    let kmTime = 0
    let totalTime = 0
    let previousTotalTime = 0
    let raceVariation = 0
    const splitsKm = kilometers.map((km) => {
        let sign = minusOrPlus()
        if (km === 0) {
            raceVariation = sign * initialVariationSec * Math.random()
            kmTime = (startTime / distance) + raceVariation
            // check min and max
            if (kmTime < minSplitSec) {
                raceVariation = (initialVariationSec - (minSplitSec - kmTime)) * Math.random()
                kmTime = (startTime / distance) + raceVariation
            } else if (kmTime > maxSplitSec) {
                raceVariation = -(initialVariationSec - (kmTime - maxSplitSec)) * Math.random()
                kmTime = (startTime / distance) + raceVariation
            }
            previousSplit = kmTime
            totalTime = kmTime
            previousTotalTime = totalTime
        } else {
            kmTime = previousSplit + sign * variationSec * Math.random()
            // check min and max
            if (kmTime <= minSplitSec) {
                raceVariation = (variationSec - (minSplitSec - kmTime)) * Math.random()
                kmTime = previousSplit + raceVariation
            } else if (kmTime >= maxSplitSec) {
                raceVariation = -(variationSec - (kmTime - maxSplitSec)) * Math.random()
                kmTime = previousSplit + raceVariation
            }
            previousSplit = kmTime
            totalTime = previousTotalTime + kmTime
            previousTotalTime = totalTime
        }
        return { kmTime, totalTime }
    })
    return splitsKm
}

const generateResultlist = (startList, raceName, distance, minSplitSec, maxSplitSec, variationSec, initialVariationSec) => {
    const resultList = startList.map(entryInfo => {
        const { startTime, runnerName, _id } = entryInfo
        let allTimes = calculateResultTime(startTime, minSplitSec, maxSplitSec, variationSec, initialVariationSec, distance)
        return {
            allTimes,
            runnerName,
            _id,
            totalTime: allTimes[distance - 1].totalTime
        }
    })

    const sortedResultlist = resultList.sort((a, b) => {
        return a.totalTime - b.totalTime
    })

    const info = {
        distance,
        raceName,
        resultListInfo: sortedResultlist
    }
    return info
}

export const createResultlist = (startListInfo, minSplitSec, maxSplitSec, variationSec, initialVariationSec) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_RESULTINFO_REQUEST })

        const { raceName, distance, startList } = startListInfo

        const resultInfo = generateResultlist(startList, raceName, distance, minSplitSec, maxSplitSec, variationSec, initialVariationSec)

        dispatch({
            type: CREATE_RESULTINFO_SUCCESS,
            payload: resultInfo
        });
    } catch (error) {
        dispatch({
            type: CREATE_RESULTINFO_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        })
    }
}
