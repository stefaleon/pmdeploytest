import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

export default function TaskFilters({ taskCategories, cat }) {
  const router = useRouter();
  const [search, setSearch] = useState({ term: '' });
  const [category, setCategory] = useState({ id: '0' });

  useEffect(() => {
    if (category.id !== '0') {
      router.push(`/tasks?cat=${category.id}&term=${search.term.trim()}`);
    } else {
      router.push(`/tasks?term=${search.term.trim()}`);
    }
  }, [category]);

  const handleChange = (e) => {
    // console.log(search.term);
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    console.log(category);
    setCategory({ [e.target.name]: e.target.value });
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (category.id !== '0') {
      router.push(`/tasks?cat=${category.id}&term=${search.term.trim()}`);
    } else {
      router.push(`/tasks?term=${search.term.trim()}`);
    }
  };

  const clearSearchTerm = () => {
    setSearch({ term: '' });
    if (category.id !== '0') {
      router.push(`/tasks?cat=${category.id}`);
    } else {
      router.push(`/tasks`);
    }
  };

  return (
    <div className="two_cols">
      <Form inline onSubmit={submitForm} className="mt-1 mb-1">
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

      <Form.Control
        as="select"
        name="id"
        value={category?.id}
        onChange={handleCategoryChange}
        className="mt-1 mb-1"
      >
        <option key="0" value="0">
          All Categories
        </option>
        {taskCategories?.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </Form.Control>
    </div>
  );
}
