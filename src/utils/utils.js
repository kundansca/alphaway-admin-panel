import React, { useState } from "react";
import ApiUrlConfig from "../config/ApiUrlConfig";

const convertToUrl = (name = "") => name.trim().toLowerCase().replace(/\s+/g, '-');
const renameFile = (name = "") => name.trim().toLowerCase().replace(/\s+/g, '_');

export const formatUrlSegment = convertToUrl;

export const currencySign = (countryName = "") => {
  const currencyMap = {
    "australia": "AUD",
    "eurozone": "€",
    "united-kingdom": "£",
    "canada": "CAD",
    "china": "CNY",
    "egypt": "EGP",
    "india": "INR",
    "japan": "JPY",
    "mexico": "MXN",
    "russia": "RUB",
    "united-arab-emirates": "AED",
    "uae": "AED",
    "united-states": "USD",
    "portugal": "€"
  };

  return currencyMap[countryName.toLowerCase()] || "Unknown";
};

export const amenitiesIcon = (amenitiesName = "") => {
  const amenitiesMap = [
    { text: "Small Double Bed", icon: "fa-bed" },
    { text: "Double Bed", icon: "fa-bed" },
    { text: "Sofa", icon: "fa-couch" },
    { text: "Lounge", icon: "fa-chair" },
    { text: "Window", icon: "fa-window-maximize" },
    { text: "Mirror", icon: "fa-image" },
    { text: "Bookshelf", icon: "fa-book" },
    { text: "Private Bathroom", icon: "fa-bath" },
    { text: "En-suite Bathroom", icon: "fa-shower" },
    { text: "Shared Bathroom", icon: "fa-toilet" },
    { text: "Shavepoint", icon: "fa-plug" },
    { text: "Private Kitchen", icon: "fa-utensils" },
    { text: "Wardrobe", icon: "fa-door-closed" },
    { text: "Shared Kitchen", icon: "fa-utensils" },
    { text: "Kitchenette", icon: "fa-coffee" },
    { text: "Breakfast Bar", icon: "fa-coffee" },
    { text: "Coffee Table", icon: "fa-coffee" },
    { text: " Chest of Drawers", icon: "fa-couch" },
    { text: "Dinning Table", icon: "fa-table" },
    { text: "Dishwasher", icon: "fa-tint" },
    { text: "Oven", icon: "fa-fire-burner" },
    { text: "Microwave", icon: "fa-microchip" },
    { text: "Induction Hob", icon: "fa-fire" },
    { text: "Dining Table", icon: "fa-wine-glass" },
    { text: "Hob", icon: "fa-fire" },
    { text: "Fridge", icon: "fa-snowflake" },
    { text: "Freezer", icon: "fa-icicles" },
    { text: "Sink", icon: "fa-tint" },
    { text: "Study Desk & Chair", icon: "fa-chair" },
    { text: "Common Study Area", icon: "fa-book-open" },
    { text: "Study Area", icon: "fa-laptop" },
    { text: "Cinema Room", icon: "fa-film" },
    { text: "Games Room", icon: "fa-gamepad" },
    { text: "Social Spaces", icon: "fa-users" },
    { text: "Communal Area", icon: "fa-building" },
    { text: "Communal Lounge", icon: "fa-couch" },
    { text: "Karaoke Room", icon: "fa-microphone" },
    { text: "Gym", icon: "fa-dumbbell" },
    { text: "Parking", icon: "fa-car" },
    { text: "Bike Storage", icon: "fa-bicycle" },
    { text: "Underbed Storage", icon: "fa-box" },
    { text: "CCTV", icon: "fa-video" },
    { text: "24/7 Security", icon: "fa-shield-alt" },
    { text: "24/7 Staff", icon: "fa-user-shield" },
    { text: "Free Wifi", icon: "fa-wifi" },
    { text: "Laundry", icon: "fa-tshirt" },
    { text: "Free Contents Insurance", icon: "fa-file-invoice-dollar" },
    { text: "All Bills Inclusive", icon: "fa-dollar-sign" },
    { text: "TV in Shared Space", icon: "fa-tv" },
    { text: "TV in Bedroom", icon: "fa-tv" },
    { text: "City View", icon: "fa-city" },
    { text: "Canal View", icon: "fa-water" },
    { text: "City Centre", icon: "fa-map-marker-alt" },
    { text: "Combination Microwave", icon: "fa-box" }
  ];

  const amenity = amenitiesMap.find(item => item.text.toLowerCase() === amenitiesName.toLowerCase());
  return amenity ? amenity.icon : "fa-circle";
};

export const convertDate = (inputDate = "") => {
  try {
    const [day, month, year] = inputDate.split("/");
    const monthNames = {
      "01": "January", "02": "February", "03": "March", "04": "April",
      "05": "May", "06": "June", "07": "July", "08": "August",
      "09": "September", "10": "October", "11": "November", "12": "December"
    };
    const monthName = monthNames[month] || "Unknown";
    return `22 ${monthName} ${year}`;
  } catch (error) {
    console.error("Date conversion failed:", error);
    return "";
  }
};

export const propertyFstImgUrl = (country, property, image, provider) => {
  if (image?.startsWith("http")) return image;
  return `/assets/${convertToUrl(country)}/${convertToUrl(provider)}/${convertToUrl(property)}/property-images/${image}`;
};

export const roomsImgUrl = (country, provider, property, room, image) => {
  if (image?.startsWith("http")) return image;
  return `/assets/${convertToUrl(country)}/${convertToUrl(provider)}/${convertToUrl(property)}/${convertToUrl(room)}/${convertToUrl(image)}`;
};

export const CityImageUrl = ({ cityName }) => {
  const [imgSrc, setImgSrc] = useState(`/assets/city-images/${convertToUrl(cityName)}.jpg`);

  const handleError = () => setImgSrc(ApiUrlConfig.CITY_DEFAULT_IMG);

  return (
    <img
      src={imgSrc}
      alt={cityName}
      loading="lazy"
      onError={handleError}
      style={{ width: "450px", height: "300px" }}
    />
  );
};

export const convertUrlToStr = (str = "") =>
  str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export const getCountryIdByName = (countries = [], name = "") => {
  const formatted = convertUrlToStr(name).toLowerCase();
  return countries.find(c => convertUrlToStr(c.name).toLowerCase() === formatted)?.id || null;
};

export const getCountryDataId = (countries = [], name = "") => {
  const formatted = convertUrlToStr(name).toLowerCase().trim();
  return countries.find(c => convertUrlToStr(c.name).toLowerCase().trim() === formatted) || null;
};

export const formatDateToLocalInput = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // Months are 0-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};