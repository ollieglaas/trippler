import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// import { getPlaceDetails, PHOTO_REF_URL } from "@/service/globalAPI";
import { DailyPlan, ItineraryDay } from "@/types/globalTypes";
import clsx from "clsx";
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

interface ItineraryCardProps {
  plan: DailyPlan;
  i: number;
  day: ItineraryDay;
}

function ItineraryCard({ plan, i, day }: ItineraryCardProps) {
  const {
    placeName,
    placeDetails,
    rating,
    pricing,
    tickets,
    bestTimeToVisit,
    geoCoordinates,
    timeToComplete,
  } = plan;
  //   const [photoUrl, setPhotoUrl] = useState("");

  //   const getPlacePhoto = async () => {
  //     try {
  //       const data = { textQuery: placeName };
  //       const res = await getPlaceDetails(data);
  //       console.log(`photos data: `, res?.data.places[0].photos[3].name);
  //       const photoUrl = PHOTO_REF_URL.replace(
  //         "{NAME}",
  //         res?.data.places[0].photos[3].name
  //       );
  //       setPhotoUrl(photoUrl);
  //     } catch (error) {
  //       console.error("Error fetching place details:", error);
  //     }
  //   };

  //   useEffect(() => {
  //     if (plan) {
  //       getPlacePhoto();
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [plan]);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Link
      className="cursor-pointer hover:translate-x-1 transition-all duration-200 ease-in-out"
      to={
        `https://www.google.com/maps/search/?api=1&query=` +
        geoCoordinates.latitude +
        "," +
        geoCoordinates.longitude
      }
      target="_blank"
    >
      <div>
        <h2 className="font-normal text-gray-600 text-lg">{placeName}</h2>
        <p className="text-gray-400 text-sm">{placeDetails}</p>
        <div
          className="flex flex-row flex-wrap mt-4 gap-4 overflow-hidden"
          ref={containerRef}
        >
          {rating !== "N/A" && (
            <InfoBadge>
              <span>⭐️</span>
              <span className="text-sm">{rating}</span>
            </InfoBadge>
          )}
          {pricing !== "N/A" && (
            <InfoBadge>
              <span>💸</span>
              <ScrollingText containerRef={containerRef}>
                <span className="text-sm">{pricing}</span>
              </ScrollingText>
            </InfoBadge>
          )}
          {tickets !== undefined && (
            <InfoBadge>
              <span>🎫</span>
              <span className="text-sm">
                {tickets ? "Ticket" : "No Ticket"}
              </span>
            </InfoBadge>
          )}
          {bestTimeToVisit !== "N/A" && (
            <InfoBadge>
              <span>⏱️</span>
              <span className="text-sm">{bestTimeToVisit}</span>
            </InfoBadge>
          )}
          {timeToComplete !== "N/A" && (
            <InfoBadge>
              <span>⏳</span>
              <ScrollingText containerRef={containerRef}>
                <span className="text-sm">{timeToComplete}</span>
              </ScrollingText>
            </InfoBadge>
          )}
        </div>
      </div>
      {/* <div className="col-span-2">
        <img
          src={photoUrl}
          alt={placeName}
          className="w-full h-[150px] object-cover rounded-lg"
        />
      </div> */}
      {i !== day.dailyPlan.length - 1 && <Separator className="mt-8" />}
    </Link>
  );
}

const InfoBadge = ({ children }: PropsWithChildren) => {
  return (
    <Badge
      className="font-bold flex flex-row items-center gap-2"
      variant={"secondary"}
    >
      {children}
    </Badge>
  );
};

const ScrollingText = ({
  children,
  containerRef,
}: {
  children: ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) return;

    const checkOverflow = () => {
      setIsOverflowing(text.scrollWidth > container.clientWidth);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [children, containerRef]);

  return (
    <div
      className="relative overflow-hidden whitespace-nowrap" // adjust max-w as needed
    >
      <div
        ref={textRef}
        className={clsx("inline-block", isOverflowing && "animate-scroll")}
      >
        {children}
      </div>
    </div>
  );
};

export default ItineraryCard;
