import { Form, Button } from 'react-bootstrap';

export default function PersonForm({ values, setValues, handleSubmit }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label htmlFor="firstname">First Name</Form.Label>
        <Form.Control
          type="text"
          id="firstname"
          name="firstname"
          value={values.firstname}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="lastname">Last Name</Form.Label>
        <Form.Control
          type="text"
          id="lastname"
          name="lastname"
          value={values.lastname}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="email">Email Address</Form.Label>
        <Form.Control
          type="email"
          id="email"
          name="email"
          value={values.email}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="phone">Telephone Number</Form.Label>
        <Form.Control
          type="text"
          id="phone"
          name="phone"
          value={values.phone}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Button variant="success" type="submit" block size="lg">
        Submit
      </Button>
    </Form>
  );
}
