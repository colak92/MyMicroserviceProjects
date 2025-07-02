import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanyProfile } from '../../ReduxToolkit/CompanySlice';
import CompleteCompanyProfile from '../Company/CompleteCompanyProfile';

const RequireCompanyProfile = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const companyDetails = useSelector((state) => state.company.companyDetails);
  const isFetched = useSelector((state) => state.company.isFetched);
  const [openCompleteProfile, setOpenCompleteProfile] = useState(false);

  // Fetch company profile once
  useEffect(() => {
    if (user?.role === 'ROLE_COMPANY' && !isFetched) {
      dispatch(fetchCompanyProfile());
    }
  }, [user, isFetched, dispatch]);

  // TODO Logic
  useEffect(() => {
    if (user?.role === 'ROLE_COMPANY' && isFetched) {
      if (!companyDetails?.name) {
        console.log('⚠️ Missing company name. Forcing company completion modal.');
        setOpenCompleteProfile(true);
      } else {
        console.log('✅ Company profile exists.');
        setOpenCompleteProfile(false);
      }
    }
  }, [user, isFetched, companyDetails]);

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
      <CompleteCompanyProfile
        open={openCompleteProfile}
        onClose={() => setOpenCompleteProfile(false)}
      />
    </>
  );
};

export default RequireCompanyProfile;
