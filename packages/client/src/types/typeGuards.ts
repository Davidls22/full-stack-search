import { Hotel, Country, City } from "../types/types";

export const isHotel = (item: unknown): item is Hotel =>
  typeof item === "object" && item !== null && "hotel_name" in item;

export const isCountry = (item: unknown): item is Country =>
  typeof item === "object" && item !== null && "country" in item;

export const isCity = (item: unknown): item is City =>
  typeof item === "object" && item !== null && "name" in item;
