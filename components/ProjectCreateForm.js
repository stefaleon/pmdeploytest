import { Form, Button } from 'react-bootstrap';

export default function ProjectCreateForm({ values, setValues, handleSubmit }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label htmlFor="name">Project Name</Form.Label>
        <Form.Control
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="description">Project Description</Form.Label>
        <Form.Control
          as="textarea"
          type="text"
          name="description"
          id="description"
          value={values.description}
          onChange={handleInputChange}
        ></Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label htmlFor="comments">Project Comments</Form.Label>
        <Form.Control
          as="textarea"
          type="text"
          name="comments"
          id="comments"
          value={values.comments}
          onChange={handleInputChange}
        ></Form.Control>
      </Form.Group>
      <div className="two_cols">
        <Form.Group>
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            readOnly
            value={new Date(values.deadline).toDateString()}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="deadline">Set Deadline</Form.Label>
          <Form.Control
            type="date"
            name="deadline"
            id="deadline"
            value={values.deadline}
            onChange={handleInputChange}
          />
        </Form.Group>
      </div>

      <Button variant="success" type="submit" block size="lg">
        Submit
      </Button>
    </Form>
  );
}
