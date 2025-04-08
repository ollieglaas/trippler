import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "@/constants/options";
import { FormDataType } from "@/types/globalTypes";
import { PropsWithChildren, ReactNode, useRef, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import OptionSelect from "./OptionSelect";
import { Button } from "@/components/ui/button";
import { formSchema } from "@/schema/formSchema";
import { chatSession } from "@/service/AIModel";
import LoginAlert from "@/components/LoginAlert";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { DatePicker } from "./DatePicker";
// import { addDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import LoadingAlert from "@/components/LoadingAlert";
import { toast } from "sonner";
import { useUserContext } from "@/context/UserContext";

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
  const { setStoredUser } = useUserContext();
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

  const handleInputChange = <K extends keyof FormDataType>(
    name: K,
    value: FormDataType[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

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

      <InputContainer>
        <InputTitle error={errors.destination}>
          Where would you like to go?
        </InputTitle>

        <GooglePlacesAutocomplete
          apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
          selectProps={{
            value: formData.destination,
            onChange: (value) => {
              handleInputChange("destination", value);
            },
            placeholder: "Search...",
          }}
        />
      </InputContainer>

      <InputContainer>
        <InputTitle error={errors.dates}>
          What dates would you like to travel?
        </InputTitle>
        <DatePicker
          startDate={formData.dates.start}
          endDate={formData.dates.end}
          onDateChange={(range) =>
            handleInputChange("dates", { start: range.from, end: range.to })
          }
        />
      </InputContainer>

      <InputContainer>
        <InputTitle error={errors.budget}>What is your budget?</InputTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SelectBudgetOptions.map((option) => (
            <OptionSelect
              key={option.id}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onClick={() => handleInputChange("budget", option.title)}
              selected={formData.budget === option.title}
            />
          ))}
        </div>
      </InputContainer>

      <InputContainer>
        <InputTitle error={errors.people}>Who's going?</InputTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SelectTravelList.map((option) => (
            <OptionSelect
              key={option.id}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onClick={() => handleInputChange("people", option.people)}
              selected={formData.people === option.people}
            />
          ))}
        </div>
      </InputContainer>

      <Button
        size="lg"
        className="mb-10"
        onClick={handleGenerateTrip}
        disabled={loading}
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          "Generate Trip"
        )}
      </Button>
      <LoginAlert
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setStoredUser={setStoredUser}
        handleGenerateTrip={handleGenerateTrip}
      />
      <LoadingAlert
        modalOpen={loading}
        setModalOpen={setLoading}
        progress={progress}
      />
    </div>
  );
}

const InputContainer = ({ children }: PropsWithChildren) => {
  return <div className="my-14">{children}</div>;
};

const InputTitle = ({
  children,
  error,
}: {
  children: ReactNode;
  error: string;
}) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <h2 className="my-3 text-xl font-medium">{children}</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
};

const ErrorMessage = ({ children }: PropsWithChildren) => {
  return <span className="text-red-500 text-sm mt-1">{children}</span>;
};

export default CreateTrip;
