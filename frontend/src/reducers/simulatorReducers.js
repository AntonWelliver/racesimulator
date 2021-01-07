import { RACE_LIST_REQUEST, RACE_LIST_SUCCESS, RACE_LIST_FAIL } from '../constants/simulatorConstants'

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