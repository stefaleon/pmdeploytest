import axios from 'axios';
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NEXT_URL } from 'config/index';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const register = async (user) => {
    try {
      await axios.post(`${NEXT_URL}/api/register`, user);
      setMessage('Registration Success. Proceed to Login.');
      setTimeout(() => {
        setMessage(null);
        router.push('/login');
      }, 5000);
    } catch (error) {
      setError('Registration Failed');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const login = async ({ email: identifier, password }) => {
    try {
      const res = await axios.post(`${NEXT_URL}/api/login`, {
        identifier,
        password,
      });
      setUser(res.data.user);
      router.push('/projects');
    } catch (error) {
      console.log(error.message);
      setError('Login Failed');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const PROTECTED_ROUTES = [
    '/projects',
    '/projects/[id]',
    '/projects/create',
    '/projects/update/[id]',
    '/projects/update/tasks/[id]',
    '/projects/update/members/[id]',
    '/projects/update/users/[id]',
    '/manage_assigned_task/[id]',
    '/categories',
    '/categories/[id]',
    '/categories/create',
  ];

  const checkUser = async () => {
    try {
      const res = await axios.get(`${NEXT_URL}/api/user`);
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
      setUser(null);
      if (PROTECTED_ROUTES.includes(router.pathname)) {
        router.push('/login');
      }
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${NEXT_URL}/api/logout`);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.log(error);
      router.push('/error');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, error, register, login, logout, setError, message }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
