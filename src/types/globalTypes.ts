export interface PlaceValue {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: ReadonlyArray<{
      length: number;
      offset: number;
    }>;
  };
  terms?: ReadonlyArray<{ offset: number; value: string }>;
  types?: ReadonlyArray<string>;
}

export interface DestinationOption {
  label: string;
  value: PlaceValue;
}

export interface FormDataType {
  destination: DestinationOption | null;
  dates: {
    start: Date | undefined;
    end: Date | undefined;
  };
  budget: string | null;
  people: string | null;
}

//dsfsadf

export interface GeoCoordinates {
  latitude: string;
  longitude: string;
}

export interface HotelOption {
  description: string;
  geoCoordinates: GeoCoordinates;
  hotelAddress: string;
  hotelImageURL: string;
  hotelName: string;
  price: string;
  rating: string;
}

export interface DailyPlan {
  bestTimeToVisit: string;
  geoCoordinates: GeoCoordinates;
  placeDetails: string;
  placeName: string;
  placeImageURL: string;
  pricing: string;
  rating: string;
  tickets: boolean;
  timeToComplete: string;
}

export interface ItineraryDay {
  day: string;
  date: string;
  theme: string;
  dailyPlan: DailyPlan[];
}

export interface TravelPlan {
  tripDuration: string;
  ["tripNotes:"]: string[];
}

export interface TripData {
  hotelOptions: HotelOption[];
  itinerary: ItineraryDay[];
  travelPlan: TravelPlan;
}

export interface UserSelection {
  budget: string;
  dates: {
    start: string;
    end: string;
  };
  destination: DestinationOption;
  people: string;
}

export interface Trip {
  id: string;
  userEmail: string;
  tripData: TripData;
  userSelection: UserSelection;
}

export interface TimelineSelections {
  date: string;
  dailyPlan: DailyPlan[];
}

export interface TimelineAction {
  documentId: string;
  userEmail: string;
  date: string;
  dailyPlan: DailyPlan[];
}
