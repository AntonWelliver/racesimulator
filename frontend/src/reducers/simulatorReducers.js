import {
    RACE_LIST_REQUEST,
    RACE_LIST_SUCCESS,
    RACE_LIST_FAIL,
    SINGLE_RACE_REQUEST,
    SINGLE_RACE_SUCCESS,
    SINGLE_RACE_FAIL,
    SINGLE_RACE_RESET,
} from '../constants/simulatorConstants'

export const raceListReducer = (state = { races: [] }, action) => {
    switch (action.type) {
        case RACE_LIST_REQUEST:
            return { loading: true, races: [] }
        case RACE_LIST_SUCCESS:
            return { loading: false, races: action.payload.raceList }
        case RACE_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const singleRaceInfoReducer = (state = { race: {} }, action) => {
    switch (action.type) {
        case SINGLE_RACE_REQUEST:
            return { loading: true, ...state }
        case SINGLE_RACE_SUCCESS:
            return { loading: false, race: action.payload }
        case SINGLE_RACE_FAIL:
            return { loading: false, error: action.payload }
        case SINGLE_RACE_RESET:
            return { ...state, race: {} }
        default:
            return state
    }
}