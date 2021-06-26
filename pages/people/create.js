import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Jumbotron, Toast, Card } from 'react-bootstrap';
import Layout from 'components/Layout';
import PersonForm from 'components/PersonForm';
import Loading from 'components/Loading';
import AppContext from 'context/AppContext';
import AuthContext from 'context/AuthContext';

export default function PersonCreatePage() {
  const { user } = useContext(AuthContext);

  const router = useRouter();

  const { createPerson } = useContext(AppContext);

  const [problemWithPost, setProblemWithPost] = useState('');
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.firstname.trim() === '') {
      setProblemWithPost('Please provide the first name for this person');
      setTimeout(() => {
        setProblemWithPost('');
      }, 3000);
      return;
    }

    try {
      console.log('values before POST:', values);
      setLoading(true);
      const person = await createPerson(values);
      if (person) {
        setLoading(false);
        router.push(`/people/update/${person.id}`);
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
    <Layout title="New Person">
      <Jumbotron>
        <Card className="p-2">
          <Card.Body>
            <div className="jumbo_content">
              <h1>
                <i className="fas fa-user-circle fa-lg mr-2"></i> New Person
              </h1>
            </div>
          </Card.Body>
        </Card>

        <Card className="p-2">
          {
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
                <PersonForm
                  values={values}
                  setValues={setValues}
                  handleSubmit={handleSubmit}
                />
              </Card>
            </div>
          }
        </Card>
      </Jumbotron>
    </Layout>
  );
}
