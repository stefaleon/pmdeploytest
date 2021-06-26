import { useContext } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import AuthContext from 'context/AuthContext';

const NavigationBar = ({ token, admin, username }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (window.confirm('Confirm User Sign Out')) {
      console.log('log out');
      logout();
    }
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Link href="/" passHref>
        <Navbar.Brand>
          <i className="fas fa-project-diagram mr-1"></i> Project Manager
        </Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse>
        <Nav className="mr-auto">
          {user && (
            <>
              <Link href="/projects" passHref>
                <Nav.Link>
                  <i className="fas fa-list-alt mr-1"></i> Projects
                </Nav.Link>
              </Link>

              <NavDropdown title="Manage">
                <Link href="/tasks" passHref>
                  <NavDropdown.Item>
                    <i className="fas fa-dot-circle mr-2"></i> Tasks
                  </NavDropdown.Item>
                </Link>
                <NavDropdown.Divider />
                <Link href="/categories" passHref>
                  <NavDropdown.Item>
                    <i className="fas fa-globe mr-2"></i> Categories
                  </NavDropdown.Item>
                </Link>
                <NavDropdown.Divider />
                <Link href="/people" passHref>
                  <NavDropdown.Item>
                    <i className="fas fa-user-circle mr-2"></i> People
                  </NavDropdown.Item>
                </Link>
              </NavDropdown>
            </>
          )}
        </Nav>
        <Nav>
          {user ? (
            <Nav.Link onClick={handleLogout}>
              {user.email.split('@')[0]}{' '}
              <i className="fas fa-sign-out-alt mr-1 ml-1"></i> Sign Out
            </Nav.Link>
          ) : (
            <Link href="/login" passHref>
              <Nav.Link>
                Sign In <i className="fas fa-sign-in-alt ml-1"></i>
              </Nav.Link>
            </Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
