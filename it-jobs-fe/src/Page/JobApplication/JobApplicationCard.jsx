import { Typography } from "@mui/material";
import React, { useState } from "react";
import dayjs from "dayjs";
import { JOB_APPLICATION_STATUS_OPTIONS } from "../../constants/jobApplicationStatus";
import JobApplicationList from "./JobApplicationList";
import { useSelector } from "react-redux";

const JobApplicationCard = ({ item, disableJobApplicationList = false }) => {
  const getStatusLabel = (value) =>
    JOB_APPLICATION_STATUS_OPTIONS.find((option) => option.value === value)
      ?.label || value;

  // job application list
  const [openJobApplicationList, setOpenJobApplicationList] = useState(false);
  const handleCloseJobApplicationList = () => {
    setOpenJobApplicationList(false);
  };

  const applicants = useSelector((state) => state.applicant.applicants);
  const jobs = useSelector((state) => state.job.jobs);

  const applicant = applicants.find((a) => a.id === item.applicantId);
  const job = jobs.find((j) => j.id === item.jobId);

  return (
    <div>
      <div className="card lg:flex justify-between w-full">
        <div className="lg:flex gap-5 items-center space-y-2 w-full">
          <div className="space-y-5 flex-1">
            <div className="space-y-2">
              <p
                className="text-amber-700 text-sm"
                data-testid="jobApplicationStatus"
              >
                <span
                  style={{ color: "rgb(77, 127, 208)" }}
                  className="font-semibold"
                >
                  Status:
                </span>{" "}
                {getStatusLabel(item.status)}
              </p>

              <p className='text-amber-700 text-sm' data-testid="applicantName">
                <span style={{ color: 'rgb(77, 127, 208)' }} className="font-semibold">Applicant:</span> {applicant?.name || "Unknown"}
              </p>

              <p className='text-amber-700 text-sm' data-testid="jobName">
                <span style={{ color: 'rgb(77, 127, 208)' }} className="font-semibold">Job:</span> {job?.name || "Unknown"}
              </p>

              <Typography variant="body2" className="text-amber-700">
                <span
                  style={{ color: "rgb(77, 127, 208)" }}
                  className="font-semibold"
                >
                  Cover Letter:
                </span>{" "}
                {item.coverLetter}
              </Typography>

              <p
                className="text-amber-700 text-sm"
                data-testid="jobApplicationApplied"
              >
                <span
                  style={{ color: "rgb(77, 127, 208)" }}
                  className="font-semibold"
                >
                  Applied:
                </span>{" "}
                {dayjs(item.appliedDate).format("MMMM D, YYYY")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!disableJobApplicationList && (
        <JobApplicationList
          open={openJobApplicationList}
          handleClose={handleCloseJobApplicationList}
        />
      )}
    </div>
  );
};

export default JobApplicationCard;
