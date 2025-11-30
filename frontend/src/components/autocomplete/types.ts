export type SuggestionType = "city" | "stop_area" | "airport";

export type Suggestion = {
  id: string;
  name: string;
  type?: SuggestionType;
  region?: string;
}

export type AutocompleteInputProps = {
    label: string;
    value: string;
    placeholder?: string;
    onChange: (newValue: string) => void;
    onSelect: (s: Suggestion) => void;
    className?: string;
}

export type AutocompleteListProps = {
  suggestions: Suggestion[];
  selectedIndex: number;
  onSelect: (s: Suggestion) => void;
}


