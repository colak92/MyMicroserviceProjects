import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplicantProfile } from "../../ReduxToolkit/ApplicantSlice";
import CompleteApplicantProfile from "../Applicant/CompleteApplicantProfile";

const RequireApplicantProfile = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const applicantDetails = useSelector(
    (state) => state.applicant.applicantDetails
  );
  const [openCompleteProfile, setOpenCompleteProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (user?.role === "ROLE_APPLICANT") {
        try {
          const profile = await dispatch(fetchApplicantProfile()).unwrap();
          console.log("✅ Profile fetched:", profile);
          if (!profile?.resumeUrl) {
            console.log("⚠️ Resume missing. Forcing profile completion modal.");
            setOpenCompleteProfile(true);
          } else {
            console.log("✅ Resume exists. No need for modal.");
            setOpenCompleteProfile(false);
          }
        } catch (err) {
          console.error("❌ Error fetching profile:", err);
          if (err?.response?.status === 404) {
            setOpenCompleteProfile(true);
          }
        }
      }
    };

    if (user) {
      checkProfile();
    }
  }, [user, dispatch]);

  useEffect(() => {
    console.log("🔍 User:", user);
    console.log("🔍 Applicant details from Redux:", applicantDetails);
    console.log("🔍 Modal open state:", openCompleteProfile);
  }, [user, applicantDetails, openCompleteProfile]);

  // Prevent page scroll while modal is open
  useEffect(() => {
    if (openCompleteProfile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openCompleteProfile]);

  return (
    <>
      {children}
      <CompleteApplicantProfile open={openCompleteProfile} />
    </>
  );
};

export default RequireApplicantProfile;