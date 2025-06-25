import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllJobs } from '../../ReduxToolkit/JobSlice';
import JobCard from './JobCard';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.job.jobs);

  const job = jobs.find((j) => j.id === Number(jobId));

  useEffect(() => {
    if (!jobs.length) {
      dispatch(fetchAllJobs());
    }
  }, [dispatch, jobs.length]);

  if (!job) return <div className="p-5">Loading job details...</div>;

  return (
    <div className="p-5">
      <JobCard item={job} disableJobList={true} />
    </div>
  );
};

export default JobDetailsPage;
