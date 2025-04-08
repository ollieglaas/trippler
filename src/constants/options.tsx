export const SelectTravelList = [
  {
    id: 1,
    title: "Just Me",
    description: "For the solo explorers",
    icon: "✈️",
    people: "1",
  },
  {
    id: 2,
    title: "Couple",
    description: "For the dynamic duos",
    icon: "🥂",
    people: "2",
  },
  {
    id: 3,
    title: "Family",
    description: "For the family adventurers (3-5 people)",
    icon: "👨‍👩‍👧‍👦",
    people: "3-5",
  },
  {
    id: 4,
    title: "Friends",
    description: "For when it's a full house (6+ people)",
    icon: "🎉",
    people: "6+",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    description: "Stay concious of costs",
    icon: "💵",
  },
  {
    id: 2,
    title: "Moderate",
    description: "A balance between cost and comfort",
    icon: "💳",
  },
  {
    id: 3,
    title: "Luxury",
    description: "Indulge in the finer things in life",
    icon: "💎",
  },
];

export const AI_PROMPT = `Generate a travel plan for location: {location}, from {startDate} to {endDate}, for {people} traveller(s) with a {budget} budget. Return a list of hotel options with the hotel name, hotel description, geoCoordinates, hotel address, an image of the hotel, price, and rating. Suggest an itinerary for each day and for each plan - return the place name, place details, an image of the place, price, geoCoordinates, rating, whether you need a ticket or not, best time of day to visit and a rough idea of how long it takes to complete this activity. Include an overall travel plan which specifies the trip duration and any useful notes about the trip (each note starts with a subject eg 'Walking:' or 'Transport:' before the note). Return the response in the following JSON format, returning only valid raw JSON without any extra text, markdown formatting or code blocks. Also do not include triple backticks or any other characters outside of valid JSON. The JSON should be formatted as follows:

{
		"hotelOptions": [
			{
				"description": "",
				"geoCoordinates": {
					"latitude": "",
					"longitude": "",
				},
				"hotelAddress": "",
				"hotelImageURL": "",
				"hotelName": "",
				"price": "",
				"rating": ""
			}
		],
		"itinerary": [
			{
				"day": "",
				"date": "",
				"theme": "",
				"dailyPlan": [
					{
						"bestTimeToVisit": "",
						"geoCoordinates": {
							"latitude": "",
							"longitude": "",
						},
						"placeDetails": "",
						"placeName": "",
						"placeImageURL": "",
						"pricing": "",
						"rating": "",
						"tickets": false,
						"timeToComplete": ""
					}
				]
			}
		],
		"travelPlan": {
			"tripDuration": "",
			"tripNotes:": [""]
		}
	
}`;
