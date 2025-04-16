import { useEffect, useState } from "react";
import { db } from "@/service/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { Trip } from "@/types/globalTypes";
import TripInformation from "./TripInformation";
import HotelInformation from "./HotelInformation";
import ItineraryInformation from "./ItineraryInformation";
import ContentSkeleton from "./ContentSkeleton";
import { useTheme } from "@/components/theme-provider";

function ViewTrip() {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    if (tripId) {
      fetchTripData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  useEffect(() => {
    console.log("Updated tripData: ", tripData);
  }, [tripData]);

  const fetchTripData = async () => {
    if (!tripId) return;

    const documentRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(documentRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Trip;
      setTripData(data);
    } else {
      console.log("No such document!");
    }
    setLoading(false);
  };

  if (loading) {
    return <ContentSkeleton />;
  }

  if (!tripData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No trip data found.</p>
      </div>
    );
  }

  return (
    <div
      className={`py-5 md:py-10 px-4 md:px-20 lg:px-32 xl:px-56 flex flex-col mt-15 ${
        theme === "light" && "bg-gray-100"
      }`}
    >
      <TripInformation tripData={tripData} />
      <HotelInformation tripData={tripData} />
      <ItineraryInformation tripData={tripData} />
    </div>
  );
}

export default ViewTrip;
