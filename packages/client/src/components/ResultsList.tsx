import { useNavigate } from "react-router-dom";
import ResultSection from "./ResultSection";
import { ResultsListProps } from "../types/props";
import Loading from "./Loading";
import NotFound from "./NotFound";

function ResultsList({ results, loading, query }: ResultsListProps) {
  const navigate = useNavigate();

  const handleSelect = (type: "hotel" | "country" | "city", id: string) => {
    navigate(`/${type}/${id}`);
  };

  if (loading) return <Loading />;

  if (
    query.trim() &&
    !results.hotels.length &&
    !results.countries.length &&
    !results.cities.length
  ) {
    return <NotFound type="Search Results" />;
  }

  return (
    <div className="results-container">
      <ResultSection
        title="Hotels"
        items={results.hotels}
        onSelect={(hotel) => handleSelect("hotel", hotel._id)}
        query={query}
      />
      <ResultSection
        title="Countries"
        items={results.countries}
        onSelect={(country) => handleSelect("country", country._id)}
        query={query}
      />
      <ResultSection
        title="Cities"
        items={results.cities}
        onSelect={(city) => handleSelect("city", city._id)}
        query={query}
      />
    </div>
  );
}

export default ResultsList;
