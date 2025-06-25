import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchAllApplicants } from '../../ReduxToolkit/ApplicantSlice';
import ApplicantCard from './ApplicantCard';
import { Box, Modal, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  overflowY: 'auto',
};

const ApplicantList = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);

  const applicants = useSelector((store) => store.applicant.applicants);
  const loading = useSelector((store) => store.applicant.loading);
  const error = useSelector((store) => store.applicant.error);

  useEffect(() => {
    if (open && auth.user?.role === 'ROLE_APPLICANT') {
      dispatch(fetchAllApplicants());
    }
  }, [dispatch, open, auth.user?.role]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" gutterBottom>
          Applicant List
        </Typography>

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {!loading && applicants.length === 0 && (
          <Typography>No applicants available.</Typography>
        )}

        {!loading &&
          applicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              item={applicant}
              disableApplicantList={true}
            />
          ))}

        <Box mt={2} display="flex" justifyContent="flex-end">
          <button onClick={handleClose}>Close</button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ApplicantList;
