import { Hotel, Country, City } from "./types";

export interface HotelListProps {
  hotels: Hotel[];
  title: string;
}

export type SearchBarProps = {
  onSearch: (query: string) => void;
  onClear: () => void;
};

export type ResultSectionProps = {
  title: string;
  items: Hotel[] | Country[] | City[];
  onSelect: (item: Hotel | Country | City) => void;
  query: string;
};

export type ResultsListProps = {
  results: {
    hotels: Hotel[];
    countries: Country[];
    cities: City[];
  };
  loading: boolean;
  query: string;
};

export type NotFoundProps = {
  type: string;
};

export type UseSearchQueryProps = {
  onSearch: (query: string) => void;
  onClear: () => void;
};
