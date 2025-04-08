import { AI_PROMPT } from "@/constants/options";
import { formSchema } from "@/schema/formSchema";
import { chatSession } from "@/service/AIModel";
import { db } from "@/service/firebaseConfig";
import { FormDataType } from "@/types/globalTypes";
import { doc, setDoc } from "firebase/firestore";
import { useRef, useState } from "react";
// import { addDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FormInputs from "./FormInputs";

function CreateTrip() {
  const [formData, setFormData] = useState<FormDataType>({
    destination: null,
    dates: {
      // start: new Date(),
      // end: addDays(new Date(), 7),
      start: undefined,
      end: undefined,
    },
    budget: "",
    people: "",
  });

  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const clearProgressInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const simulateProgress = (
    startPercent: number,
    endPercent: number,
    estimatedDuration: number
  ) => {
    clearProgressInterval();
    const totalIncrement = endPercent - startPercent;
    const intervalTime = 200;
    const numIntervals = estimatedDuration / intervalTime;
    const incrementAmount = totalIncrement / numIntervals;
    const maxPercent = endPercent - 0.1;

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const nextVal = prev + incrementAmount;
        if (nextVal >= maxPercent) {
          clearProgressInterval();
          return maxPercent;
        }
        return nextVal;
      });
    }, intervalTime);
  };

  const handleGenerateTrip = async () => {
    const user = localStorage.getItem("travel_planner_user");
    if (!user) {
      setModalOpen(true);
      return;
    }

    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      const errorMessages: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errorMessages[field] = issue.message;
      });

      setErrors(errorMessages);
      return;
    }
    try {
      setErrors({});
      const FINAL_PROMPT = AI_PROMPT.replace(
        "{location}",
        formData.destination!.label
      )
        .replace(/{startDate}/g, formData.dates.start!.toString())
        .replace(/{endDate}/g, formData.dates.end!.toString())
        .replace("{people}", formData.people!)
        .replace("{budget}", formData.budget!);

      // console.log("Final prompt: ", FINAL_PROMPT);
      setLoading(true);
      simulateProgress(0, 90, 20000);
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      clearProgressInterval();
      setProgress(90);
      simulateProgress(90, 100, 5000);
      // console.log(result?.response?.text());
      console.log("Trip data is this: ", result?.response?.text());
      saveTrip(result?.response?.text());
      toast("Trip generated successfully!");
    } catch (error) {
      console.error("Error generating trip:", error);
      setErrors({ general: "Failed to generate trip. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = async (tripData: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("travel_planner_user")!);
      if (!user) {
        console.error("No user found in localStorage.");
        return;
      }

      const documentId = Date.now().toString();

      let parsedTripData;
      try {
        const cleanData = tripData.replace(/```json|```/g, ""); // removing ```json or ```
        parsedTripData = JSON.parse(cleanData);
      } catch (error) {
        console.error("Failed to parse tripData: ", parsedTripData, error);
        setErrors({ general: "Trip data could not be processed." });
        return;
      }

      await setDoc(doc(db, "AITrips", documentId), {
        userSelection: formData,
        tripData: parsedTripData,
        userEmail: user.email,
        id: documentId,
      });

      clearProgressInterval();
      setProgress(100);

      console.log(
        "Trip saved successfully, navigating to:",
        `/view-trip/${documentId}`
      );
      setTimeout(() => {
        navigate(`/view-trip/${documentId}`);
      }, 1000);
    } catch (error) {
      console.error("Error saving trip:", error);
      setErrors({ general: "Failed to save trip. Please try again." });
      clearProgressInterval();
    }
  };

  return (
    <div className="px-8 sm:px-10 md:px-20 lg:px-32 xl:px-56 pt-10 bg-gray-50">
      <h1 className="text-4xl font-bold text-left">Create a Trip</h1>

      <div className="mt-5">
        <h2 className="font-bold text-2xl">
          Start off with letting us know your preferences
        </h2>
        <p className="mt-3 text-gray-500 text-md">
          Just provide some basic information, and our trip planner will
          generate a customised itinerary based on your preferences
        </p>
      </div>

      <FormInputs
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        handleGenerateTrip={handleGenerateTrip}
        loading={loading}
        setLoading={setLoading}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        progress={progress}
      />
    </div>
  );
}

export default CreateTrip;
