"use client";

import { FilterType } from "../types";

interface InstructorStatusFilterBarProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function InstructorStatusFilterBar({
  selectedFilter,
  onFilterChange,
}: InstructorStatusFilterBarProps) {
  const filters: { label: FilterType; icon: string }[] = [
    { label: "전체", icon: "🚫" },
    { label: "확정됨", icon: "✅" },
    { label: "배정대기", icon: "⏰" },
  ];

  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-gray-700 font-medium">나의 강의 현황:</span>
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => onFilterChange(filter.label)}
            className={`px-4 py-2 rounded-full border-2 transition-all duration-200 flex items-center gap-2 ${
              selectedFilter === filter.label
                ? filter.label === "전체"
                  ? "bg-red-50 border-red-500 text-red-700"
                  : filter.label === "확정됨"
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-yellow-50 border-yellow-500 text-yellow-700"
                : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            <span className="text-lg">{filter.icon}</span>
            <span className="font-medium">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}