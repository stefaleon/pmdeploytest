import cookie from 'cookie';
import { useState, useEffect, useContext } from 'react';
import qs from 'qs';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Jumbotron, Button, Toast, Card, Form } from 'react-bootstrap';
import { API_URL, PAGINATION_LIMIT } from 'config/index';
import Loading from 'components/Loading';
import Layout from 'components/Layout';
import TaskFilters from 'components/TaskFilters';
import TaskRow from 'components/TaskRow';
import PaginationButtons from 'components/PaginationButtons';
import AuthContext from 'context/AuthContext';

export default function TasksPage({
  tasks,
  message,
  count,
  page,
  term,
  cat,
  taskCategories,
}) {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, [message]);

  if (!user) {
    return null;
  }

  return (
    <Layout title="Tasks">
      <Jumbotron>
        <Card className="p-2">
          <div className="jumbo_content">
            <Link href="/tasks/create">
              <Button variant="outline-primary" block>
                <i className="fas fa-plus mr-2"></i> New Task
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-2">
          <TaskFilters taskCategories={taskCategories} cat={cat} />
        </Card>

        <Card className="p-2">
          <PaginationButtons
            count={count}
            page={page}
            term={term}
            collection="tasks"
          />
        </Card>

        <Card className="p-2">
          {!tasks ? (
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
          ) : tasks?.length === 0 ? (
            <h2>No tasks found</h2>
          ) : (
            <div>
              {tasks.map((t) => (
                <TaskRow key={t.id} t={t} />
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
    _where: { name_contains: context.query.term },
  });

  const page = context.query.page;
  const start = !page ? 0 : +page === 1 ? 0 : (+page - 1) * PAGINATION_LIMIT;

  try {
    const { token } = cookie.parse(context.req.headers.cookie) || '';
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    // axios request depends on whether 'cat' is found in the frontend query
    // Fetch all the tasks
    const axiosRes = context.query.cat
      ? await axios.get(
          `${API_URL}/tasks?task_category=${context.query.cat}&${searchQuery}&_start=${start}&_limit=${PAGINATION_LIMIT}`,
          authConfig
        )
      : await axios.get(
          `${API_URL}/tasks?${searchQuery}&_start=${start}&_limit=${PAGINATION_LIMIT}`,
          authConfig
        );

    const axiosResForCount = await axios.get(
      `${API_URL}/tasks?${searchQuery}`,
      authConfig
    );

    // Fetch all the task categories
    const taskCategoriesRes = await axios.get(
      `${API_URL}/task-categories`,
      authConfig
    );

    return {
      props: {
        cat: context.query.cat || '',
        term: context.query.term || '',
        page: +page || 1,
        count: axiosResForCount.data.length,
        tasks: axiosRes.data,
        taskCategories: taskCategoriesRes.data || [],
      },
    };
  } catch (error) {
    // console.log(error);
    return {
      props: { message: 'Error: Fetching data failed' },
    };
  }
}
