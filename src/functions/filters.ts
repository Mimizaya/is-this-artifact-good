import React from 'react';

export const updateFiltersSingleSelect = (
  value: string,
  setState: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  
  if(value === 'clear selection') {
    setState([]);
  }
  else if (value === 'HP%') {
    setState(['HP%', 'HP% (C1)'])
  }
  else if (value === 'Elemental Mastery') {
    setState(['Elemental Mastery', 'Elemental Mastery (Vape)', 'Elemental Mastery (Quicken)'])
  }
  else if (value === 'CRIT Rate') {
    setState(['CRIT Rate', 'CRIT Rate/DMG', 'CRIT Rate (Favonius)'])
  }
  else if (value === 'CRIT DMG') {
    setState(['CRIT DMG', 'CRIT Rate/DMG'])
  }
  else {
    setState([value]);
  }
};

export const updateFiltersMultiSelect = (
  value: string,
  setState: React.Dispatch<React.SetStateAction<string[]>>,
) => {

  // If filtering for 'CRIT Rate' or 'CRIT DMG', also add the consolidated 'CRIT Rate/DMG'
  if (value === 'CRIT Rate' || value === 'CRIT DMG') {
    setState((prev) => {

      // Check if the stat is already selected
      const isSelected = prev.includes(value);
      const isCritIncluded = prev.includes('CRIT Rate/DMG');
      const isCritRateFavoniusIncluded = prev.includes('CRIT Rate (Favonius)');

      // Create a new selection based on the current state
      let newSelection = isSelected
        ? prev.filter((n) => n !== value) // Remove the stat if it's already selected
        : [...prev, value]; // Add the stat if it's not already selected

      // If "CRIT Rate" is selected and "CRIT Rate (Favonius)" is not already included, add it
      if (value === 'CRIT Rate' && !isSelected && !isCritRateFavoniusIncluded) {
        newSelection.push('CRIT Rate (Favonius)');
      }

      // Add "CRIT Rate/DMG" if either "CRIT Rate" or "CRIT DMG" is selected, and "CRIT Rate/DMG" was not already included
      if (!isSelected && !isCritIncluded) {
        newSelection.push('CRIT Rate/DMG');
      }

      // Remove "CRIT" if neither "CRIT Rate" nor "CRIT DMG" is selected anymore
      if (!newSelection.includes('CRIT Rate') && !newSelection.includes('CRIT DMG')) {
        newSelection = newSelection.filter((n) => n !== 'CRIT Rate/DMG');
      }

      // Remove "CRIT Rate (Favonius)" if "CRIT Rate" is not selected anymore
      if (!newSelection.includes('CRIT Rate')) {
        newSelection = newSelection.filter((n) => n !== 'CRIT Rate (Favonius)');
      }

      return newSelection;
    });
  }
  else if (value === 'Elemental Mastery') {
    setState((prev) => {

      // Check if the stat is already selected
      const isSelected = prev.includes(value);
      const isVapeIncluded = prev.includes('Elemental Mastery (Vape)');
      const isQuickenIncluded = prev.includes('Elemental Mastery (Quicken)');
      const isMeltIncluded = prev.includes('Elemental Mastery (Melt)');

      // Create a new selection based on the current state
      let newSelection = isSelected
        ? prev.filter((n) => n !== value) // Remove the stat if it's already selected
        : [...prev, value]; // Add the stat if it's not already selected

      // Add to selection
      if (!isSelected && !isVapeIncluded && !isQuickenIncluded && !isMeltIncluded) {
        newSelection.push('Elemental Mastery (Vape)');
        newSelection.push('Elemental Mastery (Quicken)');
        newSelection.push('Elemental Mastery (Melt)');
      }

      // Remove from selection
      if (!newSelection.includes('Elemental Mastery')) {
        newSelection = newSelection.filter((n) => n !== 'Elemental Mastery (Vape)');
        newSelection = newSelection.filter((n) => n !== 'Elemental Mastery (Quicken)');
        newSelection = newSelection.filter((n) => n !== 'Elemental Mastery (Melt)');
      }

      return newSelection;
    });
  }

  // All other stats
  else {
    setState((prev) =>
      prev.includes(value) ? prev.filter((n) => n !== value) : [...prev, value]
    );
  }
};