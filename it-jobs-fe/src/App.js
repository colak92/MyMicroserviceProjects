import { ThemeProvider } from '@emotion/react';
import { darkTheme } from './theme/darktheme';
import Navbar from './Page/Navbar/Navbar';
import Home from './Page/Home/Home';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, logoutAndClearAllState } from './ReduxToolkit/AuthSlice';
import Auth from './Page/Auth/Auth';
import RequireApplicantProfile from './Page/Home/RequireApplicantProfile';
import RequireCompanyProfile from './Page/Home/RequireCompanyProfile';

function App() {
  const dispatch = useDispatch();
  const jwt = useSelector((state) => state.auth.jwt);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const token = jwt || localStorage.getItem('jwt');

    if (token) {
      dispatch(getUserProfile(token))
        .unwrap()
        .catch((error) => {
          console.error('Failed to fetch user profile: ', error.message);
          localStorage.removeItem('jwt');
          dispatch(logoutAndClearAllState()); // <-- Reset Redux on invalid token
        });
    } else {
      // No JWT found, ensure clean state
      dispatch(logoutAndClearAllState());
    }
  }, [dispatch, jwt]);

  const isApplicant = user?.role === 'ROLE_APPLICANT';
  const isCompany = user?.role === 'ROLE_COMPANY';

  return (
    <ThemeProvider theme={darkTheme}>
      {user ? (
        <>
          <Navbar />
          {isApplicant ? (
            <RequireApplicantProfile>
              <Home />
            </RequireApplicantProfile>
          ) : isCompany ? (
            <RequireCompanyProfile>
              <Home />
            </RequireCompanyProfile>
          ) : (
            <Home />
          )}
        </>
      ) : (
        <Auth />
      )}
    </ThemeProvider>
  );
}

export default App;
