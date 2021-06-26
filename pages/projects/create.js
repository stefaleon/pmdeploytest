import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Jumbotron, Toast, Card } from 'react-bootstrap';
import Layout from 'components/Layout';
import ProjectCreateForm from 'components/ProjectCreateForm';
import AppContext from 'context/AppContext';
import AuthContext from 'context/AuthContext';

export default function ProjectCreatePage() {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const { createProject } = useContext(AppContext);

  const [problemWithPost, setProblemWithPost] = useState('');
  const [values, setValues] = useState({
    name: '',
    description: '',
    comments: '',
    deadline: `${new Date().getFullYear()}-12-31`,
    users: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.name.trim() === '') {
      setProblemWithPost('Please provide a name for the project');
      setTimeout(() => {
        setProblemWithPost('');
      }, 3000);
      return;
    }

    try {
      console.log('values before POST:', values);
      // const project = await createProject({
      //   ...values,
      //   // for projects it is an array, because the relation is many to many
      //   users: [{ id: user.id }],
      // });
      // TOOK CARE OF THE ABOVE IN THE STRAPI BACKEND
      // BUT THE DEFINITION OF AN EMPTY users ARRAY IN THE DATA
      // THAT WE SEND IS NOW MANDATORY
      const project = await createProject(values);
      router.push(`/projects/${project.id}`);
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
    <Layout title="New Project">
      <Jumbotron>
        <Card className="p-2">
          <Card.Body>
            <div className="jumbo_content">
              <h1>
                <i className="far fa-plus-square fa-lg mr-2"></i> New Project
              </h1>
            </div>
          </Card.Body>
        </Card>

        <Card className="p-2">
          {!true ? (
            <></>
          ) : (
            <div className="grid_20_60">
              <div id="placeholder20"></div>
              <Card>
                {problemWithPost && (
                  <>
                    <div className="message_container">
                      <Toast>
                        <Toast.Body>
                          <div className="color_red">{problemWithPost}</div>
                        </Toast.Body>
                      </Toast>
                    </div>
                  </>
                )}
                <ProjectCreateForm
                  values={values}
                  setValues={setValues}
                  handleSubmit={handleSubmit}
                />
              </Card>
            </div>
          )}
        </Card>
      </Jumbotron>
    </Layout>
  );
}
