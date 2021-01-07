import axios from 'axios';
import {
    RACE_LIST_REQUEST,
    RACE_LIST_SUCCESS,
    RACE_LIST_FAIL,
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
