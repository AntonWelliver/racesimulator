import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { raceListReducer, singleRaceInfoReducer, startInfoReducer, resultInfoReducer, userLoginReducer } from './reducers/simulatorReducers'

const reducer = combineReducers({
    raceList: raceListReducer,
    singleRaceInfo: singleRaceInfoReducer,
    startInfo: startInfoReducer,
    resultInfo: resultInfoReducer,
    userLogin: userLoginReducer
})

const startlistFromStorage = sessionStorage.getItem('startlist') ? JSON.parse(sessionStorage.getItem('startlist')) : {}

const userInfoFromStorage = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null

const initialState = {
    startInfo: { startListInfo: startlistFromStorage },
    userLogin: { userInfo: userInfoFromStorage }
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store