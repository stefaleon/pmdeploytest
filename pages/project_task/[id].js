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

export default function manageAssignedTask({
  assignedTask,
  projectId,
  projectMembers,
}) {
  const { user } = useContext(AuthContext);
  const { updateProjectTask } = useContext(AppContext);

  const router = useRouter();
  const [selectedMembers, setSelectedMembers] = useState(
    assignedTask?.project_members || []
  );
  const [taskStatus, setTaskStatus] = useState({
    status: assignedTask?.status,
  });
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   console.log(selectedMembers);
  //   console.log(selectedMembers[0]?.name);
  //   console.log(taskStatus);
  // }, [selectedMembers, taskStatus]);

  const handleTaskStatusChange = (e) => {
    setTaskStatus({ [e.target.name]: e.target.value });
  };

  const cancel = () => {
    router.push(`/projects/${projectId}`);
  };

  const addToSelectedMembers = (id) => {
    //check if it is already selected
    if (selectedMembers.find((m) => m.id === id)) {
      console.log('already selected');
      return;
    }
    const member = projectMembers.find((p) => p.id === id);
    setSelectedMembers([...selectedMembers, member]);
  };

  const removeFromSelectedMembers = (id) => {
    const filtered = selectedMembers.filter((m) => m.id !== id);
    // console.log('filtered', filtered);
    setSelectedMembers(filtered);
  };

  const putSelectedMembersAndStatus = async () => {
    /* FORMAT OF THE DB OBJECT
    "project_members": [
      {
          "id": 22,
          "project": null,
          "name": "Chuck Norris",
          "person": 4,
          "published_at": "2021-06-03T02:42:36.606Z",
          "created_at": "2021-06-03T02:42:36.609Z",
          "updated_at": "2021-06-03T02:44:24.143Z"
      },
      {
          "id": 13,
          "project": null,
          "name": "Jack Bauer",
          "person": 1,
          "published_at": "2021-06-03T02:29:24.368Z",
          "created_at": "2021-06-03T02:29:24.372Z",
          "updated_at": "2021-06-03T02:39:01.940Z"
      },
      */

    /* from Postman testing passing an object like below works
    {
      "project_members": [ {id: 9}, {id:28} ]
    }          
    SO WE CREATE THIS ARRAY AND USE IT IN THE UPDATE OBJECT    
    */
    let arrayOfIds = [];
    for (const sm of selectedMembers) {
      arrayOfIds.push({
        id: sm.id,
      });
    }
    // console.log(arrayOfIds);

    try {
      await updateProjectTask(assignedTask.id, {
        project_members: arrayOfIds,
        status: taskStatus.status,
      });
    } catch (error) {
      alert(error);
    }
  };

  const updateAssignedTask = async () => {
    // add the update object to the assigned task
    setLoading(true);
    await putSelectedMembersAndStatus();
    setLoading(false);
    router.push(`/projects/${projectId}`);
  };

  if (!user) {
    return null;
  }

  return (
    <Layout title="Manage Assigned Task">
      <Jumbotron>
        <Card className="p-2">
          <Card.Body>
            <div className="jumbo_content">
              <h1>
                <i className="fas fa-dot-circle mr-2"></i>
                {assignedTask?.task.name}
              </h1>
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Set task status</Card.Title>
            <div className="two_cols">
              <Form.Group>
                <Form.Control
                  as="select"
                  name="status"
                  value={taskStatus.status}
                  onChange={handleTaskStatusChange}
                >
                  {[
                    { status: 'draft', name: 'Draft' },
                    { status: 'pending', name: 'Pending' },
                    { status: 'declined', name: 'Declined' },
                    { status: 'inprocess', name: 'In Process' },
                    { status: 'completed', name: 'Completed' },
                  ].map((x, i) => (
                    <option key={i} value={x.status}>
                      {x.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group></Form.Group>
            </div>
          </Card.Body>
        </Card>
        <div className="two_cols">
          <Card className="task_container">
            <Card.Title>Project Members</Card.Title>

            {!projectMembers && <Card>Fetch members error</Card>}
            {projectMembers?.length === 0 ? (
              <Card>
                <h3 className="p-2">No members assigned to this project</h3>
              </Card>
            ) : (
              projectMembers?.map((m) => (
                <Card key={m.id}>
                  <Card.Body>
                    <Button
                      className="add_button"
                      onClick={() => {
                        addToSelectedMembers(m.id);
                      }}
                    >
                      <i className="fas fa-plus fa-lg"></i>
                    </Button>{' '}
                    <span>id:{m.id}</span> <span>{m.name}</span>
                  </Card.Body>
                </Card>
              ))
            )}
          </Card>
          <Card className="task_container">
            <Card.Title>Members this task is assigned to</Card.Title>
            {selectedMembers.map((m) => (
              <Card key={m.id}>
                <Card.Body>
                  <Button
                    className="remove_button"
                    onClick={() => {
                      removeFromSelectedMembers(m.id);
                    }}
                  >
                    <i className="fas fa-times fa-lg"></i>
                  </Button>{' '}
                  <span>id:{m.id}</span> <span>{m.name}</span>
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
            onClick={updateAssignedTask}
          >
            Update Assigned Task
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

    // Fetch the assigned task
    const assignedTaskRes = await axios.get(
      `${API_URL}/project-tasks/${context.params.id}`,
      authConfig
    );

    const assignedTask = assignedTaskRes.data;
    const projectId = assignedTask.project.id;

    // Fetch the members of the current project
    const projectMembersRes = await axios.get(
      `${API_URL}/project-members?project=${projectId}`,
      authConfig
    );

    return {
      props: {
        assignedTask: assignedTask || {},
        projectId: projectId || '',
        projectMembers: projectMembersRes.data || [],
      },
    };
  } catch (error) {
    console.log(error.message);
    return {
      props: { message: 'Error: Fetching data failed' },
    };
  }
}
