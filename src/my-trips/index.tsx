import DeleteAlert from "@/components/DeleteAlert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import destinationPics from "@/constants/destinationPics.json";
import { db } from "@/service/firebaseConfig";
import { getPhoto } from "@/service/globalAPI";
import { Trip } from "@/types/globalTypes";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";

function MyTrips() {
  const storedUser = localStorage.getItem("travel_planner_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [tripPhotos, setTripPhotos] = useState<{ [tripId: string]: string }>(
    {}
  );
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteTrip = async (tripId: string) => {
    const tripRef = doc(db, "AITrips", tripId);
    try {
      console.log("deleting ID: ", tripId);
      await deleteDoc(tripRef);
      setUserTrips((prev) => prev.filter((trip) => trip.id !== tripId));
      setDeleteModalOpen(false);
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

      const photoUrl = await getPhoto(trip.userSelection.destination.label);
      if (photoUrl) {
        setTripPhotos((prev) => ({ ...prev, [trip.id]: photoUrl }));
      }
    } catch (error) {
      console.error("Error fetching place photo:", error);
    }
  };

  const handleDeleteClick = (tripId: string) => {
    setSelectedTripId(tripId);
    setDeleteModalOpen(true);
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
    <div className="px-4 sm:px-10 md:px-20 lg:px-32 xl:px-56 pt-4 mt-15 bg-gray-50">
      <h1 className="text-4xl font-bold text-left mb-4">My Trips</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 mb-10">
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
      ) : userTrips.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 mb-10">
          {userTrips.map((trip) => (
            <Card
              key={trip.id}
              className="pt-0 px-0 pb-4 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-100 ease-in-out h-full"
            >
              <CardHeader className="px-0">
                <div className="relative">
                  {selectedTripId === trip.id && (
                    <DeleteAlert
                      modalOpen={deleteModalOpen}
                      setModalOpen={setDeleteModalOpen}
                      deleteTrip={deleteTrip}
                      tripId={trip.id}
                    />
                  )}
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

              {/* Trigger delete modal onClick */}
              <div
                className="rounded-full p-2 absolute top-2 right-2 cursor-pointer hover:bg-red-400 transition-colors duration-200 ease-in-out"
                onClick={() => handleDeleteClick(trip.id)}
              >
                <RxCross2 color="white" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-xl text-gray-600">
          No trips found. Start creating some trips!
        </div>
      )}
    </div>
  );
}

export default MyTrips;
