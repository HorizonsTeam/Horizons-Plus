import type { TabButtonProps } from '../types/reservations';

export const TabButton = ({ type, label, count, activeTab, onClick }: TabButtonProps) => (
  <button
    onClick={() => onClick(type)}
    className={`pb-4 cursor-pointer px-4 font-semibold transition-all relative ${
      activeTab === type
        ? "text-white"
        : "text-white-500 hover:text-[#98EAF3]"
    }`}
  >
    {label}
    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
      {count}
    </span>
    {activeTab === type && (
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#98EAF3] transform transition-transform" />
    )}
  </button>
);

interface ReservationTabsProps {
  upcomingCount: number;
  pastCount: number;
  activeTab: "upcoming" | "past";
  onTabChange: (tab: "upcoming" | "past") => void;
}

export const ReservationTabs = ({ 
  upcomingCount, 
  pastCount, 
  activeTab, 
  onTabChange 
}: ReservationTabsProps) => (
  <div className="mb-8 border-b border-gray-200">
    <div className="flex gap-2">
      <TabButton
        type="upcoming"
        label="À venir"
        count={upcomingCount}
        activeTab={activeTab}
        onClick={onTabChange}
      />
      <TabButton
        type="past"
        label="Passées"
        count={pastCount}
        activeTab={activeTab}
        onClick={onTabChange}
      />
    </div>
  </div>
);