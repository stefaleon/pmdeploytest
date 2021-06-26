import axios from 'axios';
import cookie from 'cookie';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Jumbotron,
  Button,
  Toast,
  Card,
  OverlayTrigger,
  Tooltip,
  NavDropdown,
} from 'react-bootstrap';
import Loading from 'components/Loading';
import Layout from 'components/Layout';
import { API_URL } from 'config/index';
import AuthContext from 'context/AuthContext';

export default function ProjectViewPage({ p, pTasks, pMembers, message }) {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const [show, setShow] = useState(false);

  const durations = pTasks?.map((t) => t.task.duration_in_minutes);
  // console.log('durations', durations);
  // console.log(typeof durations[0]);
  const sumOfDurations = durations?.reduce((acc, val) => acc + val, 0);
  // console.log('sumOfDurations', sumOfDurations);

  // console.log(pTasks[0]?.project_members[0]?.name);

  useEffect(() => {
    setShow(true);
  }, [message]);

  const handleTaskClick = (taskId) => {
    console.log('assign members to this task');
    router.push(`/project_task/${taskId}`);
  };

  const setTasks = () => {
    router.push(`/projects/update/tasks/${p.id}`);
  };

  const setMembers = () => {
    router.push(`/projects/update/members/${p.id}`);
  };

  if (!user) {
    return null;
  }

  return (
    <Layout title="Manage Project">
      <Jumbotron>
        <Card className="p-2">
          <div className="jumbo_content">
            <Link href={`/projects/update/${p?.id}`}>
              <Button variant="outline-primary" block>
                <h2>
                  <i className="fas fa-edit mr-2"></i> Edit Project
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
          <div className="project_details">
            <Card>
              <Card.Body>
                <div>
                  <h2>
                    <i className="fas fa-project-diagram mr-2"></i> {p.name}
                  </h2>
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <div>
                  <i className="fas fa-info-circle mr-2"></i> {p.description}
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <div>Comments: {p.comments}</div>
              </Card.Body>
            </Card>
            <div className="project_dates">
              <Card>
                <Card.Body>
                  <div>
                    Deadline:{' '}
                    <span className="color_red">
                      {new Date(p.deadline).toDateString()}
                    </span>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                {new Date(p.started_at).getTime() !== new Date(0).getTime() && (
                  <Card.Body>
                    <div>Started: {new Date(p.started_at).toDateString()}</div>
                  </Card.Body>
                )}
              </Card>
              <Card>
                {new Date(p.completed_at).getTime() !==
                  new Date(0).getTime() && (
                  <Card.Body>
                    <div>
                      Completed: {new Date(p.completed_at).toDateString()}
                    </div>
                  </Card.Body>
                )}
              </Card>
            </div>
            <Card>
              <Card.Body>
                <h2>Project Tasks </h2>

                <div className="task_timechart">
                  {pTasks.map((t, i) => (
                    <Card
                      key={t.id}
                      onClick={() => handleTaskClick(t.id)}
                      className="task_block"
                      style={{
                        width: `${
                          (t.task.duration_in_minutes / sumOfDurations) * 100
                        }vw`,
                        backgroundColor:
                          t.status === 'completed'
                            ? '#28a745'
                            : t.status === 'inprocess'
                            ? '#17a2b8'
                            : t.status === 'pending'
                            ? '#dc3545'
                            : t.status === 'declined'
                            ? '#ffc107'
                            : '#6c757d',
                      }}
                    >
                      <OverlayTrigger
                        // key="bottom"
                        placement="bottom"
                        overlay={
                          <Tooltip>
                            <div>{pTasks[i].task.name}</div>
                            <NavDropdown.Divider />
                            <div>
                              {pTasks[i]?.project_members.map((m) => (
                                <div key={m.id}>{m.name}</div>
                              ))}
                            </div>
                          </Tooltip>
                        }
                      >
                        <Button className="tooltip_button">{i + 1}</Button>
                      </OverlayTrigger>
                    </Card>
                  ))}
                </div>
                <div className="two_cols">
                  <div>
                    <Button
                      className="mt-2"
                      variant="outline-primary"
                      type="button"
                      onClick={setTasks}
                    >
                      Assign tasks to project
                    </Button>
                  </div>
                  <div>
                    {pTasks.map((t, i) => (
                      <Card className="p-1 task_flex_row" key={t.id}>
                        {i + 1} {t.task.name}{' '}
                        <i className="far fa-clock fa-xs"></i> {t.task.duration}
                        h
                      </Card>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <h2>Project Members</h2>

                <div className="members_flex_col">
                  {pMembers &&
                    pMembers.map((m) => (
                      <Card className="p-2 mr-1" key={m.id}>
                        <OverlayTrigger
                          key="bottom"
                          placement="bottom"
                          overlay={
                            <Tooltip>
                              <div>{m.person.email}</div>
                              <NavDropdown.Divider />
                              <div>{m.person.phone}</div>
                            </Tooltip>
                          }
                        >
                          <Button className="tooltip_button">{m.name}</Button>
                        </OverlayTrigger>
                      </Card>
                    ))}
                </div>

                <div>
                  <Button
                    className="mt-2"
                    variant="outline-primary"
                    type="button"
                    onClick={setMembers}
                  >
                    Assign members to project
                  </Button>
                </div>
              </Card.Body>
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
    const tasksRes = await axios.get(
      `${API_URL}/project-tasks?project=${context.params.id}`,
      authConfig
    );
    const membersRes = await axios.get(
      `${API_URL}/project-members?project=${context.params.id}`,
      authConfig
    );

    return {
      props: {
        p: projectRes.data || '',
        pTasks: tasksRes.data || [],
        pMembers: membersRes.data || [],
      },
    };
  } catch (error) {
    // console.log(error);
    return {
      props: { message: 'Error: Fetching project data failed' },
    };
  }
}
