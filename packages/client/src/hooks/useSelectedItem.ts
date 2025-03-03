import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchSelectedItem,
  fetchHotelsByCity,
  fetchHotelsByCountry,
} from "../services/api";
import { SelectedItemType, Hotel } from "../types/types";

export function useSelectedItem() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [selectedItem, setSelectedItem] = useState<SelectedItemType>(null);
  const [relatedHotels, setRelatedHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type || !id || !["hotel", "country", "city"].includes(type)) {
      setError(type ? `Invalid type: ${type}` : null);
      setSelectedItem(null);
      setRelatedHotels([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchSelectedItem(
          type as "hotel" | "country" | "city",
          id
        );
        setSelectedItem(data);

        if (data) {
          const fetchHotels =
            type === "city"
              ? fetchHotelsByCity(data.name)
              : type === "country"
              ? fetchHotelsByCountry(data.country)
              : null;

          if (fetchHotels) setRelatedHotels(await fetchHotels);
        }
      } catch {
        setError(`Error fetching ${type}`);
        setSelectedItem(null);
        setRelatedHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  return { selectedItem, relatedHotels, loading, error, type };
}
