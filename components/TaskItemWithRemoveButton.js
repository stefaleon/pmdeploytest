import { Card, Button } from 'react-bootstrap';

export default function TaskItem({ t, removeFromSelectedTasks }) {
  const removeTask = () => {
    removeFromSelectedTasks(t.id);
  };

  return (
    <Card>
      <Card.Body>
        <Button className="remove_button" onClick={removeTask}>
          <i className="fas fa-times fa-lg"></i>
        </Button>{' '}
        <span>id:{t.task.id}</span> <span>{t.task.name}</span>{' '}
        <span>
          {t.task.duration}
          {t.task.duration_unit}
        </span>
      </Card.Body>
    </Card>
  );
}
