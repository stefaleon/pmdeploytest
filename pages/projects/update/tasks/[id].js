import axios from 'axios';
import cookie from 'cookie';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { API_URL, NEXT_URL } from '/config/index';
import { Jumbotron, Card, Button, Form } from 'react-bootstrap';
import Layout from '/components/Layout';
import TaskItemWithAddButton from '/components/TaskItemWithAddButton';
import TaskItemWithRemoveButton from '/components/TaskItemWithRemoveButton';
import Loading from 'components/Loading';
import AuthContext from 'context/AuthContext';
import AppContext from 'context/AppContext';

export default function updateTheProjecttasksOfTheProject({
  tasks,
  project,
  projectTasks,
  taskCategories,
}) {
  const { user } = useContext(AuthContext);
  const { createProjectTask, deleteProjectTask } = useContext(AppContext);

  const router = useRouter();

  const [selectedTasks, setSelectedTasks] = useState(projectTasks || []);
  const [category, setCategory] = useState({ id: '0' });
  const [loading, setLoading] = useState(false);
  const [alreadyAssignedTasksIds, setAlreadyAssignedTasksIds] = useState(
    // create the array of the already assigned tasks ids from the projectTasks
    // for the initial value
    projectTasks?.map((x) => x.task.id)
  );
  const [assignedTasksIdsToRemoveFromDb, setAssignedTasksIdsToRemoveFromDb] =
    useState([]);

  // also create an array with the current projectTasks ids
  const projectTasksIds = projectTasks?.map((x) => x.id);

  // this is for development
  useEffect(() => {
    console.log('selectedTasks', selectedTasks);
    console.log('already assigned tasks ids', alreadyAssignedTasksIds);
    console.log(
      'formerly assigned tasks ids to remove from db',
      assignedTasksIdsToRemoveFromDb
    );
  }, [selectedTasks, alreadyAssignedTasksIds, assignedTasksIdsToRemoveFromDb]);

  useEffect(() => {
    if (category.id !== '0') {
      // projects/update/tasks/1?cat=1
      router.push(`/projects/update/tasks/${project?.id}?cat=${category.id}`);
    } else {
      router.push(`/projects/update/tasks/${project?.id}`);
    }
  }, [category]);

  const showAll = () => {
    setCategory({ id: '0' });
  };

  const handleCategoryChange = (e) => {
    console.log(category);
    setCategory({ [e.target.name]: e.target.value });
  };

  const cancel = () => {
    router.push(`/projects/${project?.id}`);
  };

  const addToSelectedTasks = (id) => {
    if (
      selectedTasks.find(
        (t) =>
          // check if it is already selected
          t.id === id ||
          // or already assigned
          alreadyAssignedTasksIds.indexOf(id) !== -1
      )
    ) {
      console.log('already selected or assigned');
      return;
    }
    const task = tasks.find((t) => t.id === id);
    setSelectedTasks([
      ...selectedTasks,
      {
        id: task.id,
        project,
        task,
      },
    ]);
  };

  const removeFromSelectedTasks = (id) => {
    const filtered = selectedTasks.filter((t) => t.id !== id);
    // console.log('filtered', filtered);
    setSelectedTasks(filtered);

    // also remove it from the already assigned tasks ids array
    const matchingSelectedTasks = selectedTasks.filter((t) => t.id === id);
    const matchingId = matchingSelectedTasks[0].task?.id;
    const filtered2 = alreadyAssignedTasksIds.filter((x) => x !== matchingId);
    // console.log('filtered2', filtered2);
    setAlreadyAssignedTasksIds(filtered2);

    // also add to the array of projectTasks ids to delete from db
    // but only the formerly assigned
    // not the newly added and right away removed
    // it has to exist inside the projectTasks ids array
    if (projectTasksIds.includes(id)) {
      setAssignedTasksIdsToRemoveFromDb([
        ...assignedTasksIdsToRemoveFromDb,
        id,
      ]);
    }
  };

  const postSelectedTasks = async () => {
    for (const t of selectedTasks) {
      // post only those that are not already assigned
      if (!projectTasksIds.includes(t.id)) {
        try {
          await createProjectTask({
            task: t.task,
            project: t.project,
            status: t.status,
          });
          console.log(t.id);
        } catch (error) {
          alert(error);
        }
      }
    }
  };

  const deleteFormerlyAssignedTasksFromDb = async () => {
    for (const id of assignedTasksIdsToRemoveFromDb) {
      try {
        await deleteProjectTask(id);
        console.log('DELETED', id);
      } catch (error) {
        alert(error);
      }
    }
  };

  const updateProjectTasks = async () => {
    try {
      setLoading(true);
      // add selectedTasks to the ProjectTasks collection
      await postSelectedTasks();
      //  delete the removed projectTasks
      await deleteFormerlyAssignedTasksFromDb();
      setLoading(false);
      router.push(`/projects/${project.id}`);
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
            <Card.Title>Tasks</Card.Title>
            <div className="two_cols">
              <Form.Group>
                <Form.Control
                  as="select"
                  name="id"
                  value={category?.id}
                  onChange={handleCategoryChange}
                >
                  <option key="0" value="0">
                    Select Task Category
                  </option>
                  {taskCategories?.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Button variant="outline-secondary" block onClick={showAll}>
                  Show All
                </Button>
              </Form.Group>
            </div>

            {!tasks && <h3>Fetch tasks error</h3>}
            {tasks?.length === 0 ? (
              <Card>
                <h3 className="p-2">No tasks found</h3>
              </Card>
            ) : (
              tasks?.map((t) => (
                <TaskItemWithAddButton
                  key={t.id}
                  t={t}
                  addToSelectedTasks={addToSelectedTasks}
                  project={project}
                />
              ))
            )}
          </Card>
          <Card className="task_container">
            <Card.Title>Assigned Tasks</Card.Title>
            {selectedTasks.map((t) => (
              <TaskItemWithRemoveButton
                key={t.id}
                t={t}
                removeFromSelectedTasks={removeFromSelectedTasks}
              />
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
            onClick={updateProjectTasks}
          >
            Update Project Tasks
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

    /*
    
    The browser request will be 
    FRONTEND_URL/projects/update/tasks/PROJECT_ID?cat=TASK_CATEGORY_ID
    http://localhost:3000/projects/update/tasks/1?cat=1

    while the request to the Strapi backend is
    BACKEND_URL/tasks?task_category.id=TASK_CATEGORY_ID 
    http://localhost:1337/tasks?task_category.id=1 
    
    */

    console.log('context.query.cat', context.query.cat);
    // axios request depends on whether 'cat' is found in the frontend query
    // Fetch all the tasks
    const tasksRes = context.query.cat
      ? await axios.get(
          `${API_URL}/tasks?task_category=${context.query.cat}`,
          authConfig
        )
      : await axios.get(`${API_URL}/tasks`, authConfig);

    // Fetch current project
    const projectRes = await axios.get(
      `${API_URL}/projects/${context.params.id}`,
      authConfig
    );

    // Fetch current project's projectTasks
    const projectTasksRes = await axios.get(
      `${API_URL}/project-tasks?project=${context.params.id}`,
      authConfig
    );

    // Fetch all the task categories
    const taskCategoriesRes = await axios.get(
      `${API_URL}/task-categories`,
      authConfig
    );

    return {
      props: {
        tasks: tasksRes.data || [],
        project: projectRes.data || {},
        projectTasks: projectTasksRes.data || [],
        taskCategories: taskCategoriesRes.data || [],
      },
    };
  } catch (error) {
    // console.log(error.message);
    return {
      props: { message: 'Error: Fetching data failed' },
    };
  }
}
