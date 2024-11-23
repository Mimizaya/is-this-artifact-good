import React from 'react';

// Parse raw text data and replace markers with HTML tags 
export const parseText = (text: string) => {
  // Create a regex to capture normal text, <i> tags, <b> tags, and content in parentheses
  const regex = /([^<()]+)|(<i>)(.*?)(<\/i>)|(<b>)(.*?)(<\/b>)|\(([^)]+)\)/g;

  const result = [];
  let match;

  // Loop through all matches in the text
  while ((match = regex.exec(text)) !== null) {
    const regularText = match[1]; // Normal text (not in tags or parentheses)
    const italicOpenTag = match[2]; // Opening <i> tag
    const italicText = match[3]; // Content inside <i> tags
    const italicCloseTag = match[4]; // Closing </i> tag

    const boldOpenTag = match[5]; // Opening <b> tag
    const boldText = match[6]; // Content inside <b> tags
    const boldCloseTag = match[7]; // Closing </b> tag

    const parenthesesText = match[8]; // Text inside parentheses

    // If normal text is found, push it to the result
    if (regularText) {
      result.push(regularText);
    }

    // If an <i> tag is found, wrap the content in <i>
    else if (italicOpenTag && italicCloseTag) {
      result.push(<i key={result.length}>{italicText}</i>);
    }
    
    // If a <b> tag is found, wrap the content in <b>
    else if (boldOpenTag && boldCloseTag) {
      result.push(<b key={result.length}>{boldText}</b>);
    }

    // If parentheses content is found, wrap it in <span> with class "parentheses"
    else if (parenthesesText) {
      result.push(<span className="parentheses" key={result.length}>({parenthesesText})</span>);
    }
  }

  return result;
};

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
    setState(['Elemental Mastery', 'EM (Vape/Melt)', 'EM (Vaporize)', 'EM (Quicken)', 'EM (Aggravate)'])
  }
  else if (value === 'CRIT Rate') {
    setState(['CRIT Rate', 'CRIT Rate/DMG', 'CRIT Rate (Favonius)'])
  }
  else if (value === 'CRIT DMG') {
    setState(['CRIT DMG', 'CRIT Rate/DMG'])
  }
  else if (value === 'Traveler') {
    setState(['Traveler','Hydro Traveler', 'Dendro Traveler', 'Electro Traveler', 'Geo Traveler', 'Anemo Traveler'])
  }
  else {
    setState([value]);
  }
};

export const updateFiltersSubstats = (
  value: string,
  setState: React.Dispatch<React.SetStateAction<string[]>>,
  numberOfSubstats: number,
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
        : numberOfSubstats < 4 ? [...prev, value] : [...prev]; // Add the stat if it's not already selected

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
      const isVapeMeltIncluded = prev.includes('EM (Vape/Melt)');
      const isVapeIncluded = prev.includes('EM (Vaporize)');
      const isQuickenIncluded = prev.includes('EM (Quicken)');
      const isMeltIncluded = prev.includes('EM (Melt)');
      const isAggravateIncluded = prev.includes('EM (Aggravate)');

      // Create a new selection based on the current state
      let newSelection = isSelected
        ? prev.filter((n) => n !== value) // Remove the stat if it's already selected
        : numberOfSubstats < 4 ? [...prev, value] : [...prev] // Add the stat if it's not already selected

      // Add to selection
      if (!isSelected && !isVapeMeltIncluded && !isVapeIncluded && !isQuickenIncluded && !isMeltIncluded && !isAggravateIncluded) {
        newSelection.push('EM (Vape/Melt)');
        newSelection.push('EM (Vaporize)');
        newSelection.push('EM (Quicken)');
        newSelection.push('EM (Melt)');
        newSelection.push('EM (Aggravate)');
      }

      // Remove from selection
      if (!newSelection.includes('Elemental Mastery')) {
        newSelection = newSelection.filter((n) => n !== 'EM (Vape/Melt)');
        newSelection = newSelection.filter((n) => n !== 'EM (Vaporize)');
        newSelection = newSelection.filter((n) => n !== 'EM (Quicken)');
        newSelection = newSelection.filter((n) => n !== 'EM (Melt)');
        newSelection = newSelection.filter((n) => n !== 'EM (Aggravate)');
      }

      return newSelection;
    });
  }

  // All other stats
  else {
    setState((prev) =>
      prev.includes(value) ? prev.filter((n) => n !== value) 
      : numberOfSubstats < 4 ? [...prev, value] : [...prev]
    );
  }
};
export const updateFiltersElements = (
  value: string,
  setState: React.Dispatch<React.SetStateAction<string[]>>,
) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((n) => n !== value) 
      : [...prev, value]
    );
};