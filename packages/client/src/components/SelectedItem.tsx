import { useSelectedItem } from "../hooks/useSelectedItem";
import { isHotel, isCountry, isCity } from "../types/typeGuards";
import Loading from "./Loading";
import NotFound from "./NotFound";
import HotelList from "./HotelList";

function SelectedItem() {
  const { selectedItem, relatedHotels, loading, type } = useSelectedItem();

  if (loading) return <Loading />;
  if (!selectedItem) return <NotFound type={type || "Item"} />;

  return (
    <div className="container justify-content-center mt-4">
      <div className="card shadow-lg p-4 selected-item-card">
        <div className="card-body text-center">
          {isHotel(selectedItem) ? (
            <>
              <h2 className="card-title">{selectedItem.hotel_name}</h2>
              <p className="text-muted">
                {selectedItem.chain_name || "No chain"}
              </p>
              <hr />
              <p>
                <strong>Address:</strong> {selectedItem.addressline1}
                {selectedItem.addressline2 && `, ${selectedItem.addressline2}`}
              </p>
              <p>
                <strong>City:</strong> {selectedItem.city}, {selectedItem.state}{" "}
                - {selectedItem.country} ({selectedItem.countryisocode})
              </p>
              <p>
                <strong>Star Rating:</strong> {selectedItem.star_rating}/5
              </p>
            </>
          ) : isCountry(selectedItem) ? (
            <>
              <h2 className="card-title">{selectedItem.country}</h2>
              <HotelList
                hotels={relatedHotels}
                title={`Hotels in ${selectedItem.country}`}
              />
            </>
          ) : isCity(selectedItem) ? (
            <>
              <h2 className="card-title">{selectedItem.name}</h2>
              <HotelList
                hotels={relatedHotels}
                title={`Hotels in ${selectedItem.name}`}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SelectedItem;
