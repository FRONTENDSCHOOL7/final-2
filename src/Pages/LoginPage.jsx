/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-prototype-builtins */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
import { loginAPI } from 'API/User';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilStoreID, useRecoilValue } from 'recoil';
import accountname from 'Recoil/Accountname';
import { loginCheck } from 'Recoil/LoginCheck';
import loginToken from 'Recoil/LoginToken';
import { styled } from 'styled-components';

export default function LoginPage() {
  const navigate = useNavigate();
  const [userErrorMessage, setUserErrorMessage] = useState([]);
  const [errorMessage, setErrorMessage] = useState([]);
  const [isLoginCheck, setIsLoginCheck] = useRecoilState(loginCheck);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useRecoilState(loginToken);
  // const [token, setToken] = useRecoilState(loginToken);

  // const [loginData, setLoginData] = useState({
  //   user: {
  //     email: '',
  //     password: '',
  //   },
  // });

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setLoginData((prevState) => ({
  //     ...prevState,
  //     user: {
  //       ...prevState.user,
  //       [name]: value,
  //     },
  //   }));
  // };

  const emailInputChange = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const passwordInputChange = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const loginData = {
    user: {
      email: email,
      password: password,
    },
  };

  const handleLogin = async () => {
    //   try {
    //     const reqUrl = 'https://api.mandarin.weniv.co.kr/user/login';
    //     const response = await axios.post(reqUrl, loginData, {
    //       headers: {
    //         'Content-type': 'application/json',
    //       },
    //     });

    //     if (response.data && response.data.user && response.data.user.token) {
    //       const newToken = response.data.user.token;
    //       setIsLoginCheck(true);
    //       setToken(newToken);
    //       localStorage.setItem('userToken', newToken);
    //     } else {
    //       setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }

    const response = await loginAPI(loginData);
    if (response && response.hasOwnProperty('user')) {
      const newToken = response.user.token;
      setIsLoginCheck(true);
      setToken(newToken);
      localStorage.setItem('userToken', newToken);
      navigate('/mainpage');
    } else if (response.status === 422) {
      setErrorMessage('이메일또는 비밀번호가 일치하지 않습니다.');
    } else {
      const errorMessage = response && response.message ? response.message : handleError();
      setErrorMessage(errorMessage);
    }
  };

  useEffect(() => {
    if (isLoginCheck) {
      navigate('/mainpage');
    }
  }, [token]);

  const handleError = () => {
    const errors = [];
    if (email === '') {
      errors.push('이메일을 입력해주세요');
    } else if (password === '') {
      errors.push('비밀번호를 입력해주세요');
    } else {
      errors.push('');
      handleLogin();
    }
    setUserErrorMessage(errors);
  };

  return (
    <>
      <h2>로그인페이지</h2>
      <InputDiv>
        <Label htmlFor='emailInput'>이메일</Label>
        <InputBox
          type='email'
          id='emailInput'
          name='email'
          placeholder='이메일 입력'
          onChange={emailInputChange}
          value={loginData.user.email}
        />
        {userErrorMessage.includes('이메일을 입력해주세요') && (
          <ErrorMassage>{userErrorMessage}</ErrorMassage>
        )}
        {userErrorMessage.includes('이메일 형식이 올바르지 않습니다.') && (
          <ErrorMassage>{userErrorMessage}</ErrorMassage>
        )}
      </InputDiv>
      <InputDiv>
        <Label htmlFor='passwordInput'>비밀번호</Label>
        <InputBox
          type='password'
          name='password'
          id='passwordInput'
          placeholder='비밀번호를 설정해 주세요.'
          onChange={passwordInputChange}
          value={loginData.user.password}
        />
        {userErrorMessage.includes('비밀번호를 입력해주세요') && (
          <ErrorMassage>{userErrorMessage}</ErrorMassage>
        )}
      </InputDiv>
      {errorMessage && loginData.user.email && loginData.user.password && (
        <ErrorMassage>{errorMessage}</ErrorMassage>
      )}
      <ButtonDiv>
        <Button type='button' onClick={handleError}>
          로그인
        </Button>
      </ButtonDiv>
    </>
  );
}

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
`;

const H1 = styled.h1`
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
`;

const H2 = styled.div`
  img {
    height: 76px;
  }
`;

const Label = styled.label`
  font-family: var(--font--Bold);
  margin-bottom: 9px;
  font-weight: 700;
`;

const ButtonDiv = styled.div`
  margin-top: 166px;
`;

const ErrorMassage = styled.div`
  margin-top: 10px;
  color: red;
  font-size: 14px;
`;

const Button = styled.button`
  width: 200px;
  border: 1px solid black;
`;

const InputBox = styled.input`
  width: 300px;
`;
