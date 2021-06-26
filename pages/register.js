import { useState, useEffect, useContext } from 'react';
import { Jumbotron, Card, Form, Button, Toast } from 'react-bootstrap';
import Link from 'next/link';
import Layout from 'components/Layout';
import AuthContext from 'context/AuthContext';

export default function register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const { register, error, setError, message } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    register({ username, email, password });
  };

  return (
    <Layout title="User Registration">
      <Jumbotron>
        <Card className="p-2">
          <div className="jumbo_content">
            <Link href="/login">
              <Button variant="outline-primary" block>
                Already registered? Sign In
                <i className="fas fa-sign-in-alt ml-2"></i>
              </Button>
            </Link>
          </div>
        </Card>
        <Card className="p-2">
          <Card.Body>
            <div className="jumbo_content">
              <h1>
                <i className="fas fa-user-plus mr-2"></i> Sign Up
              </h1>
            </div>
          </Card.Body>
        </Card>

        <Card className="p-2">
          <div className="grid_20_60">
            <div id="placeholder20"></div>
            <Card>
              {error && (
                <>
                  <div className="message_container">
                    <Toast>
                      <Toast.Body>
                        <div className="color_red">{error}</div>
                      </Toast.Body>
                    </Toast>
                  </div>
                </>
              )}
              {message && (
                <>
                  <div className="message_container">
                    <Toast>
                      <Toast.Body>
                        <div>{message}</div>
                      </Toast.Body>
                    </Toast>
                  </div>
                </>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label htmlFor="username">Username</Form.Label>
                  <Form.Control
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="email">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label htmlFor="passwordConfirm">
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                </Form.Group>
                <Button variant="success" type="submit" block size="lg">
                  Submit
                </Button>
              </Form>
            </Card>
          </div>
        </Card>
      </Jumbotron>
    </Layout>
  );
}
