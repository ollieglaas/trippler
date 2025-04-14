import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/service/firebaseConfig";
// import { getPlaceDetails, PHOTO_REF_URL } from "@/service/globalAPI";
import {
  DailyPlan,
  ItineraryDay,
  TimelineSelections,
} from "@/types/globalTypes";
import clsx from "clsx";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ItineraryCardProps {
  plan: DailyPlan;
  i: number;
  day: ItineraryDay;
  documentId: string;
  timelineSelections: TimelineSelections[];
  setTimelineSelections: React.Dispatch<
    React.SetStateAction<TimelineSelections[]>
  >;
}

function ItineraryCard({
  plan,
  i,
  documentId,
  day,
  timelineSelections,
  setTimelineSelections,
}: ItineraryCardProps) {
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

  const saveTimelineAction = async ({
    date,
    dailyPlan,
  }: TimelineSelections) => {
    const user = JSON.parse(localStorage.getItem("travel_planner_user")!);

    const actionRef = doc(db, "TimelineActions", documentId);
    const docSnap = await getDoc(actionRef);

    const newAction = {
      documentId,
      userEmail: user.email,
      date,
      dailyPlan,
    };

    if (docSnap.exists()) {
      await updateDoc(actionRef, {
        actions: arrayUnion(newAction),
      });
    } else {
      await setDoc(actionRef, {
        actions: [newAction],
      });
    }

    await updateDoc(actionRef, {
      actions: arrayUnion({
        documentId,
        userEmail: user.email,
        date,
        dailyPlan,
      }),
    });
  };

  const handleAddToTimeline = async () => {
    try {
      await saveTimelineAction({
        date: day.date,
        dailyPlan: [plan],
      });

      setTimelineSelections((prev) => {
        const existingDate = prev.find((sel) => sel.date === day.date);
        if (existingDate) {
          const alreadyAdded = existingDate.dailyPlan.some(
            (p) => p.placeName === plan.placeName
          );
          if (alreadyAdded) return prev;

          return prev.map((sel) =>
            sel.date === day.date
              ? {
                  ...sel,
                  dailyPlan: [...sel.dailyPlan, plan],
                }
              : sel
          );
        } else {
          return [...prev, { date: day.date, dailyPlan: [plan] }];
        }
      });

      toast.success("Added to your timeline!");
    } catch (err) {
      console.error("Failed to save timeline action:", err);
      toast.error("Could not save timeline item.");
    }
  };

  return (
    <Link
      className="cursor-pointer hover:translate-x-1 transition-all duration-200 ease-in-out "
      to={
        `https://www.google.com/maps/search/?api=1&query=` +
        geoCoordinates.latitude +
        "," +
        geoCoordinates.longitude
      }
      target="_blank"
    >
      <div>
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-normal text-gray-600 text-lg">{placeName}</h2>
          {timelineSelections.some(
            (selection) =>
              selection.date === day.date &&
              selection.dailyPlan.some((p) => p.placeName === plan.placeName)
          ) ? (
            <Button
              variant={"outline"}
              className="rounded-full bg-green-100"
              disabled
            >
              <span className="text-sm text-green-900 font-bold">✓</span>
            </Button>
          ) : (
            <Button
              variant={"outline"}
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleAddToTimeline();
              }}
            >
              <span className="text-xl text-gray-400 font-light">+</span>
            </Button>
          )}
        </div>
        <p className="text-gray-400 text-sm w-11/12">{placeDetails}</p>
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
