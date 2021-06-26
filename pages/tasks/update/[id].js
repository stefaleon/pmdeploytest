import axios from 'axios';
import cookie from 'cookie';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Jumbotron, Button, Toast, Card, Form } from 'react-bootstrap';
import Loading from 'components/Loading';
import Layout from 'components/Layout';
import { API_URL } from 'config/index';
import AuthContext from 'context/AuthContext';
import AppContext from 'context/AppContext';
import TaskForm from 'components/TaskForm';

export default function TaskUpdatePage({ t, categories, message }) {
  const { user } = useContext(AuthContext);
  const { updateTask, deleteTask } = useContext(AppContext);
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [problemWithPut, setProblemWithPut] = useState('');
  const [values, setValues] = useState({
    name: t?.name || '',
    duration: t?.duration || 0,
    duration_unit: t?.duration_unit || 'Hours ',
    task_category: t?.task_category || { id: 0 },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShow(true);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('values before PUT:', values);
      setLoading(true);
      const task = await updateTask(t.id, values);
      if (task) {
        setLoading(false);
        router.reload();
      }
    } catch (error) {
      setProblemWithPut('Error: Form data submission failed');
      setTimeout(() => {
        setProblemWithPut('');
      }, 3000);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('This task will be permanently deleted')) {
      console.log('delete task');
      setLoading(true);
      const deletedTask = await deleteTask(t.id);
      if (deletedTask) {
        setLoading(false);
        router.push('/tasks');
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout title="Edit Task">
      <Jumbotron>
        <Card className="p-2">
          <div className="jumbo_content">
            <Button variant="outline-secondary" block>
              <h2>
                <i className="fas fa-dot-circle mr-2"></i> {t?.name}
              </h2>
            </Button>
          </div>
        </Card>

        {!t ? (
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
        ) : (
          <div className="two_columns_grid">
            <Card>
              <Form.Group>
                <Form.Label>Delete This Task</Form.Label>
                <Button
                  variant="danger"
                  type="button"
                  block
                  size="lg"
                  onClick={handleDelete}
                >
                  Delete Task
                </Button>
              </Form.Group>
            </Card>
            <Card>
              {problemWithPut && (
                <>
                  <div className="message_container">
                    <Toast>
                      <Toast.Body>
                        <div className="color_red">{problemWithPut}</div>
                      </Toast.Body>
                    </Toast>
                  </div>
                </>
              )}
              {loading && (
                <Card className="p-2">
                  <Loading />
                </Card>
              )}
              <TaskForm
                categories={categories}
                values={values}
                setValues={setValues}
                handleSubmit={handleSubmit}
              />
            </Card>
          </div>
        )}
      </Jumbotron>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const { token } = cookie.parse(context.req.headers.cookie) || '';
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    const taskRes = await axios.get(
      `${API_URL}/tasks/${context.params.id}`,
      authConfig
    );

    // Fetch all the task categories
    const taskCategoriesRes = await axios.get(
      `${API_URL}/task-categories`,
      authConfig
    );

    return {
      props: {
        t: taskRes.data || {},
        categories: taskCategoriesRes.data || [],
      },
    };
  } catch (error) {
    console.log(error.message);
    return {
      props: { message: 'Error: Fetching task data failed' },
    };
  }
}
