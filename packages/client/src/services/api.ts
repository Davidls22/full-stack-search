import { getCodeSandboxHost } from "@codesandbox/utils";

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost
  ? `https://${codeSandboxHost}`
  : "http://localhost:3001";

export async function search(query: string) {
  const res = await fetch(`${API_URL}/search?query=${query}`);
  return res.json();
}

export async function fetchHotelById(id: string) {
  const res = await fetch(`${API_URL}/hotels/${id}`);
  if (!res.ok) throw new Error("Hotel not found");
  return res.json();
}

export async function fetchCountryById(id: string) {
  const res = await fetch(`${API_URL}/countries/${id}`);
  if (!res.ok) throw new Error("Country not found");
  return res.json();
}

export async function fetchCityById(id: string) {
  const res = await fetch(`${API_URL}/cities/${id}`);
  if (!res.ok) throw new Error("City not found");
  return res.json();
}

export async function fetchHotelsByCity(cityName: string) {
  const res = await fetch(
    `${API_URL}/cities/${encodeURIComponent(cityName)}/hotels`
  );
  if (!res.ok) throw new Error("Error fetching hotels for city");
  return res.json();
}

export async function fetchHotelsByCountry(countryName: string) {
  const res = await fetch(
    `${API_URL}/countries/${encodeURIComponent(countryName)}/hotels`
  );
  if (!res.ok) throw new Error("Error fetching hotels for country");
  return res.json();
}

export async function fetchSelectedItem(
  type: "hotel" | "country" | "city",
  id: string
) {
  switch (type) {
    case "hotel":
      return fetchHotelById(id);
    case "country":
      return fetchCountryById(id);
    case "city":
      return fetchCityById(id);
    default:
      throw new Error("Invalid type");
  }
}
