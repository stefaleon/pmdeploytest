import axios from 'axios';
import cookie from 'cookie';
import { API_URL } from 'config/index';

export default async (req, res) => {
  try {
    const axiosRes = await axios.post(`${API_URL}/auth/local`, req.body);
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', axiosRes.data.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 6, // 6 hours
        sameSite: 'strict',
        path: '/',
      })
    );
    res.status(200).json(axiosRes.data);
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: 'Login failed', error });
  }
};
