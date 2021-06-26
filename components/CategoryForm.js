import { Form, Button } from 'react-bootstrap';

export default function CategoryForm({ values, setValues, handleSubmit }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label htmlFor="name">Category Name</Form.Label>
        <Form.Control
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Button variant="success" type="submit" block size="lg">
        Submit
      </Button>
    </Form>
  );
}
