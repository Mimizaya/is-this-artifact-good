import { useState } from 'react';

// Datasets
import { characterData } from '../data/character-data.ts';
import { artifactSets } from '../data/artifact-data.ts';
import { elements } from '../data/elements.ts';

// Type definitions
import { Character, RawBuild, FullBuild, ArtifactSet, SelectedFilters } from '../types/types.ts';

// UI components
import CharacterCard from './CharacterCard.tsx'

export default function Results({
  buildsDataRaw,
  selectedFilters,
  resetFilters,
}: {
  buildsDataRaw: RawBuild[];
  selectedFilters: SelectedFilters;
  resetFilters: () => void;
}) {

  // Save filter configurations - WIP 
    //const [currentFilterTab, setCurrentFilterTab] = useState(1);
    //const [savedFilters, setSavedFilters] = useState([]);

  // Destructure the selected filters object 
      const { selectedCharacter, selectedArtifactSet, selectedSands, selectedGoblet, selectedCirclet, selectedSubstats, selectedElements } = selectedFilters;
  
  // Handle pin build 
    const [selectedPinned, setSelectedPinned] = useState<number[]>([]);
    const handleSelectedPinned = (id: number) => {
      setSelectedPinned((prev) =>
        prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
      );
    }

  // Handle filtering of build sections 
    const buildSectionsOptions = ['All', 'Artifact Sets', 'About', 'Sands', 'Goblet', 'Circlet', 'Substats', 'ER Recommendation'];
    const [buildSectionsVisible, setBuildSectionsVisible] = useState(['All']); 

    const handleBuildSectionsVisibleChange = (section: string, event: React.MouseEvent) => {
      const shiftModifier = event.shiftKey;

      // If shift modifier is held, set to only clicked section
      if(shiftModifier){
        setBuildSectionsVisible((prev) => {

          // New selection with 'All' removed
          const allRemoved = prev?.filter(n => n !== 'All'); 

          let newSections;

          // If section was already selected, remove it and 'All'
          if (prev?.includes(section)) {
            newSections = allRemoved.filter(n => n !== section);
          } 

          // If section was not already selected, add it
          else {
            newSections = [...allRemoved, section];
          }

          // If all sections -1 are selected, add 'All'
          if (newSections.length === buildSectionsOptions.length - 1) {
            newSections = ['All'];
          }

          // Return the updated sections
          return newSections; 
        });
      }

      // If no shift modifier
      else {
        setBuildSectionsVisible([section])
      }
    }

  // Add additional static data to builds 
    const buildsDataEnriched = buildsDataRaw.map((build: RawBuild) => {

      // Find the corresponding character data based on name
      const characterInfo = characterData.find((character: Character) => character.name === build.character_name);

      // Find the corresponding character data based on name
      const artifactSetOneInfo = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set);
      const artifactSetTwoInfo = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_2);
      const artifactSetThreeInfo = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_3);

      // If a match is found, merge the relevant data
      // Use `!` to assert that result is not null/undefined
      return {
        ...build,
        element: characterInfo!.element,
        rarity: characterInfo!.rarity,
        artifact_set_two_piece: artifactSetOneInfo!.two_piece,
        artifact_set_four_piece: artifactSetOneInfo!.four_piece,
        artifact_set_2_two_piece: artifactSetTwoInfo ? artifactSetTwoInfo.two_piece : null,
        artifact_set_2_four_piece: artifactSetTwoInfo ? artifactSetTwoInfo.four_piece : null,
        artifact_set_3_two_piece: artifactSetThreeInfo ? artifactSetThreeInfo.two_piece : null,
        artifact_set_3_four_piece: artifactSetThreeInfo ? artifactSetThreeInfo.four_piece : null,
      };
    });



  // SORTING / FILTERING 
  // --------------------------------------------

  // SORT: Apply default sorting order 
      const artifactOrder = artifactSets.map(artifact => artifact.name);
      const elementOrder = elements;

      const sortedBuilds = buildsDataEnriched.sort((a: FullBuild, b: FullBuild) => {

        // If a character filter is checked, sort builds by Internal build IDs
        if(selectedCharacter.length > 0) {
          return a.ID - b.ID;
        }

        // If a element filter is checked, sort builds by Character name
        if(selectedElements.length > 0) {
          return a.character_name.localeCompare(b.character_name);
        }

        // If no character type filters are checked, sort builds by:
        // Artifact Sets > Element > Character Name
        else {
          const indexAArtifact = artifactOrder.indexOf(a.artifact_set);
          const indexBArtifact = artifactOrder.indexOf(b.artifact_set);
          const indexAElement = elementOrder.indexOf(a.element);
          const indexBElement = elementOrder.indexOf(b.element);

          // Sort by artifact order
          if (indexAArtifact !== indexBArtifact) {
            return indexAArtifact - indexBArtifact;
          }
          // Sort by element order
          if (indexAElement !== indexBElement) {
            return indexAElement - indexBElement;
          }
          // Sort by name
          return a.character_name.localeCompare(b.character_name);
        }
      });

  // FILTER: Apply user filters to main data 
    const filteredResults = sortedBuilds.filter((build: FullBuild) => {
      // Check pinned
      const isBuildPinned = selectedPinned.length === 0 || 
        selectedPinned.includes(build.ID);

      // Check character
      const isCharacterSelected = selectedCharacter.length === 0 || 
        selectedCharacter.includes(build.character_name);

      // Check artifact set
      const isArtifactSetSelected = selectedArtifactSet.length === 0 || 
        selectedArtifactSet.includes(build.artifact_set) ||
        selectedArtifactSet.includes(build.artifact_set_2) ||
        selectedArtifactSet.includes(build.artifact_set_3);

      // Check sands
      const isSandsSelected = selectedSands.length === 0 || 
        selectedSands.includes(build.sands) ||
        selectedSands.includes(build.sands_2) ||
        selectedSands.includes(build.sands_3);

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

      // Check element
      const isElementSelected = selectedElements.length === 0 || 
        selectedElements.includes(build.element);

      // Always return pinned builds, plus any that match all filter criteria
      if (selectedPinned.length > 0) {
        return isBuildPinned || (
          isCharacterSelected &&
          isArtifactSetSelected &&
          isSandsSelected &&
          isGobletSelected &&
          isCircletSelected &&
          isSubstatsSelected &&
          isElementSelected
        );
      } else {
        // If no builds are pinned, only return those that match all other criteria
        return (
          isCharacterSelected &&
          isArtifactSetSelected &&
          isSandsSelected &&
          isGobletSelected &&
          isCircletSelected &&
          isSubstatsSelected &&
          isElementSelected
        );
      }
    });

  // ADD DATA: Find matching 2-piece boni 
    const selectedArtifact = artifactSets.find((set) => set.name === selectedArtifactSet[0]);
    const selectedBonus = selectedArtifact ? selectedArtifact.two_piece : null;

    // Get sets that match the selected bonus
    const matchingSets = artifactSets
      .filter((set) => set.two_piece === selectedBonus) // Filter sets with the same bonus
      .filter((set) => set.name !== selectedArtifact?.name); // Exclude the selected set

    // Filter builds based on matching artifact set and logic
    const matchingBuilds = sortedBuilds.filter((build: FullBuild) => {

      const artifactSet1 = matchingSets.some((set) => set.name === build.artifact_set);
      const artifactSet2 = matchingSets.some((set) => set.name === build.artifact_set_2);
      const artifactSet3 = matchingSets.some((set) => set.name === build.artifact_set_3);
      const artifactSet4 = matchingSets.some((set) => set.name === build.artifact_set_4);

      const artifactLogic1 = build.artifact_logic === 'AND';
      const artifactLogic2 = build.artifact_logic_2 === 'AND';
      const artifactLogic3 = build.artifact_logic_3 === 'AND';

      const match1 = artifactSet1 && artifactLogic1;
      const match2 = artifactSet2 && artifactLogic1;

      const match3 = artifactSet2 && artifactLogic2;
      const match4 = artifactSet3 && artifactLogic2;

      const match5 = artifactSet3 && artifactLogic3;
      const match6 = artifactSet4 && artifactLogic3;

      return match1 || match2 || match3 || match4 || match5 || match6;
    });

    // Filter out results that are already included in main results
    const mainBuildsIDs = filteredResults.map((build: FullBuild) => build.ID)
    const matchingBuildsFiltered = matchingBuilds.filter((build: FullBuild) => !mainBuildsIDs.includes(build.ID));
    
  // FILTER: Apply user filters to additional data (same criteria as main except no artifact set filter) 
    const filteredAdditionalResults = matchingBuildsFiltered.filter((build: FullBuild) => {
      // Check pinned
      const isBuildPinned = selectedPinned.length === 0 || 
        selectedPinned.includes(build.ID);

      // Check character
      const isCharacterSelected = selectedCharacter.length === 0 || 
        selectedCharacter.includes(build.character_name);

      // Check sands
      const isSandsSelected = selectedSands.length === 0 || 
        selectedSands.includes(build.sands) ||
        selectedSands.includes(build.sands_2) ||
        selectedSands.includes(build.sands_3);

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

      // Check element
      const isElementSelected = selectedElements.length === 0 || 
        selectedElements.includes(build.element);

      // Always return pinned builds, plus any that match all filter criteria
      if (selectedPinned.length > 0) {
        return isBuildPinned || (
          isCharacterSelected &&
          isSandsSelected &&
          isGobletSelected &&
          isCircletSelected &&
          isSubstatsSelected &&
          isElementSelected
        );
      } else {
        // If no builds are pinned, only return those that match all other criteria
        return (
          isCharacterSelected &&
          isSandsSelected &&
          isGobletSelected &&
          isCircletSelected &&
          isSubstatsSelected &&
          isElementSelected
        );
      }
    });

  // SORT: Sort both sets of data by relevancy 
    const countMatchingSubstats = (item: any, selectedSubstats: any, maxSubstats = 6) => {
      let matchCount = 0;

      // Check for matches in each substats property
      for (let i = 1; i <= maxSubstats; i++) {
        const key = i === 1 ? 'substats' : `substats_${i}`;
        if (item[key]) {
          matchCount += selectedSubstats.filter((stat: string) => item[key] === stat).length;
        }
      }
      return matchCount;
    };

    const sortByMultipleKeys = (data: any, keyValueMap:  Record<string, string | string[]>) => {
      return Object.entries(keyValueMap).reduce((acc, [key, selectedValue]) => {
        const isMain = acc.filter((item: any) => {
          // Check if the key is for substats and handle multi-select
          if (selectedValue) {
            return selectedValue.includes(item[key]);
          }
        });
        
        const isAlternative = acc.filter((item: any) => {
          // Check if the key is for substats
          if (selectedValue) {
            return !selectedValue.includes(item[key]);
          }
        });
        
        return isMain.length > 0 ? [...isMain, ...isAlternative] : acc;
      }, data);
    };

    let sortedResults = filteredResults;
    let sortedAdditionalResults = filteredAdditionalResults;

    // Map keys to their corresponding selected values
    const keyValueMapOne = {
      substats_6: selectedSubstats,
      substats_5: selectedSubstats,
      substats_4: selectedSubstats,
      substats_3: selectedSubstats,
      substats_2: selectedSubstats,
      substats: selectedSubstats,
    };

    const keyValueMapTwo = {
      circlet_3: selectedCirclet,
      circlet_2: selectedCirclet,
      circlet: selectedCirclet,
      goblet_2: selectedGoblet,
      goblet: selectedGoblet,
      sands_3: selectedSands,
      sands_2: selectedSands,
      sands: selectedSands,
      artifact_set_3: selectedArtifactSet,
      artifact_set_2: selectedArtifactSet,
      artifact_set: selectedArtifactSet,
    };

    // Relevancy sort main results
    sortedResults = sortByMultipleKeys(sortedResults, keyValueMapOne);
    sortedResults.sort((a: FullBuild, b: FullBuild) => {
      const aCount = countMatchingSubstats(a, selectedSubstats);
      const bCount = countMatchingSubstats(b, selectedSubstats);
      return bCount - aCount;
    });
    sortedResults = sortByMultipleKeys(sortedResults, keyValueMapTwo);

    // Account for pinned builds in main results
    const pinnedBuilds = sortedResults.filter((pinned: FullBuild) => selectedPinned.includes(pinned.ID));
    const otherBuilds = sortedResults.filter((pinned: FullBuild) => !selectedPinned.includes(pinned.ID));
    const sortedMainResults = pinnedBuilds.length > 0 ? pinnedBuilds.concat(otherBuilds) : otherBuilds;

    // Relevancy sort additional results
    sortedAdditionalResults = sortByMultipleKeys(sortedAdditionalResults, keyValueMapOne);
    sortedAdditionalResults.sort((a: FullBuild, b: FullBuild) => {
      const aCount = countMatchingSubstats(a, selectedSubstats);
      const bCount = countMatchingSubstats(b, selectedSubstats);
      return bCount - aCount;
    });
    sortedAdditionalResults = sortByMultipleKeys(sortedAdditionalResults, keyValueMapTwo);

  // CHECK: Are there actually any filters applied? 
    const noFilter = buildsDataRaw.length === sortedMainResults.length; // returns true if same length


    

  return (
    <section id="results">

      {/* Results Header */}
      <div className="results-header">

        {/* Display number of found builds */}
        <h2>{
          noFilter ? 'Showing all builds' : 
          sortedMainResults.length === 1 ? `Found ${sortedMainResults.length} build matching filters` : 
          sortedMainResults.length > 1 ? `Found ${sortedMainResults.length} builds matching filters` : 
          'No builds matching current filters'}
        </h2>

        {/* Builds Filter Menu: What sections are shown? */}
        <div id="filter-build">
          <h3>Select visible build sections</h3>

          {/* Filter Options */}
          <div className="filter-build-options">
            {buildSectionsOptions.map((section: string) => (
              <button
                key={section} 
                className={buildSectionsVisible.includes(section) ? 'highlighted' : ''}
                onClick={(e) => handleBuildSectionsVisibleChange(section, e)}
              >
                <img 
                  className="filter-icon" 
                  src={
                    section === 'All' ? `./images/artifacts/Icon Character Archive.webp` :
                    section === 'Artifact Sets' ? `./images/artifacts/Icon Artifact.webp` :
                    section === 'About' ? `./images/artifacts/Icon Tutorial.webp` :
                    section === 'ER Recommendation' ? `./images/artifacts/Icon Energy Recharge.webp` :
                    `./images/artifacts/Icon ${section}.webp`
                  } 
                />
                {section}
              </button>
            ))}
          </div>{/* End Filter Options */}
        </div>{/* End Builds Filter Menu */}
      </div>{/* End Results Header */}

      {/* Main Results Content */}
      <div id="results-content">

        {/* No results? Show error and reset button! */}
        {sortedMainResults.length === 0 &&
          <div id="no-results">
            <h3>These are not the builds you're looking for...</h3>
            <button className="reset-filters" onClick={() => resetFilters()}>Reset filters</button>
          </div>}

        {/* Show build(s) that match filter(s) */}
        {sortedMainResults.map((build: FullBuild) => (
          <div key={build.ID}>
            <CharacterCard
              build={build}
              handleSelectedPinned={handleSelectedPinned}
              buildSectionsVisible={buildSectionsVisible}
              selectedPinned={selectedPinned}
              selectedFilters={selectedFilters}
            />
          </div>
        ))}

      </div>{/* End Main Results Content */}

      {/* Additional results */}
      {sortedAdditionalResults.length > 0 &&
      <div id="additional-results-wrapper">
        <h3 className="additional-results-content-header">
          Additional results: Matching 2&ndash;Piece Bonus
        </h3>
        <p>{selectedArtifact?.name}</p>
        <p>2&ndash;Piece Bonus: {selectedArtifact?.two_piece}.</p>
        <br />
        <p>The builds listed below use the same 2&ndash;Piece Bonus and their listed set can be freely exchanged for any other set with the same bonus.</p>
        <div id="additional-results-content">
          {/* Show build(s) that match filter(s) */}
          {sortedAdditionalResults.map((build: FullBuild) => (
            <div key={build.ID}>
              <CharacterCard
                build={build}
                handleSelectedPinned={handleSelectedPinned}
                buildSectionsVisible={buildSectionsVisible}
                selectedPinned={selectedPinned}
                selectedFilters={selectedFilters}
              />
            </div>
          ))}
        </div>
      </div>}{/* End Additional results */}

    </section>
  );
}