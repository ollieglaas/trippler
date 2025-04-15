import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import destinationPics from "@/constants/destinationPics.json";
import { getPhoto } from "@/service/globalAPI";
import { Trip } from "@/types/globalTypes";
import { useEffect, useState } from "react";

interface TripDataProps {
  tripData: Trip;
}

function TripInformation({ tripData }: TripDataProps) {
  const { destination, people, dates, budget } = tripData.userSelection;
  const tripNotes = tripData?.tripData?.travelPlan?.["tripNotes:"]; // Use bracket notation

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const getPlacePhoto = async () => {
    try {
      const mainText = destination!.value!.structured_formatting!
        .main_text as keyof typeof destinationPics;
      const matchedValue = destinationPics[mainText];

      if (matchedValue) {
        setPhotoUrl(matchedValue);
        return;
      }

      const photoUrl = await getPhoto(destination.label);
      if (photoUrl) {
        setPhotoUrl(photoUrl);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  useEffect(() => {
    if (tripData) {
      getPlacePhoto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripData]);

  return (
    <Card className="pt-0 mb-20">
      <img
        src={photoUrl || `/placeholder.jpg`}
        alt="placeholder"
        className="h-[340px] w-full object-cover rounded-t-xl"
      />
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-5 px-4">
        <h1 className="font-medium text-2xl cursor-pointer">
          {destination.label || "Trip Name"}
        </h1>
        <div className="flex flex-row gap-2 flex-wrap">
          <Badge variant={"secondary"} className="py-2 px-4 space-x-1">
            <span>👤</span>
            <span className="text-sm">
              {people || "0"} traveller{people !== "1" ? "s" : ""}
            </span>
          </Badge>
          <Badge variant={"secondary"} className="py-2 px-3 space-x-1">
            <span>📅</span>
            <span className="text-sm">
              {dates?.start} - {dates?.end}
            </span>
          </Badge>
          <Badge variant={"secondary"} className="py-2 px-3 space-x-1">
            <span>💰</span>
            <span className="text-sm">{budget}</span>
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {tripNotes.map((note) => {
          const [title, ...contentParts] = note.split(":");
          const content = contentParts.join(":").trim();
          return (
            <Card className="col-span-1 p-0 border-none shadow-none">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="-mt-5">
                <p className="text-gray-400 text-xs">{content}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}

export default TripInformation;
