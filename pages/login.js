import { useState, useEffect, useContext } from 'react';
import { Jumbotron, Card, Form, Button, Toast } from 'react-bootstrap';
import Link from 'next/link';
import Layout from 'components/Layout';
import AuthContext from 'context/AuthContext';

export default function login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, error } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <Layout title="User Login">
      <Jumbotron>
        <Card className="p-2">
          <div className="jumbo_content">
            <Link href="/register">
              <Button variant="outline-primary" block>
                Not registered? Sign Up<i className="fas fa-user-plus ml-2"></i>
              </Button>
            </Link>
          </div>
        </Card>
        <Card className="p-2">
          <Card.Body>
            <div className="jumbo_content">
              <h1>
                <i className="fas fa-sign-in-alt mr-2"></i> Sign In
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
              <Form onSubmit={handleSubmit}>
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
