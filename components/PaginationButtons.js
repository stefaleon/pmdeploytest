import { useRouter } from 'next/router';
import { Pagination } from 'react-bootstrap';
import { PAGINATION_LIMIT } from 'config/index';

const PaginationButtons = ({ count, page, term, collection }) => {
  const router = useRouter();
  const buttons = [];
  const lastPage = Math.ceil(count / PAGINATION_LIMIT);

  for (let i = 0; i < lastPage; i++) {
    buttons.push(i + 1);
  }

  return (
    <Pagination>
      {!lastPage && <Pagination.Item active>0</Pagination.Item>}

      {page > 2 && (
        <Pagination.First
          onClick={() => router.push(`/${collection}?page=1&term=${term}`)}
        />
      )}

      {buttons.map((x, i) =>
        x === page ? (
          <Pagination.Item active key={i}>
            {x}
          </Pagination.Item>
        ) : (
          ((x < page && x > page - 3) || (x > page && x < page + 3)) && (
            <Pagination.Item
              key={i}
              onClick={() =>
                router.push(`/${collection}?page=${x}&term=${term}`)
              }
            >
              {x}
            </Pagination.Item>
          )
        )
      )}

      {page < lastPage - 1 && (
        <Pagination.Last
          onClick={() => {
            router.push(`/${collection}?page=${lastPage}&term=${term}`);
          }}
        />
      )}
    </Pagination>
  );
};

export default PaginationButtons;
