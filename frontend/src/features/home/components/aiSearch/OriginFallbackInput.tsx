import { MapPin } from "lucide-react";
import AutocompleteInput from "../../../../components/autocomplete/AutocompleteInput";
import type { Suggestion } from "../../../../components/autocomplete/types";
import { useRef, useState } from "react";

type Props = {
  onResolved: (origin: Suggestion) => void;
};

export default function OriginFallbackInput({ onResolved }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState("");

  return (
    <div className="mt-3 bg-[#1f3438] rounded-xl p-3 border border-cyan-400/20">
      <p className="text-xs text-cyan-300 mb-2 flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        D'où partez-vous ?
      </p>
      <AutocompleteInput
        label=""
        value={text}
        placeholder="Votre ville de départ"
        onChange={setText}
        onSelect={(s) => onResolved(s)}
        wrapperRef={wrapperRef}
        className="search-input w-full bg-[#2C474B] text-white placeholder-slate-400 rounded-lg px-3 py-2 text-sm outline-none border-none focus:ring-2 focus:ring-cyan-400/30"
      />
    </div>
  );
}
