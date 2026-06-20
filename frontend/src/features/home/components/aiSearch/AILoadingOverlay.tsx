import { useEffect, useState } from "react";
import { Sparkles, Loader2, Check } from "lucide-react";

const STEPS = [
  "Analyse de votre demande",
  "Recherche des gares et trajets",
  "Sélection du meilleur prix",
];

const STEP_DURATION = 950;

export default function AILoadingOverlay() {
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => setActiveStep(i), i * STEP_DURATION)
      );
      timers.push(
        setTimeout(
          () => setDoneSteps((prev) => (prev.includes(i) ? prev : [...prev, i])),
          (i + 1) * STEP_DURATION
        )
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-dark/95 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-xl lg:text-2xl font-semibold text-primary mb-10 leading-snug">
          Analyse en cours, nous sélectionnons les meilleures options pour vous...
        </h2>

        <div className="relative w-24 h-24 mx-auto mb-12">
          <div className="absolute inset-0 rounded-full bg-[#2C474B] border border-cyan-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(103,232,249,0.25)]">
            <Sparkles className="w-9 h-9 text-cyan-300 animate-pulse" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-ping" />
        </div>

        <ul className="space-y-4 inline-block text-left">
          {STEPS.map((label, i) => {
            const isDone = doneSteps.includes(i);
            const isActive = !isDone && activeStep === i;
            const isPending = !isDone && !isActive;

            return (
              <li
                key={i}
                className={`flex items-center gap-3 text-sm lg:text-base transition-opacity duration-300 ${
                  isPending ? "opacity-40" : "opacity-100"
                }`}
              >
                {isDone ? (
                  <Check className="w-5 h-5 text-cyan-300 shrink-0" />
                ) : (
                  <Loader2
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? "text-cyan-300 animate-spin" : "text-white/30"
                    }`}
                  />
                )}
                <span
                  className={
                    isDone
                      ? "text-white"
                      : isActive
                      ? "text-cyan-200"
                      : "text-white/50"
                  }
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
