import { useEffect, useState } from "react";

const PHRASES = [
  "Je recherche un train pour Marseille le 24 avec le meilleur prix",
  "Vol Paris → Nice demain pas cher, budget max 150€",
  "Train Lyon vers Bordeaux autour du 30 mai, flexible",
  "TGV pour Lille ce vendredi, le moins cher possible",
];

const TYPE_DELAY = 40;
const ERASE_DELAY = 25;
const PAUSE_AFTER_TYPED = 2000;
const PAUSE_AFTER_ERASED = 400;

export function useTypewriter(paused: boolean): string {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pause-typed" | "erasing" | "pause-erased">("typing");

  useEffect(() => {
    if (paused) return;
    const phrase = PHRASES[phraseIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text.length < phrase.length) {
        timer = setTimeout(() => setText(phrase.slice(0, text.length + 1)), TYPE_DELAY);
      } else {
        timer = setTimeout(() => setPhase("pause-typed"), 0);
      }
    } else if (phase === "pause-typed") {
      timer = setTimeout(() => setPhase("erasing"), PAUSE_AFTER_TYPED);
    } else if (phase === "erasing") {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), ERASE_DELAY);
      } else {
        timer = setTimeout(() => setPhase("pause-erased"), 0);
      }
    } else if (phase === "pause-erased") {
      timer = setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % PHRASES.length);
        setPhase("typing");
      }, PAUSE_AFTER_ERASED);
    }

    return () => clearTimeout(timer);
  }, [text, phase, phraseIndex, paused]);

  return text || PHRASES[phraseIndex].slice(0, 1);
}
