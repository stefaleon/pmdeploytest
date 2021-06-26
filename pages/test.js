import qs from 'qs';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { API_URL } from '/config/index';
import Layout from '/components/Layout';

export default function test({ projects, message }) {
  return (
    <Layout>
      <Card>{message}</Card>
      <Card>
        <h1>Projects where user 1 exists in users_permissions_users</h1>

        {projects?.map((p) => (
          <Card>{p.name}</Card>
        ))}
      </Card>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const axiosRes = await axios.get(
      `${API_URL}/projects?_where[users_permissions_users.id_in]=1`
    );
    console.log(axiosRes.data);
    return {
      props: {
        projects: axiosRes.data || [],
      },
    };
  } catch (error) {
    // console.log(error);
    return {
      props: { message: 'Error: Fetching projects failed' },
    };
  }
}
