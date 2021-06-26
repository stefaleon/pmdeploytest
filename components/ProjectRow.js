import Link from 'next/link';
import { Card } from 'react-bootstrap';

export default function ProjectRow({ p }) {
  return (
    <Link href={`/projects/${p.id}`}>
      <a className="card_anchor">
        <Card>
          <Card.Body>
            <span className="proj_name">
              <i className="fas fa-project-diagram mr-2"></i> {p.name}
            </span>
            <span>
              <i className="fas fa-info-circle mr-2"></i> {p.description}
            </span>
          </Card.Body>
        </Card>
      </a>
    </Link>
  );
}
