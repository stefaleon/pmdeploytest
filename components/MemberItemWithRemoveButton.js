import { Card, Button } from 'react-bootstrap';

export default function MemberItemRm({ m, removeFromSelectedMembers }) {
  const removeMember = () => {
    removeFromSelectedMembers(m.id);
  };

  return (
    <Card>
      <Card.Body>
        <Button className="remove_button" onClick={removeMember}>
          <i className="fas fa-times fa-lg"></i>
        </Button>{' '}
        <span>id:{m.person.id}</span>{' '}
        <span>
          {m.person.firstname} {m.person.lastname}
        </span>
      </Card.Body>
    </Card>
  );
}
