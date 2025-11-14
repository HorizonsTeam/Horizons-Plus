export type SuggestionType = "city" | "stop_area" | "other";

export type Suggestion = {
  id: string;
  name: string;
  type: SuggestionType;
  regionOrCity?: string;
}

export type AutocompleteInputProps = {
    label: string;
    value: string;
    placeholder?: string;
    onChange: (newValue: string) => void;
}

export type AutocompleteListProps = {
  suggestions: Suggestion[];
  onSelect: (s: Suggestion) => void;
}


