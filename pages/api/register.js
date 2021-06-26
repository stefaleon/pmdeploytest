import axios from 'axios';
import { API_URL } from 'config/index';

export default async (req, res) => {
  try {
    const axiosRes = await axios.post(
      `${API_URL}/auth/local/register`,
      req.body
    );
    res.status(200).json(axiosRes.data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Register failed', error });
  }
};
