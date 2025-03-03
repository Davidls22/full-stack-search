import { ResultSectionProps } from "../types/props";
import NotFound from "./NotFound";

function ResultSection({ title, items, onSelect, query }: ResultSectionProps) {
  if (!query.trim()) return null;

  if (!items.length) {
    return (
      <div className="result-content">
        <NotFound type={title} />
      </div>
    );
  }

  return (
    <div className="card result-section">
      <div className="card-header gradient-background text-white text-center">
        {title}
      </div>
      <div className="result-content">
        <ul className="list-group list-group-flush">
          {items.map((item) => {
            if (!item || typeof item !== "object") {
              console.error("Invalid item:", item);
              return null;
            }

            const displayText =
              "hotel_name" in item
                ? `${item.hotel_name} (${item.country})`
                : "country" in item
                ? item.country
                : "name" in item
                ? item.name
                : "Unknown";

            return (
              <li
                key={item._id || displayText}
                className="list-group-item list-group-item-action"
                onClick={() => onSelect(item)}
              >
                {displayText}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ResultSection;
