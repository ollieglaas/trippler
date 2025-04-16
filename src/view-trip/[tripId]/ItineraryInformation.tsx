import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimelineSelections, Trip } from "@/types/globalTypes";
import { format } from "date-fns";
import ItineraryCard from "./ItineraryCard";
import TimelineDrawer from "./TimelineDrawer";
import { useState } from "react";

export interface ItineraryInformationProps {
  tripData: Trip | null;
}

function ItineraryInformation({ tripData }: ItineraryInformationProps) {
  const [timelineSelections, setTimelineSelections] = useState<
    TimelineSelections[]
  >([]);

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl lg:text-3xl font-extralight tracking-wider">
          Itinerary Suggestions
        </h2>
        <TimelineDrawer
          tripData={tripData}
          timelineSelections={timelineSelections}
          setTimelineSelections={setTimelineSelections}
        />
      </div>
      <div className="flex flex-col w-full gap-8 mt-5">
        {tripData?.tripData?.itinerary &&
        tripData.tripData.itinerary.length > 0 ? (
          tripData.tripData.itinerary.map((day, index) => (
            <Card key={index} className="shadow-md">
              <div>
                <CardHeader>
                  <CardTitle className="flex flex-col gap-1 mb-4">
                    <span className="font-normal text-gray-500 text-sm">
                      {format(new Date(day.date), "EEEE, MMMM d")}
                    </span>
                    <span className="text-red-800 text-xl font-semibold tracking-wide">
                      {day.theme}
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-8">
                  {day.dailyPlan.map((plan, i) => {
                    return (
                      <ItineraryCard
                        plan={plan}
                        i={i}
                        day={day}
                        key={i}
                        documentId={tripData.id}
                        timelineSelections={timelineSelections}
                        setTimelineSelections={setTimelineSelections}
                      />
                    );
                  })}
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <p>No itinerary suggestions available.</p>
        )}
      </div>
    </>
  );
}

export default ItineraryInformation;
