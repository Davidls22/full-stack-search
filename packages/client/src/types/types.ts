export type Hotel = {
  _id: string;
  hotel_name: string;
  chain_name?: string;
  addressline1: string;
  addressline2?: string;
  zipcode?: string;
  city: string;
  state?: string;
  country: string;
  countryisocode: string;
  star_rating: number;
};

export type Country = { _id: string; country: string };
export type City = { _id: string; name: string };

export type SearchResults = {
  hotels: Hotel[];
  countries: Country[];
  cities: City[];
};

export type SelectedItemType = Hotel | Country | City | null;
