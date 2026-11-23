
import { useRef } from 'react';

function SearchBar({ searchTerm, onSearchChange }) {
  const searchChangeCount = useRef(0);

  function handleSearchChange(event) {
    searchChangeCount.current += 1;

    onSearchChange(event.target.value);

    console.log(
      'Search changed:',
      searchChangeCount.current,
      'times'
    );
  }

  return (
    <div className="mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Search by name, email or city..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
}

export default SearchBar;
