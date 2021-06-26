import { Form, Button } from 'react-bootstrap';

export default function ProjectUpdateForm({ values, setValues, handleSubmit }) {
  const setStart = () => {
    setValues({ ...values, started_at: new Date() });
  };
  const setComplete = () => {
    setValues({ ...values, completed_at: new Date() });
  };

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

      <div>
        {values.started_at ? (
          <div className="two_cols">
            <Form.Group>
              <Form.Label>Started At</Form.Label>
              <Form.Control
                readOnly
                value={new Date(values.started_at).toDateString()}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="started_at">Reset Project Start</Form.Label>
              <Form.Control
                type="date"
                name="started_at"
                id="started_at"
                value={values.started_at}
                onChange={handleInputChange}
              />
            </Form.Group>
          </div>
        ) : (
          <Form.Group>
            <Form.Label>Start Project</Form.Label>
            <Button
              variant="outline-secondary"
              type="submit"
              block
              onClick={setStart}
            >
              Start
            </Button>
          </Form.Group>
        )}
      </div>

      <div>
        {values.completed_at ? (
          <div className="two_cols">
            <Form.Group>
              <Form.Label>Completed At</Form.Label>
              <Form.Control
                readOnly
                value={new Date(values.completed_at).toDateString()}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="completed_at">
                Reset Project Finish
              </Form.Label>
              <Form.Control
                type="date"
                name="completed_at"
                id="completed_at"
                value={values.completed_at}
                onChange={handleInputChange}
              />
            </Form.Group>
          </div>
        ) : (
          <Form.Group>
            <Form.Label>Mark Completion</Form.Label>
            <Button
              variant="outline-secondary"
              type="submit"
              block
              onClick={setComplete}
            >
              Finish
            </Button>
          </Form.Group>
        )}
      </div>

      <Button variant="success" type="submit" block size="lg">
        Submit
      </Button>
    </Form>
  );
}
