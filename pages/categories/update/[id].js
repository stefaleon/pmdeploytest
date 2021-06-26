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
import CategoryForm from 'components/CategoryForm';

export default function CategoryUpdatePage({ c, message }) {
  const { user } = useContext(AuthContext);
  const { updateCategory, deleteCategory } = useContext(AppContext);
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [problemWithPut, setProblemWithPut] = useState('');
  const [values, setValues] = useState({
    name: c?.name || '',
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
      const taskCategory = await updateCategory(c.id, values);
      if (taskCategory) {
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
    if (window.confirm('This category will be permanently deleted')) {
      console.log('delete category');
      setLoading(true);
      const deletedCat = await deleteCategory(c.id);
      if (deletedCat) {
        setLoading(false);
        router.push('/categories');
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout title="Edit Category">
      <Jumbotron>
        <Card className="p-2">
          <div className="jumbo_content">
            <Button variant="outline-secondary" block>
              <h2>
                <i className="fas fa-globe mr-2"></i> {c?.name}
              </h2>
            </Button>
          </div>
        </Card>

        {!c ? (
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
                <Form.Label>Delete This Category</Form.Label>
                <Button
                  variant="danger"
                  type="button"
                  block
                  size="lg"
                  onClick={handleDelete}
                >
                  Delete Category
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
              <CategoryForm
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

    const catRes = await axios.get(
      `${API_URL}/task-categories/${context.params.id}`,
      authConfig
    );

    return {
      props: {
        c: catRes.data || {},
      },
    };
  } catch (error) {
    console.log(error.message);
    return {
      props: { message: 'Error: Fetching category data failed' },
    };
  }
}
