import type { Journey } from '../../Recherche/ProductCard/types.ts';

export type LocationState = {
  journey: Journey;
  selectedClass: string;
  passagersCount: number;
  formattedDepartureDate: string;
};