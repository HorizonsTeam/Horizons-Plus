export type SuggestionType = "city" | "stop_area" | "airport";

export type Suggestion_ = {
  id: string;
  name: string;
  type?: SuggestionType;
  region?: string;
};

export type Suggestion = {
  id: string;           // "CDG" | "PAR" | "stop_area:SNCF:87271007"
  name: string;         // "Paris", "Paris Gare de Lyon"
  type?: SuggestionType;
  region?: string;
  source: "amadeus" | "sncf";
  lat: number;
  lon: number;
  simulated: boolean;
};

export type AutocompleteInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (newValue: string) => void;
  onSelect: (s: Suggestion) => void;
  className?: string;
  AutocompleteListClassname?: string;
  Ref? : string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocusCapture?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlurCapture?: (e: React.FocusEvent<HTMLInputElement>) => void;
  wrapperRef?: React.Ref<HTMLDivElement>;

}

export type AutocompleteListProps = {
  suggestions: Suggestion[];
  selectedIndex: number;
  onSelect: (s: Suggestion) => void;
  className?: string;
}


