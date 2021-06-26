import Link from 'next/link';
import { Card } from 'react-bootstrap';

export default function TaskRow({ t }) {
  return (
    <Link href={`/tasks/update/${t.id}`}>
      <a className="card_anchor">
        <Card>
          <Card.Body>
            <span className="proj_name">
              <i className="fas fa-dot-circle mr-2"></i> {t.name}
            </span>
          </Card.Body>
        </Card>
      </a>
    </Link>
  );
}
