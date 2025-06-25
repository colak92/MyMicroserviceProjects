import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createApplicant,
  updateApplicant,
  fetchApplicantProfile,
} from '../../ReduxToolkit/ApplicantSlice';
import { Box, Modal } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  outline: 'none',
  boxShadow: 24,
  p: 4,
};

const CompleteApplicantProfile = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const applicantDetails = useSelector(
    (state) => state.applicant.applicantDetails
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setName(applicantDetails?.name || '');
    setEmail(applicantDetails?.email || '');
    setResumeUrl(applicantDetails?.resumeUrl || '');
    setSkills(applicantDetails?.skills || '');
  }, [applicantDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const applicantData = {
        userId: user.id,
        name,
        email,
        resumeUrl,
        skills,
      };

      if (applicantDetails?.id) {
        await dispatch(
          updateApplicant({
            id: applicantDetails.id,
            updatedApplicantData: applicantData,
          })
        ).unwrap();
      } else {
        await dispatch(createApplicant({ applicantData })).unwrap();
      }

      await dispatch(fetchApplicantProfile());
      onClose();
    } catch (error) {
      console.error('Error saving profile: ', error.message);
      setError(error.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="complete-profile-modal"
      aria-describedby="complete-profile-form"
    >
      <Box sx={style}>
        <div className="max-w-lg mx-auto p-6 rounded shadow-md">
          <h2 id="complete-profile-modal" className="text-2xl mb-4">
            Complete Your Applicant Profile
          </h2>
          <form onSubmit={handleSubmit} id="complete-profile-form">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 font-semibold">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full border rounded p-2 bg-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border rounded p-2 bg-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="resumeUrl" className="block mb-1 font-semibold">
                Resume URL
              </label>
              <input
                id="resumeUrl"
                type="text"
                className="w-full border rounded p-2 bg-gray-500"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="skills" className="block mb-1 font-semibold">
                Skills (comma separated)
              </label>
              <input
                id="skills"
                type="text"
                className="w-full border rounded p-2 bg-gray-500"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
            </div>
            {error && <p className="mb-4 text-red-600">{error}</p>}
            <div className="flex justify-between items-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 text-sm ml-4"
              >
                Close without saving
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default CompleteApplicantProfile;
