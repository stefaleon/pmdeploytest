import { Card, Button } from 'react-bootstrap';

export default function MemberItemAdd({ m, addToSelectedMembers }) {
  const addMember = () => {
    addToSelectedMembers(m.id);
  };

  return (
    <Card>
      <Card.Body>
        <Button className="add_button" onClick={addMember}>
          <i className="fas fa-plus fa-lg"></i>
        </Button>{' '}
        <span>id:{m.id}</span>{' '}
        <span>
          {m.firstname} {m.lastname}
        </span>
      </Card.Body>
    </Card>
  );
}
