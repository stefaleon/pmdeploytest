import axios from 'axios';
import cookie from 'cookie';
import { API_URL } from 'config/index';

export default async (req, res) => {
  if (!req.headers.cookie) {
    res.status(401).json({ message: 'Not Authorized' });
    return;
  }

  console.log('cookie', req.headers.cookie);
  const { token } = cookie.parse(req.headers.cookie);

  try {
    const axiosRes = await axios.get(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.status(200).json({ user: axiosRes.data });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Not Authorized', error });
  }
};
