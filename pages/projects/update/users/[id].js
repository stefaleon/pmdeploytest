import axios from 'axios';
import cookie from 'cookie';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '/config/index';
import { Jumbotron, Card, Button, Form } from 'react-bootstrap';
import Layout from '/components/Layout';
import Loading from 'components/Loading';
import AuthContext from 'context/AuthContext';
import AppContext from 'context/AppContext';

export default function updateTheUsersOfTheProject({ users, project }) {
  const { user } = useContext(AuthContext);
  const { updateProject } = useContext(AppContext);

  const router = useRouter();
  const [selectedUsers, setSelectedUsers] = useState(project?.users || []);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ email: '' });

  // this is for development
  useEffect(() => {
    console.log('project', project);
    console.log('users', users);
    console.log('selectedUsers', selectedUsers);
  }, [selectedUsers]);

  const cancel = () => {
    router.push(`/projects/update/  ${project.id}`);
  };

  const handleInputChange = (e) => {
    setNewUser({ email: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newUser);
    // console.log(users);
    // console.log(users[0].email);
    // console.log(users[0].email === newUser.email);
    try {
      //find in users the the user with this email
      const user = users.find((u) => u.email === newUser.email);
      console.log('found', user);
      if (user) {
        // check if already selected
        if (selectedUsers.find((u) => u.id === user.id)) {
          console.log('already selected');
          return;
        }
        // add to selected users
        setSelectedUsers([...selectedUsers, user]);
      }
    } catch (error) {
      alert(error);
    }
  };

  // const addToSelectedUsers = (id) => {
  //   // check if already selected
  //   if (selectedUsers.find((u) => u.id === id)) {
  //     console.log('already selected');
  //     return;
  //   }
  //   const user = users.find((u) => u.id === id);
  //   setSelectedUsers([...selectedUsers, user]);
  // };

  const removeFromSelectedUsers = (id) => {
    const filtered = selectedUsers.filter((m) => m.id !== id);
    console.log('filtered', filtered);
    setSelectedUsers(filtered);
  };

  const putSelectedUsers = async () => {
    try {
      // await axios.put(`${API_URL}/projects/${project.id}`, {
      await updateProject(project.id, {
        users: selectedUsers,
      });
    } catch (error) {
      alert(error);
    }
  };

  const updateProjectUsers = async () => {
    try {
      setLoading(true);
      await putSelectedUsers();
      setLoading(false);
      router.push(`/projects/update/${project.id}`);
    } catch (error) {
      alert(error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Jumbotron>
        <Card className="p-2">
          <Card.Body>
            <div className="jumbo_content">
              <h1>
                <i className="fas fa-project-diagram mr-2"></i>
                {project?.name}
              </h1>
            </div>
          </Card.Body>
        </Card>
        <div className="two_cols">
          <Card className="task_container">
            <Card.Title>Add a user to the project </Card.Title>

            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label htmlFor="email">User Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button variant="success" type="submit" block size="lg">
                Add to List
              </Button>
            </Form>
          </Card>
          <Card className="task_container">
            <Card.Title>Project Users</Card.Title>
            {selectedUsers.map((u) => (
              <Card key={u.id}>
                <Card.Body>
                  <Button
                    className="remove_button"
                    onClick={() => {
                      removeFromSelectedUsers(u.id);
                    }}
                  >
                    <i className="fas fa-times fa-lg"></i>
                  </Button>{' '}
                  <span>id:{u.id}</span> <span>{u.email}</span>
                </Card.Body>
              </Card>
            ))}
            {loading && (
              <Card className="p-2">
                <Loading />
              </Card>
            )}
          </Card>
        </div>
        <Card className="task_container">
          <Button
            variant="success"
            className="update_button"
            size="lg"
            block
            onClick={updateProjectUsers}
          >
            Update Project Users
          </Button>
          <Button
            variant="warning"
            className="cancel_button"
            size="lg"
            block
            onClick={cancel}
          >
            Cancel
          </Button>
        </Card>
      </Jumbotron>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const { token } = cookie.parse(context.req.headers.cookie) || '';
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    console.log('token', token);

    // TODO: Create custom strapi route that returns only user emails and ids
    // Fetch all the users
    const usersRes = await axios.get(`${API_URL}/users`, authConfig);

    console.log(usersRes.data);

    // Fetch current project
    const projectRes = await axios.get(
      `${API_URL}/projects/${context.params.id}`,
      authConfig
    );

    return {
      props: {
        users: usersRes.data || [],
        project: projectRes.data || {},
      },
    };
  } catch (error) {
    console.log(error.message);
    return {
      props: { message: 'Error: Fetching data failed' },
    };
  }
}
