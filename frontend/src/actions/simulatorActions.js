import axios from 'axios';
import {
    RACE_LIST_REQUEST,
    RACE_LIST_SUCCESS,
    RACE_LIST_FAIL,
    SINGLE_RACE_REQUEST,
    SINGLE_RACE_SUCCESS,
    SINGLE_RACE_FAIL,
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
