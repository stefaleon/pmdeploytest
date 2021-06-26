import axios from 'axios';
import cookie from 'cookie';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Jumbotron, Toast, Card, Button, Form } from 'react-bootstrap';
import Loading from 'components/Loading';
import Layout from 'components/Layout';
import { API_URL } from 'config/index';
import ProjectUpdateForm from 'components/ProjectUpdateForm';
import AppContext from 'context/AppContext';
import AuthContext from 'context/AuthContext';

export default function ProjectUpdatePage({ p, message }) {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const { updateProject } = useContext(AppContext);

  const [show, setShow] = useState(false);
  const [problemWithPut, setProblemWithPut] = useState('');
  const [values, setValues] = useState({
    name: p?.name || '',
    description: p?.description || '',
    comments: p?.comments || '',
    deadline: p?.deadline || '',
    started_at: p?.started_at || '',
    completed_at: p?.completed_at || '',
  });

  useEffect(() => {
    setShow(true);
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
    create the update object with the available values
    we cannot pass the values object directly
    because when the dates are not set
    the invalid date formats cause errors
    */
    const updateObject = {
      name: values.name,
      description: values.description,
      comments: values.comments,
    };
    if (values.deadline) updateObject.deadline = values.deadline;
    if (values.started_at) updateObject.started_at = values.started_at;
    if (values.completed_at) updateObject.completed_at = values.completed_at;
    console.log('updateObject', updateObject);
    try {
      console.log('values before PUT:', values);
      const project = await updateProject(p.id, updateObject);
      router.push(`/projects/${project.id}`);
    } catch (error) {
      setProblemWithPut('Error: Form data submission failed');
      setTimeout(() => {
        setProblemWithPut('');
      }, 3000);
    }
  };

  const setTasks = () => {
    console.log('manage tasks');
    router.push(`/projects/update/tasks/${p.id}`);
  };

  const setMembers = () => {
    console.log('manage members');
    router.push(`/projects/update/members/${p.id}`);
  };

  const setUsers = () => {
    console.log('manage users');
    router.push(`/projects/update/users/${p.id}`);
  };

  const deleteProject = () => {
    if (window.confirm('This project will be permanently deleted')) {
      console.log('delete project');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout title="Edit Project">
      <Jumbotron>
        <Card className="p-2">
          <div className="jumbo_content">
            <Link href={`/projects/${p?.id}`}>
              <Button variant="outline-secondary" block>
                <h2>
                  <i className="fas fa-project-diagram mr-2"></i> {p?.name}
                </h2>
              </Button>
            </Link>
          </div>
        </Card>

        {!p ? (
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
                <Form.Label>Manage Project Tasks</Form.Label>
                <Button
                  variant="secondary"
                  type="button"
                  block
                  size="lg"
                  onClick={setTasks}
                >
                  Tasks
                </Button>
              </Form.Group>
              <Form.Group>
                <Form.Label>Manage Project Members</Form.Label>
                <Button
                  variant="secondary"
                  type="button"
                  block
                  size="lg"
                  onClick={setMembers}
                >
                  Members
                </Button>
              </Form.Group>

              <Form.Group>
                <Form.Label>Manage Project Users</Form.Label>
                <Button
                  variant="warning"
                  type="button"
                  block
                  size="lg"
                  onClick={setUsers}
                >
                  Users
                </Button>
              </Form.Group>

              <Form.Group>
                <Form.Label htmlFor="description">
                  Current Project Users
                </Form.Label>
                <Card>
                  {p.users.map((u) => (
                    <span key={u.id}>{u.email}</span>
                  ))}
                </Card>
              </Form.Group>

              <Form.Group>
                <Form.Label>Delete This Project</Form.Label>
                <Button
                  variant="danger"
                  type="button"
                  block
                  size="lg"
                  onClick={deleteProject}
                >
                  Delete Project
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
              <ProjectUpdateForm
                projectId={p.id}
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

    const projectRes = await axios.get(
      `${API_URL}/projects/${context.params.id}`,
      authConfig
    );

    return {
      props: {
        p: projectRes.data || '',
      },
    };
  } catch (error) {
    // console.log(error);
    return {
      props: { message: 'Error: Fetching project data failed' },
    };
  }
}
