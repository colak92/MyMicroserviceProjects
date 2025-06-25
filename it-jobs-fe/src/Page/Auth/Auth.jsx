import React, { useState } from 'react';
import './Auth.css';
import Signin from './Signin';
import Signup from './Signup';

const Auth = () => {
  const [isRegistered, setIsRegistered] = useState(false);

  const togglePanel = () => {
    setIsRegistered(!isRegistered);
  };

  return (
    <div className="flex justify-center h-screen items-center overflow-hidden">
      <div className="box max-w-4xl">
        <div className="forms h-full">
          <div className="form-content h-full">
            <div
              className="login-form"
              style={{
                display: isRegistered ? 'none' : 'block',
                width: '100%',
              }}
            >
              <Signin togglePanel={togglePanel} />
            </div>
            <div
              className="signup-form"
              style={{
                display: isRegistered ? 'block' : 'none',
                width: '100%',
              }}
            >
              <Signup togglePanel={togglePanel} />
            </div>
          </div>
        </div>

        <div className={`cover ${isRegistered ? 'rotate-active' : ''}`}>
          <div className="front">
            <img
              className="img"
              src="https://st5.depositphotos.com/23188010/77062/i/450/depositphotos_770624600-stock-photo-green-field-morning-render-illustration.jpg"
              alt="Success"
            />
            <div className="text">
              <span className="text-login">
                Success is built upon well paid jobs
              </span>
              <span className="text-login2 text-xs">Let's get connected</span>
            </div>
          </div>
          <div className="back">
            <img
              className="img"
              src="https://sb.ecobnb.net/app/uploads/sites/3/2020/01/nature.jpg"
              alt="Join us"
            />
            <div className="text">
              <span className="text-signup">
                Join us and start your journey
              </span>
              <span className="text-signup2 text-xs">
                Create your account now
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
