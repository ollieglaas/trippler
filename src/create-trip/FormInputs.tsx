import LoadingAlert from "@/components/LoadingAlert";
import LoginAlert from "@/components/LoginAlert";
import { SelectBudgetOptions, SelectTravelList } from "@/constants/options";
import React, { PropsWithChildren, ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { DatePicker } from "./DatePicker";
import OptionSelect from "./OptionSelect";
import { FormDataType } from "@/types/globalTypes";
import { useUserContext } from "@/context/UserContext";
import { useTheme } from "@/components/theme-provider";

interface FormInputsProps {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  errors: Record<string, string>;
  handleGenerateTrip: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  progress: number;
}

function FormInputs({
  formData,
  setFormData,
  errors,
  handleGenerateTrip,
  loading,
  setLoading,
  modalOpen,
  setModalOpen,
  progress,
}: FormInputsProps) {
  const { setStoredUser } = useUserContext();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    console.log("theme: ", resolvedTheme);
  });

  const handleInputChange = <K extends keyof FormDataType>(
    name: K,
    value: FormDataType[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
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
            styles: {
              control: (provided) => ({
                ...provided,
                background:
                  resolvedTheme === "light" ? "white" : "oklch(0.205 0 0)",
                borderColor:
                  resolvedTheme === "light"
                    ? "oklch(0.922 0 0)"
                    : "oklch(1 0 0 / 10%)",
              }),
              input: (provided) => ({
                ...provided,
                color:
                  resolvedTheme === "light"
                    ? "oklch(0.145 0 0)"
                    : "oklch(0.985 0 0)",
              }),
              menu: (provided) => ({
                ...provided,
                background:
                  resolvedTheme === "light" ? "white" : "oklch(0.205 0 0)",
                borderColor:
                  resolvedTheme === "light"
                    ? "oklch(0.922 0 0)"
                    : "oklch(1 0 0 / 10%)",
              }),
              option: (provided) => ({
                ...provided,
                background:
                  resolvedTheme === "light" ? "white" : "oklch(0.205 0 0)",
              }),
              singleValue: (provided) => ({
                ...provided,
                background:
                  resolvedTheme === "light" ? "white" : "oklch(0.205 0 0)",
                color:
                  resolvedTheme === "light"
                    ? "oklch(0.145 0 0)"
                    : "oklch(0.985 0 0)",
              }),
              placeholder: (provided) => ({
                ...provided,
                color:
                  resolvedTheme === "light"
                    ? "oklch(0.145 0 0)"
                    : "oklch(0.985 0 0)",
              }),
            },
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
    </>
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

export default FormInputs;
