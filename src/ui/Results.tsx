import React from 'react';
import CharacterCard from 'src/ui/charactercard'

// Contains all static character data
import { characterData } from 'src/data/character-data';

export default function Results({
  characterDataCSV,
  selectedCharacter,
  selectedArtifactSet,
  selectedSands,
  selectedGoblet,
  selectedCirclet,
  selectedSubstats,
  selectedElements
}) {

  // Check for no filters active
    const noFiltersActive = 
      selectedCharacter.length === 0 &&
      selectedArtifactSet.length === 0 &&
      selectedSands.length === 0 &&
      selectedGoblet.length === 0 &&
      selectedCirclet.length === 0 &&
      selectedSubstats.length === 0

  // Calculate results from active filters
    const filteredResults = characterDataCSV.filter(build => {

      // Check character
      const isCharacterSelected = selectedCharacter.length === 0 || 
        selectedCharacter.includes(build.character_name);

      // Check artifact set
      const isArtifactSetSelected = selectedArtifactSet.length === 0 || 
        selectedArtifactSet.includes(build.artifact_set) ||
        selectedArtifactSet.includes(build.artifact_set_2);

      // Check sands
      const isSandsSelected = selectedSands.length === 0 || 
        selectedSands.includes(build.sands) ||
        selectedSands.includes(build.sands_2);

      // Check goblet
      const isGobletSelected = selectedGoblet.length === 0 || 
        selectedGoblet.includes(build.goblet) ||
        selectedGoblet.includes(build.goblet_2);

      // Check circlet
      const isCircletSelected = selectedCirclet.length === 0 || 
        selectedCirclet.includes(build.circlet) ||
        selectedCirclet.includes(build.circlet_2);

      // Check substats
      const isSubstatsSelected = selectedSubstats.length === 0 || 
        selectedSubstats.includes(build.substats) ||
        selectedSubstats.includes(build.substats_2) ||
        selectedSubstats.includes(build.substats_3) ||
        selectedSubstats.includes(build.substats_4) ||
        selectedSubstats.includes(build.substats_5) ||
        selectedSubstats.includes(build.substats_6);

      // Only include builds that meet the criteria for selected filters
      return (
        isCharacterSelected &&
        isArtifactSetSelected &&
        isSandsSelected &&
        isGobletSelected &&
        isCircletSelected &&
        isSubstatsSelected
      );
    });

  return (
    <section id="results">
      <h3>{
        noFiltersActive ? 'Showing all builds' : 
        filteredResults.length === 1 ? `Found ${filteredResults.length} build matching filters` : 
        filteredResults.length > 1 ? `Found ${filteredResults.length} builds matching filters` : 
        'No builds matching current filters'}
      </h3>
      <div className="row">
      {filteredResults.map(build => {

        // Find static data for the character in build
        const staticCharacterData = characterData.find(
          (char) => char.name === build.character_name
        );

        // Assign static data
        const characterRarity = staticCharacterData?.rarity;
        const characterElement = staticCharacterData?.element;

        return (
          <div className="column">
          <CharacterCard 
            key={build.character_name + build.name + build.artifact_set}
            characterRarity={characterRarity}
            characterElement={characterElement}
            build={build}
            selectedCharacter={selectedCharacter}
            selectedArtifactSet={selectedArtifactSet}
            selectedSands={selectedSands}
            selectedGoblet={selectedGoblet}
            selectedCirclet={selectedCirclet}
            selectedSubstats={selectedSubstats}
          />
          </div>
      )})}
      </div>
    </section>
  );
}