import { useNavigate } from "react-router-dom";
import { HotelListProps } from "../types/props";

function HotelList({ hotels, title }: HotelListProps) {
  const navigate = useNavigate();

  if (hotels.length === 0) return null;

  return (
    <>
      <h4 className="mt-3">{title}</h4>
      <ul className="list-group">
        {hotels.map((hotel) => (
          <li
            key={hotel._id}
            className="list-group-item list-group-item-action"
            onClick={() => navigate(`/hotel/${hotel._id}`)}
            style={{ cursor: "pointer" }}
          >
            {hotel.hotel_name} ({hotel.city})
          </li>
        ))}
      </ul>
    </>
  );
}

export default HotelList;