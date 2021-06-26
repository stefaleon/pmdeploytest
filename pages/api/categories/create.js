import axios from 'axios';
import cookie from 'cookie';
import { API_URL } from 'config/index';

export default async (req, res) => {
  const { token } = cookie.parse(req.headers.cookie);
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const axiosRes = await axios.post(
      `${API_URL}/task-categories`,
      req.body,
      authConfig
    );
    res.status(200).json(axiosRes.data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Create Category failed', error });
  }
};
