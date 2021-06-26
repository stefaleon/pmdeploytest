import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Jumbotron, Toast, Card } from 'react-bootstrap';
import Layout from 'components/Layout';
import CategoryForm from 'components/CategoryForm';
import Loading from 'components/Loading';
import AppContext from 'context/AppContext';
import AuthContext from 'context/AuthContext';

export default function TaskCategoryCreatePage() {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const { createCategory } = useContext(AppContext);

  const [problemWithPost, setProblemWithPost] = useState('');
  const [values, setValues] = useState({ name: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.name.trim() === '') {
      setProblemWithPost('Please provide a name for the task category');
      setTimeout(() => {
        setProblemWithPost('');
      }, 3000);
      return;
    }

    try {
      console.log('values before POST:', values);
      setLoading(true);
      const taskCategory = await createCategory(values);
      if (taskCategory) {
        setLoading(false);
        router.push(`/categories/update/${taskCategory.id}`);
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
    <Layout title="New Task Category">
      <Jumbotron>
        <Card className="p-2">
          <Card.Body>
            <div className="jumbo_content">
              <h1>
                <i className="fas fa-globe fa-lg mr-2"></i> New Task Category
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
                {loading && (
                  <Card className="p-2">
                    <Loading />
                  </Card>
                )}
                <CategoryForm
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
