import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import CompanySlice from "./CompanySlice";
import JobSlice from "./JobSlice";
import ApplicantSlice from "./ApplicantSlice";
import JobApplicationSlice from "./JobApplicationSlice";

const rootReducer = combineReducers({
    auth:AuthSlice,
    company:CompanySlice,
    job: JobSlice,
    applicant: ApplicantSlice,
    jobApplication: JobApplicationSlice,
})

const store = configureStore({
    reducer:rootReducer,
    middleware:(getDefaultMiddleware) => getDefaultMiddleware()
})

export default store;