import cookie from 'cookie';
import axios from 'axios';
import { API_URL } from 'config/index';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Jumbotron, Toast, Card } from 'react-bootstrap';
import Layout from 'components/Layout';
import TaskForm from 'components/TaskForm';
import Loading from 'components/Loading';
import AppContext from 'context/AppContext';
import AuthContext from 'context/AuthContext';

export default function TaskCreatePage({ categories }) {
  const { user } = useContext(AuthContext);
  const { createTask } = useContext(AppContext);
  const router = useRouter();

  const [problemWithPost, setProblemWithPost] = useState('');
  const [values, setValues] = useState({
    name: '',
    duration: 0,
    duration_unit: 'Hours',
    task_category: { id: 0 },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('TCRP', categories);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.name.trim() === '') {
      setProblemWithPost('Please provide a name for the task');
      setTimeout(() => {
        setProblemWithPost('');
      }, 3000);
      return;
    }

    try {
      console.log('values before POST:', values);
      setLoading(true);
      const task = await createTask(values);
      if (task) {
        console.log('task created:', task);
        setLoading(false);
        router.push(`/tasks/update/${task.id}`);
      }
    } catch (error) {
      setProblemWithPost('Error: Form data submission failed');
      setTimeout(() => {
        setProblemWithPost('');
      }, 3000);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout title="New Task">
      <Jumbotron>
        <Card className="p-2">
          <Card.Body>
            <div className="jumbo_content">
              <h1>
                <i className="far fa-dot-circle fa-lg mr-2"></i> New Task
              </h1>
            </div>
          </Card.Body>
        </Card>

        <Card className="p-2">
          <div className="grid_20_60">
            <div id="placeholder20"></div>
            <Card>
              {problemWithPost && (
                <div className="message_container">
                  <Toast>
                    <Toast.Body>
                      <div className="color_red">{problemWithPost}</div>
                    </Toast.Body>
                  </Toast>
                </div>
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
        </Card>
      </Jumbotron>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const { token } = cookie.parse(context.req.headers.cookie) || '';
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch all the task categories
    const taskCategoriesRes = await axios.get(
      `${API_URL}/task-categories`,
      authConfig
    );

    return {
      props: {
        categories: taskCategoriesRes.data || [],
      },
    };
  } catch (error) {
    console.log(error.message);
    return {
      props: { message: 'Error: Fetching data failed' },
    };
  }
}
