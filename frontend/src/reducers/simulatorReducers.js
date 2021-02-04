import {
    RACE_LIST_REQUEST,
    RACE_LIST_SUCCESS,
    RACE_LIST_FAIL,
    SINGLE_RACE_REQUEST,
    SINGLE_RACE_SUCCESS,
    SINGLE_RACE_FAIL,
    SINGLE_RACE_RESET,
    CREATE_STARTLIST_REQUEST,
    CREATE_STARTLIST_SUCCESS,
    CREATE_STARTLIST_FAIL,
    CREATE_RESULTINFO_REQUEST,
    CREATE_RESULTINFO_SUCCESS,
    CREATE_RESULTINFO_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
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

export const startInfoReducer = (state = { startListInfo: {} }, action) => {
    switch (action.type) {
        case CREATE_STARTLIST_REQUEST:
            return { loading: true, ...state }
        case CREATE_STARTLIST_SUCCESS:
            return { loading: false, startListInfo: action.payload }
        case CREATE_STARTLIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const resultInfoReducer = (state = { resultListInfo: {} }, action) => {
    switch (action.type) {
        case CREATE_RESULTINFO_REQUEST:
            return { loading: true, ...state }
        case CREATE_RESULTINFO_SUCCESS:
            return { loading: false, resultListInfo: action.payload }
        case CREATE_RESULTINFO_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { loading: true }
        case LOGIN_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case LOGIN_FAIL:
            return { loading: false, error: action.payload }
        case LOGOUT:
            return {}
        default:
            return state
    }
}