/**
 * Filter Presets Component
 *
 * Features:
 * - Save current filters as presets
 * - Load saved filter presets
 * - Delete filter presets
 * - AI-powered preset suggestions
 * - Quick preset selection
 * - ShadCN UI components
 * - React Query integration
 *
 * Following DEVELOPMENT_RULES.md: Reusable component, centralized hooks
 */

import { memo, useState, useCallback } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import { Save, Trash2, Sparkles, Bookmark, Loader2 } from "lucide-react";
import {
  useFilterPresets,
  useCreateFilterPreset,
  useUpdateFilterPreset,
  useDeleteFilterPreset,
} from "../../hooks/useFilterPresets";
import { FilterPreset, AdvancedFilterOptions } from "../../types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationDialog from "../common/ConfirmationDialog";
import EmptyState from "../common/EmptyState";
import { Skeleton } from "../ui/skeleton";

interface FilterPresetsProps {
  onPresetSelect: (preset: FilterPreset) => void;
  currentFilters: AdvancedFilterOptions;
}

/**
 * Filter Presets Component (Memoized for performance)
 *
 * Manages saved filter presets with CRUD operations
 */
const FilterPresets = memo(
  ({ onPresetSelect, currentFilters }: FilterPresetsProps) => {
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [presetName, setPresetName] = useState("");
    const [presetDescription, setPresetDescription] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [presetToDelete, setPresetToDelete] = useState<FilterPreset | null>(
      null
    );

    const { data: presets = [], isLoading } = useFilterPresets();
    const createPreset = useCreateFilterPreset();
    const updatePreset = useUpdateFilterPreset();
    const deletePreset = useDeleteFilterPreset();

    // Check if current filters match an existing preset
    const matchingPreset = presets.find((preset) => {
      const presetFilters = preset.filters as AdvancedFilterOptions;
      return JSON.stringify(presetFilters) === JSON.stringify(currentFilters);
    });

    // Handle save preset
    const handleSavePreset = useCallback(() => {
      if (!presetName.trim()) {
        toast.error("Please enter a preset name");
        return;
      }

      // Check if updating existing preset
      if (matchingPreset) {
        updatePreset.mutate(
          {
            presetId: matchingPreset.id,
            name: presetName.trim(),
            description: presetDescription.trim() || undefined,
            filters: currentFilters,
          },
          {
            onSuccess: () => {
              setSaveDialogOpen(false);
              setPresetName("");
              setPresetDescription("");
            },
          }
        );
      } else {
        createPreset.mutate(
          {
            name: presetName.trim(),
            description: presetDescription.trim() || undefined,
            filters: currentFilters,
          },
          {
            onSuccess: () => {
              setSaveDialogOpen(false);
              setPresetName("");
              setPresetDescription("");
            },
          }
        );
      }
    }, [
      presetName,
      presetDescription,
      currentFilters,
      matchingPreset,
      createPreset,
      updatePreset,
    ]);

    // Handle delete preset
    const handleDeletePreset = useCallback((preset: FilterPreset) => {
      setPresetToDelete(preset);
      setDeleteDialogOpen(true);
    }, []);

    // Confirm delete
    const confirmDelete = useCallback(() => {
      if (presetToDelete) {
        deletePreset.mutate(presetToDelete.id, {
          onSuccess: () => {
            setDeleteDialogOpen(false);
            setPresetToDelete(null);
          },
        });
      }
    }, [presetToDelete, deletePreset]);

    // Open save dialog with preset info if matching
    const openSaveDialog = useCallback(() => {
      if (matchingPreset) {
        setPresetName(matchingPreset.name);
        setPresetDescription(matchingPreset.description || "");
      } else {
        setPresetName("");
        setPresetDescription("");
      }
      setSaveDialogOpen(true);
    }, [matchingPreset]);

    // Count active filters
    const activeFilterCount = Object.keys(currentFilters).filter(
      (key) => currentFilters[key as keyof AdvancedFilterOptions]
    ).length;

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Filter Presets</h3>
          </div>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={openSaveDialog}
                disabled={activeFilterCount === 0}
                className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300"
              >
                <Save className="h-4 w-4 mr-2" />
                {matchingPreset ? "Update Preset" : "Save Preset"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {matchingPreset
                    ? "Update Filter Preset"
                    : "Save Filter Preset"}
                </DialogTitle>
                <DialogDescription>
                  Save your current filter configuration for quick access later.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preset Name *</label>
                  <Input
                    type="text"
                    placeholder="e.g., Quick Healthy Meals"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    className="bg-slate-900/30 border-slate-400/30 text-white"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Description (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Low calorie, high protein recipes"
                    value={presetDescription}
                    onChange={(e) => setPresetDescription(e.target.value)}
                    className="bg-slate-900/30 border-slate-400/30 text-white"
                    maxLength={500}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSavePreset}
                    disabled={
                      !presetName.trim() ||
                      createPreset.isPending ||
                      updatePreset.isPending
                    }
                    className="flex-1 bg-gradient-to-r from-purple-500/70 via-purple-500/50 to-purple-500/30 hover:from-purple-500/80 hover:via-purple-500/60 hover:to-purple-500/40"
                  >
                    {(createPreset.isPending || updatePreset.isPending) && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {matchingPreset ? "Update" : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSaveDialogOpen(false)}
                    className="border-slate-400/30"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Presets List */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : presets.length === 0 ? (
          <EmptyState
            message="No filter presets saved"
            subtitle="Save your current filters to create a preset"
            compact
          />
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {presets.map((preset) => {
                const presetFilters = preset.filters as AdvancedFilterOptions;
                const filterCount = Object.keys(presetFilters).filter(
                  (key) => presetFilters[key as keyof AdvancedFilterOptions]
                ).length;

                return (
                  <motion.div
                    key={preset.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-white">
                                {preset.name}
                              </h4>
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                {filterCount} filters
                              </Badge>
                            </div>
                            {preset.description && (
                              <p className="text-sm text-gray-400">
                                {preset.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {presetFilters.diet && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-slate-700/50"
                                >
                                  {presetFilters.diet}
                                </Badge>
                              )}
                              {presetFilters.cuisine && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-slate-700/50"
                                >
                                  {presetFilters.cuisine}
                                </Badge>
                              )}
                              {presetFilters.mealType && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-slate-700/50"
                                >
                                  {presetFilters.mealType}
                                </Badge>
                              )}
                              {presetFilters.maxReadyTime && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-slate-700/50"
                                >
                                  {presetFilters.maxReadyTime} min
                                </Badge>
                              )}
                              {filterCount > 4 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-slate-700/50"
                                >
                                  +{filterCount - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onPresetSelect(preset)}
                              className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/20"
                            >
                              <Sparkles className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePreset(preset)}
                              disabled={deletePreset.isPending}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Delete Filter Preset"
          description={`Are you sure you want to delete "${presetToDelete?.name}"? This action cannot be undone.`}
        />
      </div>
    );
  }
);

FilterPresets.displayName = "FilterPresets";

export default FilterPresets;
