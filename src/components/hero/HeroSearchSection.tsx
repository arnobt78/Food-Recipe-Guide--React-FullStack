/**
 * Hero Search Section Component
 *
 * Features:
 * - Toggle button system for Search/Weather modes
 * - Smooth fade-in animations with framer-motion
 * - SearchInput with Advanced Filters (Search mode)
 * - Weather-Based Suggestions (Weather mode)
 * - Responsive design for mobile/desktop
 * - Memoized for performance
 *
 * Following DEVELOPMENT_RULES.md: Reusable component, ShadCN UI, optimized performance
 */

"use client";

import { memo, useState, useCallback, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CloudSun, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AdvancedFilterOptions } from "../../types";
// Components imported directly for instant display
// Loading states for API data are handled internally by each component
import AdvancedFilters from "../filters/AdvancedFilters";
import WeatherBasedSuggestions from "../weather/WeatherBasedSuggestions";

type SearchMode = "search" | "weather";

interface HeroSearchSectionProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearchSubmit: (e: FormEvent) => void;
  searchFilters: AdvancedFilterOptions;
  onFiltersChange: (filters: AdvancedFilterOptions) => void;
  onApplyFilters: () => void;
  isSearching: boolean;
  className?: string;
}

/**
 * Hero Search Section Component (Memoized for performance)
 *
 * Displays toggle buttons for Search/Weather modes with smooth transitions
 */
const HeroSearchSection = memo(
  ({
    searchTerm,
    onSearchTermChange,
    onSearchSubmit,
    searchFilters,
    onFiltersChange,
    onApplyFilters,
    isSearching,
    className = "",
  }: HeroSearchSectionProps) => {
    const [activeMode, setActiveMode] = useState<SearchMode>("search");

    // Handle mode change with smooth transition
    const handleModeChange = useCallback((mode: SearchMode) => {
      setActiveMode(mode);
    }, []);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className={cn("max-w-7xl mx-auto px-4", className)}
      >
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center p-1.5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/10">
            <ToggleButton
              active={activeMode === "search"}
              onClick={() => handleModeChange("search")}
              icon={<Search className="h-4 w-4" />}
              label="Search Recipes"
            />
            <ToggleButton
              active={activeMode === "weather"}
              onClick={() => handleModeChange("weather")}
              icon={<CloudSun className="h-4 w-4" />}
              label="Weather Magic"
            />
          </div>
        </div>

        {/* Content Area with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          {activeMode === "search" ? (
            <motion.div
              key="search-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search Card - Consistent style with Weather Magic */}
              <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 backdrop-blur-sm rounded-xl">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Search className="h-7 w-7 text-purple-400" />
                      </div>
                      <div>
                        <span className="block text-lg sm:text-xl font-semibold text-white">
                          Recipe Search
                        </span>
                        <span className="block text-sm text-gray-400">
                          Find your perfect recipe
                        </span>
                      </div>
                    </div>
                    <AdvancedFilters
                      filters={searchFilters}
                      onFiltersChange={onFiltersChange}
                      onApplyFilters={onApplyFilters}
                      isSearching={isSearching}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AI Search Hint */}
                  <p className="text-center text-sm text-purple-300/80">
                    <Sparkles className="inline h-4 w-4 mr-1" />
                    Try &quot;quick healthy dinner&quot; or &quot;pasta with
                    tomatoes&quot; for AI-powered search
                  </p>

                  {/* Search Input */}
                  <form onSubmit={onSearchSubmit} className="flex gap-3">
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => onSearchTermChange(e.target.value)}
                      placeholder="Enter ingredients, dish name, or describe what you want..."
                      className="flex-1 bg-slate-900/30 backdrop-blur-sm border-purple-500/30 text-white text-base placeholder:text-gray-500 rounded-xl focus:border-purple-400 focus:ring-purple-400/20"
                    />
                    <Button
                      type="submit"
                      disabled={isSearching || !searchTerm.trim()}
                      className="bg-gradient-to-r from-purple-500/70 via-purple-500/50 to-pink-500/30 hover:from-purple-500/80 hover:via-purple-500/60 hover:to-pink-500/40 text-white px-6 rounded-xl"
                    >
                      {isSearching ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Search"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="weather-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <WeatherBasedSuggestions className="w-full mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

HeroSearchSection.displayName = "HeroSearchSection";

/**
 * Toggle Button Sub-component
 */
interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const ToggleButton = memo(
  ({ active, onClick, icon, label }: ToggleButtonProps) => {
    return (
      <button
        onClick={onClick}
        className={cn(
          "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
          active
            ? "bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white shadow-lg shadow-purple-500/30"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        )}
      >
        {/* Active indicator glow */}
        {active && (
          <motion.div
            layoutId="activeToggle"
            className="absolute inset-0 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-xl"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {icon}
          <span className="hidden sm:inline">{label}</span>
        </span>
      </button>
    );
  }
);

ToggleButton.displayName = "ToggleButton";

export default HeroSearchSection;
