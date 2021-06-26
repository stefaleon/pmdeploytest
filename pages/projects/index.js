import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { useState, useEffect, useContext } from 'react';
import qs from 'qs';
import axios from 'axios';
import Link from 'next/link';
import { Jumbotron, Button, Toast, Card } from 'react-bootstrap';
import { API_URL, PAGINATION_LIMIT } from 'config/index';
import Loading from 'components/Loading';
import Layout from 'components/Layout';
import Search from 'components/Search';
import ProjectRow from 'components/ProjectRow';
import PaginationButtons from 'components/PaginationButtons';
import AuthContext from 'context/AuthContext';

export default function ProjectsPage({ projects, message, count, page, term }) {
  const { user } = useContext(AuthContext);

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, [message]);

  if (!user) {
    return null;
  }

  return (
    <Layout title="Projects">
      <Jumbotron>
        <Card className="p-2">
          <div className="jumbo_content">
            <Link href="/projects/create">
              <Button variant="outline-primary" block>
                <i className="fas fa-plus mr-2"></i> New Project
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-2">
          <Search collection="projects" />
        </Card>

        <Card className="p-2">
          <PaginationButtons
            count={count}
            page={page}
            term={term}
            collection="projects"
          />
        </Card>

        <Card className="p-2">
          {!projects ? (
            <>
              <div className="message_container">
                <Toast
                  onClose={() => setShow(false)}
                  show={show}
                  delay={5000}
                  autohide
                >
                  <Toast.Header>
                    <strong className="mr-auto">Message</strong>
                  </Toast.Header>
                  <Toast.Body>{message}</Toast.Body>
                </Toast>
              </div>
              <Loading />
            </>
          ) : projects?.length === 0 ? (
            <h2>No projects found</h2>
          ) : (
            <div>
              {projects.map((p) => (
                <ProjectRow key={p.id} p={p} />
              ))}
            </div>
          )}
        </Card>
      </Jumbotron>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const searchQuery = qs.stringify({
    _where: {
      _or: [
        { name_contains: context.query.term },
        { description_contains: context.query.term },
      ],
    },
  });

  const page = context.query.page;

  const start = !page ? 0 : +page === 1 ? 0 : (+page - 1) * PAGINATION_LIMIT;

  try {
    const { token } = cookie.parse(context.req.headers.cookie) || '';
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };
    // const currentUserId = jwt.decode(token).id;

    // const axiosRes = await axios.get(
    //   `${API_URL}/projects?_where[users.id_in]=${currentUserId}&${searchQuery}&_start=${start}&_limit=${PAGINATION_LIMIT}`,
    //   authConfig
    // );
    const axiosRes = await axios.get(
      `${API_URL}/projects?${searchQuery}&_start=${start}&_limit=${PAGINATION_LIMIT}`,
      authConfig
    );

    // const axiosResForCount = await axios.get(
    //   `${API_URL}/projects?_where[users.id_in]=${currentUserId}&${searchQuery}`,
    //   authConfig
    // );
    const axiosResForCount = await axios.get(
      `${API_URL}/projects?${searchQuery}`,
      authConfig
    );

    return {
      props: {
        term: context.query.term || '',
        page: +page || 1,
        count: axiosResForCount.data.length,
        projects: axiosRes.data,
      },
    };
  } catch (error) {
    // console.log(error);
    return {
      props: { message: 'Error: Fetching projects failed' },
    };
  }
}
