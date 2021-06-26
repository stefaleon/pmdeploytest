import cookie from 'cookie';
import { useState, useEffect, useContext } from 'react';
import qs from 'qs';
import axios from 'axios';
import Link from 'next/link';
import { Jumbotron, Button, Toast, Card } from 'react-bootstrap';
import { API_URL, PAGINATION_LIMIT } from 'config/index';
import Loading from 'components/Loading';
import Layout from 'components/Layout';
import Search from 'components/Search';
import PaginationButtons from 'components/PaginationButtons';
import AuthContext from 'context/AuthContext';

export default function CategoriesPage({
  categories,
  message,
  count,
  page,
  term,
}) {
  const { user } = useContext(AuthContext);

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, [message]);

  if (!user) {
    return null;
  }

  return (
    <Layout title="Task Categories">
      <Jumbotron>
        <Card className="p-2">
          <div className="jumbo_content">
            <Link href="/categories/create">
              <Button variant="outline-primary" block>
                <i className="fas fa-plus mr-2"></i> New Task Category
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-2">
          <Search collection="categories" />
        </Card>

        <Card className="p-2">
          <PaginationButtons
            count={count}
            page={page}
            term={term}
            collection="categories"
          />
        </Card>

        <Card className="p-2">
          {!categories ? (
            <>
              <div className="message_container">
                <Toast
                  onClose={() => setShow(false)}
                  show={show}
                  delay={5000}
                  autohide
                >
                  <Toast.Header>
                    <strong className="mr-auto">Message</strong>
                  </Toast.Header>
                  <Toast.Body>{message}</Toast.Body>
                </Toast>
              </div>
              <Loading />
            </>
          ) : categories?.length === 0 ? (
            <h2>No categories found</h2>
          ) : (
            <div>
              {categories.map((c) => (
                <Link key={c.id} href={`/categories/update/${c.id}`}>
                  <a className="card_anchor">
                    <Card>
                      <Card.Body>
                        <span className="proj_name">
                          <i className="fas fa-globe mr-2"></i> {c.name}
                        </span>
                      </Card.Body>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </Jumbotron>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const searchQuery = qs.stringify({
    // _where: {
    //   _or: [{ name_contains: context.query.term }],
    // },
    _where: { name_contains: context.query.term },
  });

  console.log('searchQuery', searchQuery);

  const page = context.query.page;
  const start = !page ? 0 : +page === 1 ? 0 : (+page - 1) * PAGINATION_LIMIT;

  try {
    const { token } = cookie.parse(context.req.headers.cookie) || '';
    const authConfig = { headers: { Authorization: `Bearer ${token}` } };

    const axiosRes = await axios.get(
      `${API_URL}/task-categories?${searchQuery}&_start=${start}&_limit=${PAGINATION_LIMIT}`,
      authConfig
    );

    const axiosResForCount = await axios.get(
      `${API_URL}/task-categories?${searchQuery}`,
      authConfig
    );

    return {
      props: {
        term: context.query.term || '',
        page: +page || 1,
        count: axiosResForCount.data.length,
        categories: axiosRes.data,
      },
    };
  } catch (error) {
    // console.log(error);
    return {
      props: { message: 'Error: Fetching categories failed' },
    };
  }
}
