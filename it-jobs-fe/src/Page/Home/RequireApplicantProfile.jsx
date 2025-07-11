import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicantProfile } from '../../ReduxToolkit/ApplicantSlice';
import CompleteApplicantProfile from '../Applicant/CompleteApplicantProfile';

const RequireApplicantProfile = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [openCompleteProfile, setOpenCompleteProfile] = useState(false);

  // TODO Logic
  useEffect(() => {
    const checkProfile = async () => {
      if (user?.role === 'ROLE_APPLICANT') {
        try {
          const profile = await dispatch(fetchApplicantProfile()).unwrap();
          if (!profile?.resumeUrl) {
            console.log('⚠️ Missing applicant resume. Forcing profile completion modal.');
            setOpenCompleteProfile(true);
          } else {
            console.log('✅ Applicant profile exists.');
            setOpenCompleteProfile(false);
          }
        } catch (error) {
          console.error('❌ Error fetching profile: ', error.message);
          if (error?.response?.status === 404) {
            setOpenCompleteProfile(true);
          }
        }
      }
    };

    if (user) {
      checkProfile();
    }
  }, [user, dispatch]);

  // Prevent page scroll while modal is open
  useEffect(() => {
    if (openCompleteProfile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openCompleteProfile]);

  return (
    <>
      {children}
      <CompleteApplicantProfile open={openCompleteProfile} onClose={() => setOpenCompleteProfile(false)}/>
    </>
  );
};

export default RequireApplicantProfile;
