import { Form, Button } from 'react-bootstrap';

export default function TaskCreateForm({
  categories,
  values,
  setValues,
  handleSubmit,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label htmlFor="name">Task Name</Form.Label>
        <Form.Control
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleInputChange}
        />
      </Form.Group>
      <div className="two_cols">
        <Form.Group>
          <Form.Label htmlFor="duration">Duration</Form.Label>
          <Form.Control
            type="number"
            id="duration"
            name="duration"
            value={values.duration}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="duration_unit">Duration Unit</Form.Label>
          <Form.Control
            as="select"
            id="duration_unit"
            name="duration_unit"
            value={values.duration_unit}
            onChange={handleInputChange}
          >
            {[
              { unit: 'Minutes' },
              { unit: 'Hours' },
              { unit: 'Days' },
              { unit: 'Months' },
            ].map((x, i) => (
              <option key={i} value={x.unit}>
                {x.unit}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>

      <Form.Group>
        <Form.Control
          as="select"
          name="task_category"
          value={values.task_category.id}
          onChange={handleInputChange}
        >
          <option key="0" value="0">
            Select Task Category
          </option>
          {categories?.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Button variant="success" type="submit" block size="lg">
        Submit
      </Button>
    </Form>
  );
}
