import { HotelOption, Trip } from "@/types/globalTypes";
import { Link } from "react-router-dom";
import HotelCard from "./HotelCard";

interface HotelInformationProps {
  tripData: Trip | null;
}

function HotelInformation({ tripData }: HotelInformationProps) {
  return (
    <>
      <h2 className="text-3xl font-extralight tracking-wider">
        Hotel Recommendations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 mb-20">
        {tripData?.tripData?.hotelOptions?.map(
          (hotel: HotelOption, index: number) => (
            <Link
              to={
                `https://www.google.com/maps/search/?api=1&query=` +
                hotel.hotelName
              }
              target="_blank"
              key={index}
            >
              <HotelCard hotel={hotel} />
            </Link>
          )
        ) || <p>No hotels available.</p>}
      </div>
    </>
  );
}

export default HotelInformation;
