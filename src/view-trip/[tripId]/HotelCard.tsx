import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getPlaceDetails, PHOTO_REF_URL } from "@/service/globalAPI";
import { HotelOption } from "@/types/globalTypes";
import { useState, useEffect } from "react";

const HotelCard = ({ hotel }: { hotel: HotelOption }) => {
  const { hotelName, description, hotelAddress, price, rating } = hotel;
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const getPlacePhoto = async () => {
    try {
      const data = { textQuery: hotelName };
      const res = await getPlaceDetails(data);
      // console.log(`photos data: `, res?.data.places[0].photos[3].name);
      const photoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        res?.data.places[0].photos[3].name
      );
      setPhotoUrl(photoUrl);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  useEffect(() => {
    if (hotel) {
      getPlacePhoto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel]);

  return (
    <Card className="pt-0 overflow-hidden border-none shadow-md hover:shadow-sm cursor-pointer hover:scale-105 transition-transform duration-100 ease-in-out h-full">
      <CardHeader className="px-0">
        <div>
          <img
            src={photoUrl || `/placeholder.jpg`}
            alt="placeholder"
            className="h-[200px] w-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-2 h-full">
        <div>
          <h4>{hotelName}</h4>
          <p className="text-gray-400 text-sm my-2">{description}</p>
        </div>
        <div>
          <span className="mr-2">📍</span>
          <span className="text-gray-500 text-sm">{hotelAddress}</span>
        </div>
        <div>
          <span className="mr-2">💵</span>
          <span className="text-gray-500 text-sm">
            {price.replace("/night", " / night")}
          </span>
        </div>
        <div>
          <span className="mr-2">⭐</span>
          <span className="text-gray-500 text-sm">{rating}</span>
        </div>
      </CardContent>
      {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
    </Card>
  );
};

export default HotelCard;
