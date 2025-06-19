import { ThemeProvider } from '@emotion/react';
import { darkTheme } from './theme/darktheme';
import Navbar from './Page/Navbar/Navbar';
import Home from './Page/Home/Home';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './ReduxToolkit/AuthSlice';
import Auth from './Page/Auth/Auth';
import RequireApplicantProfile from './Page/Home/RequireApplicantProfile';

function App() {
  const dispatch = useDispatch();
  const jwt = useSelector((state) => state.auth.jwt);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const token = jwt || localStorage.getItem('jwt');

    if (token) {
      dispatch(getUserProfile(token))
        .unwrap()
        .catch((err) => {
          console.error('Failed to fetch user profile:', err.message);
          localStorage.removeItem('jwt');
        });
    }
  }, [dispatch, jwt]);

  const isApplicant = user?.role === 'ROLE_APPLICANT';

  return (
    <ThemeProvider theme={darkTheme}>
      {user ? (
        <>
          <Navbar />
          {isApplicant ? (
            <RequireApplicantProfile>
              <Home />
            </RequireApplicantProfile>
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