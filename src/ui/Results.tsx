import { useState } from 'react';

// Datasets
import { characterData } from '../data/character-data.ts';
import { artifactSets } from '../data/artifact-data.ts';
// import { elements } from '../data/elements.ts';

// Type definitions
import { 
  Character, 
  RawBuild, 
  FullBuild, 
  ArtifactSet, 
  SelectedFilters, SavedFilters } from '../types/types.ts';

// UI components
import FilterTabs from './FilterTabs.tsx';
import CharacterCard from './CharacterCard.tsx';
import Footer from './Footer.tsx';

export default function Results({
  isMobile,
  buildsDataRaw,
  selectedFilters,
  resetFilters,
  handleTabChange,
  currentFilterTab,
  savedFilters,
  isMenuOpen,
  viewPinned,
}: {
  isMobile: boolean;
  buildsDataRaw: RawBuild[];
  selectedFilters: SelectedFilters;
  resetFilters: (filter: string | null) => void;
  handleTabChange: any;
  currentFilterTab: number;
  savedFilters: SavedFilters;
  isMenuOpen: boolean;
  viewPinned: boolean;
}) {

  // SELECTED FILTERS
    // 1. Destructure the selected filters object 
      const { selectedCharacter, selectedArtifactSet, selectedSands, selectedGoblet, selectedCirclet, selectedSubstats, selectedElements } = selectedFilters;
  
  // BUILD CONTENT: Decide what sections are displayed
    // 1. Initial state 
      const buildSectionsOptions = ['All', 'Artifact Sets', 'About', 'Sands', 'Goblet', 'Circlet', 'Substats', 'ER Recommendation'];
      const [buildSectionsVisible, setBuildSectionsVisible] = useState(buildSectionsOptions);
    // 2. Handle toggling of each option 
      const handleBuildSectionsVisibleChange = (section: string) => {

        // Click 'All' button
        if (section === 'All') {
          // If all are selected, deselect all
          if (buildSectionsVisible.length === buildSectionsOptions.length) {
            setBuildSectionsVisible([]);
          } 
          // If all are not selected, select all
          else {      
            setBuildSectionsVisible(buildSectionsOptions);
          }
        }

        // Click a different button
        else {
          // All are already selected? Select only that section
          if (buildSectionsVisible.length === buildSectionsOptions.length) {
            setBuildSectionsVisible([section]);
          }
          // All are not selected
          else {
            setBuildSectionsVisible((prev) => {
              let newSections;

              // If section was already selected, remove it
              if (prev?.includes(section)) {
                newSections = prev.filter(n => n !== section);
              } 
              // If section was not already selected, add it
              else {
                newSections = [...prev, section];
              }
              // If all sections except 'All' are selected, add 'All'
              if (newSections.length === buildSectionsOptions.length - 1) {
                newSections = buildSectionsOptions;
              }
              // Return the updated sections
              return newSections;
            });
          }
        }
      }
 
  // PIN BUILD: Pin a build for easy access
    // 1. State to store IDs of pinned builds 
      const [selectedPinned, setSelectedPinned] = useState<number[]>([]);
    // 2. Handle adding or removing ID from state 
      const handleSelectedPinned = (e: any, id: number) => {
        e.stopPropagation();
        setSelectedPinned((prev) =>
          prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
        );
      }
  
  // PREPARE: Add additional static data to builds 
    const buildsDataEnriched = buildsDataRaw.map((build: RawBuild) => {

      // Find the corresponding character data based on name
      const characterInfo = characterData.find((character: Character) => character.name === build.character_name);

      // Find the corresponding character data based on name
      const artifactSet1Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_1);
      const artifactSet2Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_2);
      const artifactSet3Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_3);
      const artifactSet4Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_4);
      const artifactSet5Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_5);
      const artifactSet6Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_6);
      const artifactSet7Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_7);
      const artifactSet8Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_8);

      // If a match is found, merge the relevant data
      // Use `!` to assert that result is not null/undefined
      return {
        ...build,
        element: characterInfo!.element,
        rarity: characterInfo!.rarity,
        banner_offset: characterInfo?.banner_offset,

        artifact_set_1_two_piece: artifactSet1Info!.two_piece,
        artifact_set_1_four_piece: artifactSet1Info!.four_piece,

        artifact_set_2_two_piece: artifactSet2Info ? artifactSet2Info.two_piece : null,

        artifact_set_3_two_piece: artifactSet3Info ? artifactSet3Info.two_piece : null,
        artifact_set_3_four_piece: artifactSet3Info ? artifactSet3Info.four_piece : null,

        artifact_set_4_two_piece: artifactSet4Info ? artifactSet4Info.two_piece : null,
        
        artifact_set_5_two_piece: artifactSet5Info ? artifactSet5Info.two_piece : null,
        artifact_set_5_four_piece: artifactSet5Info ? artifactSet5Info.four_piece : null,
        
        artifact_set_6_two_piece: artifactSet6Info ? artifactSet6Info.two_piece : null,
        
        artifact_set_7_two_piece: artifactSet7Info ? artifactSet7Info.two_piece : null,
        artifact_set_7_four_piece: artifactSet7Info ? artifactSet7Info.four_piece : null,

        artifact_set_8_two_piece: artifactSet8Info ? artifactSet8Info.two_piece : null,

        artifact_option_1: [artifactSet1Info?.name, artifactSet2Info?.name],
        artifact_option_2: [artifactSet3Info?.name, artifactSet4Info?.name],
        artifact_option_3: [artifactSet5Info?.name, artifactSet6Info?.name],
        artifact_option_4: [artifactSet7Info?.name, artifactSet8Info?.name],
      };
    });

  // SORT: Apply default sorting order 
    // 1. Get character and artifact order from data 
      const artifactOrder = artifactSets.map(artifact => artifact.name);
      const characterOrder = characterData.map(character => character.name);
    // 2. Get element order from data 
      //const elementOrder = elements;
    // 3. Swap artifact values to first in option, if selected 
      const swapArtifactSets = (build: any, selectedArtifactSet: string) => {
        if (build.artifact_set_2 === selectedArtifactSet) {
          const temp = build.artifact_set_2;
          build.artifact_set_2 = build.artifact_set_1;
          build.artifact_set_1 = temp;
        }
        if (build.artifact_set_4 === selectedArtifactSet) {
          const temp = build.artifact_set_4;
          build.artifact_set_4 = build.artifact_set_3;
          build.artifact_set_3 = temp;
        }
        if (build.artifact_set_6 === selectedArtifactSet) {
          const temp = build.artifact_set_6;
          build.artifact_set_6 = build.artifact_set_5;
          build.artifact_set_5 = temp;
        }
        if (build.artifact_set_8 === selectedArtifactSet) {
          const temp = build.artifact_set_8;
          build.artifact_set_8 = build.artifact_set_7;
          build.artifact_set_7 = temp;
        }
        return build;
      };
      const swappedBuilds = buildsDataEnriched.map((build: FullBuild) => swapArtifactSets(build, selectedArtifactSet[0]?.toString()));
    // 4. Apply default sorting 
      const sortedBuilds = swappedBuilds.sort((a: FullBuild, b: FullBuild) => {

        // Establish indexes
        const indexACharacter = characterOrder.indexOf(a.character_name);
        const indexBCharacter = characterOrder.indexOf(b.character_name); 
        const indexAArtifact = artifactOrder.indexOf(a.artifact_set_1);
        const indexBArtifact = artifactOrder.indexOf(b.artifact_set_1);
        //const indexAElement = elementOrder.indexOf(a.element);
        //const indexBElement = elementOrder.indexOf(b.element);

        // If a character filter is checked, sort builds by internal build IDs
        if(selectedCharacter.length > 0) {
          return a.ID - b.ID;
        }

        // If a element filter is checked, sort builds by character chronology
        if(selectedElements.length > 0) {
          if (indexACharacter !== indexBCharacter) {
            return indexACharacter - indexBCharacter;
          }
        }

        // If an artifact set filter is checked, sort builds by character chronology, then by artifact
        if(selectedArtifactSet.length > 0) {
          // Sort by character chronology
          if (indexACharacter !== indexBCharacter) {
            return indexACharacter - indexBCharacter;
          }

          // Sort by artifact order
          if (indexAArtifact !== indexBArtifact) {
            return indexAArtifact - indexBArtifact;
          }
        }

        // Default sorting. 
        else {

          // Sort by artifact order
          if (indexAArtifact !== indexBArtifact) {
            return indexAArtifact - indexBArtifact;
          }
          // Sort by character chronology
          if (indexACharacter !== indexBCharacter) {
            return indexACharacter - indexBCharacter;
          }
          // Sort by element order
          //if (indexAElement !== indexBElement) {
          //  return indexAElement - indexBElement;
          //}

          // Sort by name, alphabetical
          //return a.character_name.localeCompare(b.character_name);
        }
        return 0;
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
        selectedArtifactSet.includes(build.artifact_set_1) ||
        selectedArtifactSet.includes(build.artifact_set_2) ||
        selectedArtifactSet.includes(build.artifact_set_3) ||
        selectedArtifactSet.includes(build.artifact_set_4) ||
        selectedArtifactSet.includes(build.artifact_set_5) ||
        selectedArtifactSet.includes(build.artifact_set_6) ||
        selectedArtifactSet.includes(build.artifact_set_7) ||
        selectedArtifactSet.includes(build.artifact_set_8);

      // Check sands
      const isSandsSelected = selectedSands.length === 0 || 
        selectedSands.includes(build.sands_1) ||
        selectedSands.includes(build.sands_2) ||
        selectedSands.includes(build.sands_3);

      // Check goblet
      const isGobletSelected = selectedGoblet.length === 0 || 
        selectedGoblet.includes(build.goblet_1) ||
        selectedGoblet.includes(build.goblet_2);

      // Check circlet
      const isCircletSelected = selectedCirclet.length === 0 || 
        selectedCirclet.includes(build.circlet_1) ||
        selectedCirclet.includes(build.circlet_2);

      // Check substats
      const isSubstatsSelected = selectedSubstats.length === 0 || 
        selectedSubstats.includes(build.substats_1) ||
        selectedSubstats.includes(build.substats_2) ||
        selectedSubstats.includes(build.substats_3) ||
        selectedSubstats.includes(build.substats_4) ||
        selectedSubstats.includes(build.substats_5) ||
        selectedSubstats.includes(build.substats_6) ||
        selectedSubstats.includes(build.flatstats_1) ||
        selectedSubstats.includes(build.flatstats_2);

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

  // ADD RESULT: Find matching 2-Piece Set Boni 
    // 1. Get selected artifact and it's bonus 
      const selectedArtifact = artifactSets.find((set) => set.name === selectedArtifactSet[0]);
      const selectedBonus = selectedArtifact ? selectedArtifact.two_piece : null;
    // 2. Get sets that match the selected bonus 
      const matchingSets = artifactSets
        .filter((set) => set.two_piece === selectedBonus) // Filter sets with the same bonus
        .filter((set) => set.name !== selectedArtifact?.name); // Exclude the selected set
    // 3. Get all builds that use a combination option with the selected bonus 
      const matchingBuilds = sortedBuilds.filter((build: FullBuild) => {
        const artifactSet1 = matchingSets.some((set) => set.name === build.artifact_set_1);
        const artifactSet2 = matchingSets.some((set) => set.name === build.artifact_set_2);
        const artifactSet3 = matchingSets.some((set) => set.name === build.artifact_set_3);
        const artifactSet4 = matchingSets.some((set) => set.name === build.artifact_set_4);
        const artifactSet5 = matchingSets.some((set) => set.name === build.artifact_set_5);
        const artifactSet6 = matchingSets.some((set) => set.name === build.artifact_set_6);
        const artifactSet7 = matchingSets.some((set) => set.name === build.artifact_set_7);
        const artifactSet8 = matchingSets.some((set) => set.name === build.artifact_set_8);

        const option1Combo = build.artifact_set_2;
        const option2Combo = build.artifact_set_4;
        const option3Combo = build.artifact_set_6;
        const option4Combo = build.artifact_set_8;

        const match1 = option1Combo && (artifactSet1 || artifactSet2)
        const match2 = option2Combo && (artifactSet3 || artifactSet4)
        const match3 = option3Combo && (artifactSet5 || artifactSet6)
        const match4 = option4Combo && (artifactSet7 || artifactSet8)

        return match1 || match2 || match3 || match4
      });
    // 4. Get IDs of all builds in the main dataset 
      const mainBuildsIDs = filteredResults.map((build: FullBuild) => build.ID)
    // 5. Remove any builds that are already present the in main dataset based on IDs 
      const matchingBuildsFiltered = matchingBuilds.filter((build: FullBuild) => !mainBuildsIDs.includes(build.ID));
    
  // FILTER: Apply user filters to additional data 
    const filteredAdditionalResults = matchingBuildsFiltered.filter((build: FullBuild) => {

      // Check character
      const isCharacterSelected = selectedCharacter.length === 0 || 
        selectedCharacter.includes(build.character_name);

      // Check sands
      const isSandsSelected = selectedSands.length === 0 || 
        selectedSands.includes(build.sands_1) ||
        selectedSands.includes(build.sands_2) ||
        selectedSands.includes(build.sands_3);

      // Check goblet
      const isGobletSelected = selectedGoblet.length === 0 || 
        selectedGoblet.includes(build.goblet_1) ||
        selectedGoblet.includes(build.goblet_2);

      // Check circlet
      const isCircletSelected = selectedCirclet.length === 0 || 
        selectedCirclet.includes(build.circlet_1) ||
        selectedCirclet.includes(build.circlet_2);

      // Check substats
      const isSubstatsSelected = selectedSubstats.length === 0 || 
        selectedSubstats.includes(build.substats_1) ||
        selectedSubstats.includes(build.substats_2) ||
        selectedSubstats.includes(build.substats_3) ||
        selectedSubstats.includes(build.substats_4) ||
        selectedSubstats.includes(build.substats_5) ||
        selectedSubstats.includes(build.substats_6) ||
        selectedSubstats.includes(build.flatstats_1) ||
        selectedSubstats.includes(build.flatstats_2);

      // Check element
      const isElementSelected = selectedElements.length === 0 || 
        selectedElements.includes(build.element);

      return (
        isCharacterSelected &&
        isSandsSelected &&
        isGobletSelected &&
        isCircletSelected &&
        isSubstatsSelected &&
        isElementSelected
      );
    });

  // SORT: Sort both sets of data by relevancy 
    // 1. Key maps. Establishes relevancy ranking 
      const keyValueMapOne = {
        flatstats_2: selectedSubstats,
        flatstats_1: selectedSubstats,
        substats_6: selectedSubstats,
        substats_5: selectedSubstats,
        substats_4: selectedSubstats,
        substats_3: selectedSubstats,
        substats_2: selectedSubstats,
        substats_1: selectedSubstats,
      };

      const keyValueMapTwo = {
        circlet_3: selectedCirclet,
        circlet_2: selectedCirclet,
        circlet_1: selectedCirclet,
        goblet_2: selectedGoblet,
        goblet_1: selectedGoblet,
        sands_3: selectedSands,
        sands_2: selectedSands,
        sands_1: selectedSands,
        artifact_set_8: selectedArtifactSet,
        artifact_set_7: selectedArtifactSet,
        artifact_set_6: selectedArtifactSet,
        artifact_set_5: selectedArtifactSet,
        artifact_set_4: selectedArtifactSet,
        artifact_set_3: selectedArtifactSet,
        artifact_set_2: selectedArtifactSet,
        artifact_set_1: selectedArtifactSet,
        //artifact_option_4: selectedArtifactSet,
        //artifact_option_3: selectedArtifactSet,
        //artifact_option_2: selectedArtifactSet,
        //artifact_option_1: selectedArtifactSet,
      };
    // 2. Sort by specified key order 
      const sortByMultipleKeys = (data: any, keyValueMap:  Record<string, string | string[]>, conditionFn: any) => {
        return Object.entries(keyValueMap).reduce((acc, [key, selectedValue]) => {

          const sortToFront = acc.filter((item: any) => {
            if (conditionFn(item, key)) {
              return false;
            }
            if (selectedValue) {
              return selectedValue.includes(item[key]);
            }
          });

          const sortToBack = acc.filter((item: any) => {
            if (conditionFn(item, key)) {
              // If the condition is met, treat as alternative
              return true;
            }
            if (selectedValue) {
              return !selectedValue.includes(item[key]);
            }
          });

          return sortToFront.length > 0 ? [...sortToFront, ...sortToBack] : acc;
        }, data);
      };
    // 3. Special exclusion criteria for relevancy sorting 
      const conditionFn = (item: any, key: string) => {
        // Define a map for the artifact sets that need to be compared for each key
        const higherSetsMap: Record<string, string[]> = {
          'artifact_set_8': ['artifact_set_1', 'artifact_set_2', 'artifact_set_3', 'artifact_set_4', 'artifact_set_5', 'artifact_set_6'],
          'artifact_set_7': ['artifact_set_1', 'artifact_set_2', 'artifact_set_3', 'artifact_set_4', 'artifact_set_5', 'artifact_set_6'],
          'artifact_set_6': ['artifact_set_1', 'artifact_set_2', 'artifact_set_3', 'artifact_set_4'],
          'artifact_set_5': ['artifact_set_1', 'artifact_set_2', 'artifact_set_3', 'artifact_set_4'],
          'artifact_set_4': ['artifact_set_1', 'artifact_set_2'],
          'artifact_set_3': ['artifact_set_1', 'artifact_set_2'],
        };

        // Check if the key is in the map
        if (higherSetsMap[key]) {
          // Check if the value of the current artifact set matches any of the higher artifact sets
          return higherSetsMap[key].some(higherKey => item[key] === item[higherKey]);
        }
        // Otherwise, treat as "main"
        return false;
      };
    // 4. Count matching substats 
      const countMatchingSubstats = (item: any, selectedSubstats: any, maxSubstats = 6) => {
        let matchCount = 0;

        // Check for matches in each substats property
        for (let i = 1; i <= maxSubstats; i++) {
          const key = `substats_${i}`;
          if (item[key]) {
            matchCount += selectedSubstats.filter((stat: string) => item[key] === stat).length;
          }
          if (item[key] === 'CRIT Rate/DMG' && selectedSubstats.includes('CRIT Rate') && selectedSubstats.includes('CRIT DMG')) {
            matchCount += 1;
          }
        }
        // Check for matches in each flat substats property
        for (let i = 1; i <= 2; i++) {
          const key = `flatstats_${i}`;
          if (item[key]) {
            matchCount += selectedSubstats.filter((stat: string) => item[key] === stat).length;
          }
        }
        return matchCount;
      };
    // 5. Apply relevancy sorting to main results 
      let sortedResults = filteredResults;
      sortedResults = sortByMultipleKeys(sortedResults, keyValueMapOne, conditionFn);
      sortedResults.sort((a: FullBuild, b: FullBuild) => {
        const aCount = countMatchingSubstats(a, selectedSubstats);
        const bCount = countMatchingSubstats(b, selectedSubstats);
        return bCount - aCount;
      });
      sortedResults = sortByMultipleKeys(sortedResults, keyValueMapTwo, conditionFn);
    // 6. Split pinned builds and move them to the front 
      const pinnedBuilds = sortedResults.filter((pinned: FullBuild) => selectedPinned.includes(pinned.ID));
      const otherBuilds = sortedResults.filter((pinned: FullBuild) => !selectedPinned.includes(pinned.ID));
      const sortedMainResults = pinnedBuilds.length > 0 ? pinnedBuilds.concat(otherBuilds) : otherBuilds;
    // 7. Apply relevancy sorting to  additional results 
      let sortedAdditionalResults = filteredAdditionalResults;
      sortedAdditionalResults = sortByMultipleKeys(sortedAdditionalResults, keyValueMapOne, conditionFn);
      sortedAdditionalResults.sort((a: FullBuild, b: FullBuild) => {
        const aCount = countMatchingSubstats(a, selectedSubstats);
        const bCount = countMatchingSubstats(b, selectedSubstats);
        return bCount - aCount;
      });
      sortedAdditionalResults = sortByMultipleKeys(sortedAdditionalResults, keyValueMapTwo, conditionFn);

  // CHECK: Are there actually any filters applied? 
    //const noFilter = buildsDataRaw.length === sortedMainResults.length; // returns true if same length

  return (
    <section id="results">

      {/* Results Header */}
      <div className="results-header">
        {/* Display number of builds found */}
          {/*<h2>{
            noFilter ? `Showing all ${sortedMainResults.length} builds` : 
            sortedMainResults.length === 1 ? `Found 1 build matching filters` : 
            sortedMainResults.length > 1 ? `Found ${sortedMainResults.length} builds matching filters` : 
            'No builds matching current filters'}
          </h2>*/}
        {/* Filter Tabs */} 
          {!isMobile &&
          <FilterTabs 
            isMenuOpen={isMenuOpen}
            isMobile={isMobile}
            handleTabChange={handleTabChange}
            currentFilterTab={currentFilterTab}
            selectedFilters={selectedFilters}
            savedFilters={savedFilters}
          />}{/* End Filter Tabs */}
        {/* Builds Filter Menu: What sections are shown? */} 
          <div id="filter-build">
            {/* Filter Options */}
              <div className="filter-build-options">
                {buildSectionsOptions.map((section: string) => (
                  <button
                    key={section} 
                    className={buildSectionsVisible.includes(section) ? 'highlighted' : ''}
                    onClick={() => handleBuildSectionsVisibleChange(section)}
                  >
                    <img 
                      className="filter-icon" 
                      src={
                        section === 'All' ? `./images/icons/Icon Character Archive.webp` :
                        section === 'Artifact Sets' ? `./images/icons/Icon Artifact.webp` :
                        section === 'About' ? `./images/icons/Icon Tutorial.webp` :
                        section === 'ER Recommendation' ? `./images/icons/Icon Energy Recharge.webp` :
                        `./images/icons/Icon ${section}.webp`
                      } 
                    />
                    {section}
                  </button>
                ))}
              </div>{/* End Filter Options */}
          </div>{/* End Builds Filter Menu */}
      </div>{/* End Results Header */}

      {/* Main Results Content */}
      <div id="main-content">
        <div id="results-content">

        {!viewPinned ? (
          <>
          {/* Show build(s) that match filter(s) */}
            {sortedMainResults.map((build: FullBuild) => (
              <CharacterCard
                key={build.ID}
                build={build}
                handleSelectedPinned={handleSelectedPinned}
                buildSectionsOptions={buildSectionsOptions}
                buildSectionsVisible={buildSectionsVisible}
                selectedPinned={selectedPinned}
                selectedFilters={selectedFilters}
                isMobile={isMobile}
              />
            ))}
          </>
        ) : (
          <>
          {/* Show only pinned builds */}
            {pinnedBuilds.map((build: FullBuild) => (
              <CharacterCard
                key={build.ID}
                build={build}
                handleSelectedPinned={handleSelectedPinned}
                buildSectionsOptions={buildSectionsOptions}
                buildSectionsVisible={buildSectionsVisible}
                selectedPinned={selectedPinned}
                selectedFilters={selectedFilters}
                isMobile={isMobile}
              />
            ))}
          </>
        )}

        {/* ERROR DISPLAY */}
          {/* View pinned, but no pinned builds? */}
          {viewPinned && pinnedBuilds.length === 0 &&
            <div id="no-results">
              <h3>No pinned builds.<br /> You can pin a build by clicking the &#9733; icon.</h3>
            </div>}
          {/* No results for main set? */}
          {sortedMainResults.length === 0 && sortedAdditionalResults.length === 0 && selectedArtifact &&
            <div id="no-results">
              <h3>No on-set results found for {selectedArtifact.name} with the selected stats.</h3>
              <button className="reset-filters" onClick={() => resetFilters('artifact-set')}>Check for off-piece matches?</button>
            </div>}
          {/* No artifact selected and no result? */}
          {sortedMainResults.length === 0 && sortedAdditionalResults.length === 0 && !selectedArtifact &&
            <div id="no-results">
              <h3>These are not the builds you're looking for...</h3>
              <button className="reset-filters" onClick={() => resetFilters(null)}>Reset filters</button>
            </div>}

          </div>{/* End Main Results Content */}
        
        {/* Additional results - Partial matches based on 2-piece set bonus */}
          {sortedAdditionalResults.length > 0 &&
          <div id="additional-results-wrapper">
            <div className="additional-results-text">
              <h3 className="additional-results-content-header">
                {sortedAdditionalResults.length} Partial match{sortedAdditionalResults.length > 1 && 'es'}: <br />
                Matching 2&ndash;Piece Set Bonus
              </h3>
              <p>{selectedArtifact?.name} 2&ndash;Piece Set Bonus: <b>{selectedArtifact?.two_piece}</b></p>
              <p>The builds listed below use the same 2&ndash;Piece Set Bonus and their listed set can be freely exchanged for any other set with the same bonus.</p>
            </div>
            <div id="additional-results-content">
              {/* Show build(s) that match filter(s) */}
              {sortedAdditionalResults.map((build: FullBuild) => (
                <CharacterCard
                  key={build.ID}
                  build={build}
                  handleSelectedPinned={handleSelectedPinned}
                  buildSectionsOptions={buildSectionsOptions}
                  buildSectionsVisible={buildSectionsVisible}
                  selectedPinned={selectedPinned}
                  selectedFilters={selectedFilters}
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>}{/* End Additional results */}
        </div>{/* End Main Content */}

      <Footer />
    </section>
  );
}