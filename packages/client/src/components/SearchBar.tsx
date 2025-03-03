import { useNavigate } from "react-router-dom";
import { SearchBarProps } from "../types/props";
import { useSearchQuery } from "../hooks/useSearchQuery";

function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const navigate = useNavigate();
  const { typedQuery, handleChange, handleClear } = useSearchQuery({
    onSearch,
    onClear,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleChange(value);
    navigate(`/?query=${encodeURIComponent(value)}`);
  };

  const handleClearClick = () => {
    handleClear();
    navigate("/");
  };

  return (
    <div className="form">
      <i className="fa fa-search"></i>
      <input
        type="text"
        className="form-control form-input"
        placeholder="Search accommodation..."
        value={typedQuery}
        onChange={handleInputChange}
      />
      {typedQuery && (
        <span
          className="left-pan"
          onClick={handleClearClick}
          data-testid="close"
        >
          <i className="fa fa-close"></i>
        </span>
      )}
    </div>
  );
}

export default SearchBar;
