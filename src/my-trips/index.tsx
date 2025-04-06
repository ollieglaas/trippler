import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "@/service/firebaseConfig";
import { Trip } from "@/types/globalTypes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import destinationPics from "@/constants/destinationPics.json";
import { getPlaceDetails, PHOTO_REF_URL } from "@/service/globalAPI";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteAlert from "@/components/DeleteAlert";

function MyTrips() {
  const storedUser = localStorage.getItem("travel_planner_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [tripPhotos, setTripPhotos] = useState<{ [tripId: string]: string }>(
    {}
  );

  const getUserTrips = useCallback(async () => {
    if (!user?.email) return;

    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", user.email)
    );

    try {
      const querySnapshot = await getDocs(q);
      const trips: Trip[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Trip[];

      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  }, [user]);

  const deleteTrip = async (tripId: string) => {
    const tripRef = doc(db, "AITrips", tripId);
    try {
      await deleteDoc(tripRef);
      setUserTrips((prev) => prev.filter((trip) => trip.id !== tripId));
    } catch (error) {
      console.error("Error deleting trip: ", error);
    }
  };

  const getPlacePhoto = async (trip: Trip) => {
    try {
      const mainText = trip.userSelection.destination!.value!
        .structured_formatting!.main_text as keyof typeof destinationPics;
      const matchedValue = destinationPics[mainText];

      if (matchedValue) {
        setTripPhotos((prev) => ({ ...prev, [trip.id]: matchedValue }));
        return;
      }

      const data = { textQuery: trip.userSelection.destination.label };
      const res = await getPlaceDetails(data);

      if (res?.data?.places[0]?.photos?.[3]?.name) {
        const photoUrl = PHOTO_REF_URL.replace(
          "{NAME}",
          res.data.places[0].photos[3].name
        );
        setTripPhotos((prev) => ({ ...prev, [trip.id]: photoUrl }));
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
    }
  };

  useEffect(() => {
    getUserTrips();
  }, [getUserTrips]);

  useEffect(() => {
    userTrips.forEach((trip) => {
      if (!tripPhotos[trip.id]) {
        getPlacePhoto(trip);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTrips]);

  return (
    <div className="px-8 sm:px-10 md:px-20 lg:px-32 xl:px-56 pt-10">
      <h1 className="text-4xl font-bold text-left mb-10">My Trips</h1>

      {userTrips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {userTrips.map((trip) => (
            <Card
              key={trip.id}
              className="pt-0 px-0 pb-4 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-100 ease-in-out h-full"
            >
              <CardHeader className="px-0">
                <div className="relative">
                  <DeleteAlert
                    modalOpen={deleteModalOpen}
                    setModalOpen={setDeleteModalOpen}
                    deleteTrip={deleteTrip}
                    tripId={trip.id}
                  />
                  <Link to={`/view-trip/${trip.id}`}>
                    <img
                      src={tripPhotos[trip.id] || "/placeholder.jpg"}
                      alt="placeholder"
                      className="h-[200px] w-full object-cover"
                    />
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col justify-between gap-2 h-full">
                <Link to={`/view-trip/${trip.id}`}>
                  <div>
                    <h4>{trip.userSelection.destination.label}</h4>
                    <p className="text-gray-400 text-sm my-2">
                      {trip.userSelection.dates.start} -{" "}
                      {trip.userSelection.dates.end}
                    </p>
                  </div>

                  <div>
                    <span className="mr-2">💰</span>
                    <span className="text-gray-500 text-sm">
                      {trip.userSelection.budget} budget
                    </span>
                  </div>

                  <div>
                    <span className="mr-2">👤</span>
                    <span className="text-gray-500 text-sm">
                      {trip.userSelection.people} traveller
                      {trip.userSelection.people !== "1" && "s"}
                    </span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl mb-9" />
              <div className="space-y-5">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[130px]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrips;
