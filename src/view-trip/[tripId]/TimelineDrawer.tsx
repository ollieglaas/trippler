import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { BsStars } from "react-icons/bs";

import { TimelineSelections, Trip, DailyPlan } from "@/types/globalTypes";
import { Badge } from "@/components/ui/badge";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

interface TimelineDrawerProps {
  tripData: Trip | null;
  timelineSelections: TimelineSelections[];
  setTimelineSelections: React.Dispatch<
    React.SetStateAction<TimelineSelections[]>
  >;
}

function TimelineDrawer({
  tripData,
  timelineSelections,
  setTimelineSelections,
}: TimelineDrawerProps) {
  const groupedSelections = timelineSelections.reduce((acc, selection) => {
    if (!acc[selection.date]) {
      acc[selection.date] = [];
    }
    acc[selection.date].push(...selection.dailyPlan);
    return acc;
  }, {} as Record<string, DailyPlan[]>);

  const { tripId } = useParams();

  const fetchTimelineActions = async () => {
    if (!tripId) return;

    const timelineRef = doc(db, "TimelineActions", tripId);
    const docSnap = await getDoc(timelineRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Ensure data is in the correct format
      if (Array.isArray(data.actions)) {
        setTimelineSelections(data.actions);
      } else {
        console.error("Timeline data is not in the expected format");
        setTimelineSelections([]);
      }
    } else {
      console.log("No timeline data found");
      setTimelineSelections([]);
    }
  };

  useEffect(() => {
    fetchTimelineActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const handleDeleteTimelineAction = async ({
    dayDate,
    planName,
  }: {
    dayDate: string;
    planName: string;
  }) => {
    const updatedSelections = timelineSelections
      .map((selection) => {
        if (selection.date !== dayDate) return selection;

        return {
          ...selection,
          dailyPlan: selection.dailyPlan.filter(
            (p) => p.placeName !== planName
          ),
        };
      })
      .filter((selection) => selection.dailyPlan.length > 0);

    // Update state
    setTimelineSelections(updatedSelections);

    // Update Firestore
    await setDoc(doc(db, "TimelineActions", tripId!), {
      actions: updatedSelections,
    });
    toast.success("Timeline action deleted successfully!");
  };

  return (
    <Sheet>
      <SheetTrigger>
        <Button className="rounded-xl" variant="outline">
          <BsStars />
          My Timeline
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="text-2xl">My Personal Timeline</SheetTitle>
          <SheetDescription className="flex flex-col lg:flex-row gap-4 overflow-y-scroll  lg:overflow-x-scroll max-h-[28vh]">
            {/* <p>
                  Here you can view your own personal itinerary, created by you
                  based on the itinerary suggestions.
                </p> */}
            {tripData?.tripData.itinerary.map((day) => (
              <div className="pt-4 min-w-[33%]">
                <h3 className="text-xl font-semibold mb-4">
                  {format(new Date(day.date), "EEEE, MMMM d")}
                </h3>

                <div className="flex flex-col lg:flex-row gap-4 ">
                  {groupedSelections[day.date] &&
                  groupedSelections[day.date].length > 0 ? (
                    <div className=" rounded-lg w-full overflow-y-scroll overflow-x-hidden">
                      <div className="space-y-4">
                        {groupedSelections[day.date].map((plan, index) => (
                          <div
                            key={index}
                            className="border shadow-md rounded-lg p-4"
                          >
                            <div className="flex flex-row justify-between items-center">
                              <h4 className="font-medium text-lg">
                                {plan.placeName}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleDeleteTimelineAction({
                                    dayDate: day.date,
                                    planName: plan.placeName,
                                  });
                                }}
                              >
                                <span className="text-lg">×</span>
                              </Button>
                            </div>
                            {/* <p className="text-gray-600 text-sm mt-1">
                              {plan.placeDetails}
                            </p> */}

                            <div className="flex flex-wrap gap-2 mt-3">
                              {plan.rating !== "N/A" && (
                                <Badge variant="outline">
                                  <span>⭐️</span> {plan.rating}
                                </Badge>
                              )}
                              {plan.pricing !== "N/A" && (
                                <Badge variant="outline">
                                  <span>💸</span> {plan.pricing}
                                </Badge>
                              )}
                              {plan.tickets !== undefined && (
                                <Badge variant="outline">
                                  <span>🎫</span>{" "}
                                  {plan.tickets ? "Ticket" : "No Ticket"}
                                </Badge>
                              )}
                              {plan.bestTimeToVisit !== "N/A" && (
                                <Badge variant="outline">
                                  <span>⏱️</span> {plan.bestTimeToVisit}
                                </Badge>
                              )}
                              {plan.timeToComplete !== "N/A" && (
                                <Badge variant="outline">
                                  <span>⏳</span> {plan.timeToComplete}
                                </Badge>
                              )}
                            </div>

                            {/* {index < groupedSelections[day.date].length - 1 && (
                              <Separator className="my-4" />
                            )} */}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No activities selected for this day
                    </p>
                  )}
                </div>
              </div>
            ))}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          {/* <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default TimelineDrawer;
