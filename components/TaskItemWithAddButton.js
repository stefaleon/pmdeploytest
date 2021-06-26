import { Card, Button } from 'react-bootstrap';

export default function TaskItem({ t, addToSelectedTasks }) {
  const addTask = () => {
    addToSelectedTasks(t.id);
  };

  return (
    <Card>
      <Card.Body>
        <Button className="add_button" onClick={addTask}>
          <i className="fas fa-plus fa-lg"></i>
        </Button>{' '}
        <span>id:{t.id}</span> <span>{t.name}</span>{' '}
        <span>
          {t.duration}
          {t.duration_unit}
        </span>
      </Card.Body>
    </Card>
  );
}
