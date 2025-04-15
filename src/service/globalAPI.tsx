import axios from "axios";

const BASE_URL = `https://places.googleapis.com/v1/places:searchText`;

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    "X-Goog-FieldMask": ["places.photos", "places.displayName", "places.id"],
  },
};

export const getPlaceDetails = (data: unknown) => {
  return axios.post(BASE_URL, data, config);
};

export const PHOTO_REF_URL =
  `https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key=` +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

export const getPhoto = async (placeId: string) => {
  try {
    const data = { textQuery: placeId };
    const res = await getPlaceDetails(data);
    const photoRef = res.data.places[0].photos[3].name;
    const photoUrl = PHOTO_REF_URL.replace("{NAME}", photoRef);
    return photoUrl;
  } catch (error) {
    console.error("Error fetching place photo: ", error);
    return null;
  }
};
