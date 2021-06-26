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
import PersonForm from 'components/PersonForm';

export default function PersonUpdatePage({ p, message }) {
  const { user } = useContext(AuthContext);
  const { updatePerson, deletePerson } = useContext(AppContext);
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [problemWithPut, setProblemWithPut] = useState('');
  const [values, setValues] = useState({
    firstname: p?.firstname || '',
    lastname: p?.lastname || '',
    email: p?.email || '',
    phone: p?.phone || '',
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
      const person = await updatePerson(p.id, values);
      if (person) {
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
    if (window.confirm('This person will be permanently deleted')) {
      console.log('delete person');
      setLoading(true);
      const deletedPerson = await deletePerson(p.id);
      if (deletedPerson) {
        setLoading(false);
        router.push('/people');
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout title="Edit Person">
      <Jumbotron>
        <Card className="p-2">
          <div className="jumbo_content">
            <Button variant="outline-secondary" block>
              <h2>
                <i className="fas fa-user-circle mr-2"></i> {p?.firstname}{' '}
                {p?.lastname}
              </h2>
            </Button>
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
                <Form.Label>Delete This Person</Form.Label>
                <Button
                  variant="danger"
                  type="button"
                  block
                  size="lg"
                  onClick={handleDelete}
                >
                  Delete Person
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
              <PersonForm
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

    const personRes = await axios.get(
      `${API_URL}/people/${context.params.id}`,
      authConfig
    );

    console.log(personRes.data);

    return {
      props: {
        p: personRes.data || {},
      },
    };
  } catch (error) {
    console.log(error.message);
    return {
      props: { message: 'Error: Fetching person data failed' },
    };
  }
}
