type Props = {
  date: Date;
};

export default function Date_String({ date }: Props) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  };

  const formatted = date
    .toLocaleDateString('fr-FR', options)
    .replace('.', '') // supprime le point après "jeu."
    .replace(/\b\w/, c => c.toUpperCase()); // met la première lettre en majuscule

  return (
    <button className="rounded-xl px-4 py-2 text-[#103035] bg-[#98EAF3] font-medium w-fit">
      {formatted}
    </button>
  );
}
