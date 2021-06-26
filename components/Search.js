import { useRouter } from 'next/router';
import { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const Search = ({ collection }) => {
  const router = useRouter();
  const [search, setSearch] = useState({ term: '' });

  const handleChange = (e) => {
    // console.log(search.term);
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    router.push(`/${collection}?term=${search.term.trim()}`);
  };

  const clearSearchTerm = () => {
    setSearch({ term: '' });
    router.push(`/${collection}`);
  };

  return (
    <Form inline onSubmit={submitForm}>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>
            {search.term ? (
              <i
                className="fas fa-search-minus"
                style={{ color: 'darkred', cursor: 'pointer' }}
                onClick={clearSearchTerm}
              ></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          id="search-input"
          type="text"
          name="term"
          value={search.term}
          placeholder="Search for..."
          onChange={handleChange}
          className="mr-sm-2"
        />
      </InputGroup>

      <Button variant="outline-success" type="submit" id="search-button">
        Search
      </Button>
    </Form>
  );
};

export default Search;
