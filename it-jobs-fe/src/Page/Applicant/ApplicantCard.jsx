import React, { useState } from 'react';
import ApplicantList from './ApplicantList';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ApplicantCard = ({ item, disableApplicantList = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [openApplicantList, setOpenApplicantList] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // applicant list
  const handleCloseApplicantList = () => {
    setOpenApplicantList(false);
  };

  return (
    <div>
      <div className="card lg:flex justify-between w-full">
        <div className="lg:flex gap-5 items-center space-y-2 w-full">
          <div className="space-y-5 flex-1">
            <div className="space-y-2">
              <h1 className="font-bold text-lg">{item.name}</h1>

              <p
                className="text-amber-700 text-sm"
                data-testid="applicantEmail"
              >
                <span
                  style={{ color: 'rgb(77, 127, 208)' }}
                  className="font-semibold"
                >
                  Email:
                </span>{' '}
                {item.email}
              </p>

              <p
                className="text-amber-700 text-sm"
                data-testid="applicantResumeUrl"
              >
                <span
                  style={{ color: 'rgb(77, 127, 208)' }}
                  className="font-semibold"
                >
                  Resume:
                </span>{' '}
                {item.resumeUrl}
              </p>

              <p
                className="text-amber-700 text-sm"
                data-testid="applicantSkills"
              >
                <span
                  style={{ color: 'rgb(77, 127, 208)' }}
                  className="font-semibold"
                >
                  Skills:
                </span>{' '}
                {item.skills}
              </p>
            </div>
          </div>
        </div>
        <div>
          <IconButton
            id="basic-button"
            title="More options"
            aria-controls={openMenu ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
          >
            <MenuItem>Edit</MenuItem>
          </Menu>
        </div>
      </div>

      {!disableApplicantList && (
        <ApplicantList
          open={openApplicantList}
          handleClose={handleCloseApplicantList}
        />
      )}
    </div>
  );
};

export default ApplicantCard;
