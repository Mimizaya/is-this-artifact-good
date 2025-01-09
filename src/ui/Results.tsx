import { useState, useEffect, useRef, useMemo } from 'react';

// Datasets
import { characterData } from '../data/character-data.ts';
import { artifactSets } from '../data/artifact-data.ts';
import { elements } from '../data/elements.ts';

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
  updateResults,
}: {
  isMobile: boolean;
  buildsDataRaw: RawBuild[];
  selectedFilters: SelectedFilters;
  resetFilters: (filter: string | null) => void;
  handleTabChange: (tabId: number, filter: string | null, value: string | null) => void;
  currentFilterTab: number;
  savedFilters: SavedFilters;
  isMenuOpen: boolean;
  viewPinned: boolean;
  updateResults: any;
}) {

  // SELECTED FILTERS
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Destructure the selected filters object 
      const { selectedCharacter, selectedArtifactSet, selectedSands, selectedGoblet, selectedCirclet, selectedSubstats, selectedElements } = selectedFilters;


  // BUILD CONTENT: Decide what sections are displayed
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Initial state 
    const buildSectionsOptions = ['All', 'Artifact Sets', 'About', 'Sands', 'Goblet', 'Circlet', 'Substats', 'ER Recommendation'];
    const [buildSectionsVisible, setBuildSectionsVisible] = useState(buildSectionsOptions);
  // #2 Handle toggling of each option 
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
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 State to store IDs of pinned builds 
    const [selectedPinned, setSelectedPinned] = useState<number[]>([]);
  // #2 Handle adding or removing ID from state 
    const handleSelectedPinned = (e: any, id: number) => {
      e.stopPropagation();
      setSelectedPinned((prev) =>
        prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
      );
    }


  // ENRICH DATA: Add additional data to builds 
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Create new array containing the enriched builds from the raw data 
    const buildsDataEnriched = useMemo(() => {
    return buildsDataRaw.map((build: RawBuild) => {
  // #2 Find the corresponding character data based on character name 
    const characterInfo = characterData.find((character: Character) => character.name === build.character_name);
  // #3 Find the corresponding artifact data based on set name 
    const artifactSet1Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_1);
    const artifactSet2Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_2);
    const artifactSet3Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_3);
    const artifactSet4Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_4);
    const artifactSet5Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_5);
    const artifactSet6Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_6);
    const artifactSet7Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_7);
    const artifactSet8Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_8);
    const artifactSet9Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_9);
    const artifactSet10Info = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_10);
  // #4 If a match is found, merge the relevant data 
    // Use `!` to assert that result is not null/undefined
      return {
        ...build,
        element: characterInfo!.element,
        rarity: characterInfo!.rarity,
        banner_offset: characterInfo?.banner_offset,

        // Artifact option 1
        artifact_set_1_two_piece: artifactSet1Info!.two_piece,
        artifact_set_1_four_piece: artifactSet1Info!.four_piece,
        artifact_set_2_two_piece: artifactSet2Info ? artifactSet2Info.two_piece : null,

        // Artifact option 2
        artifact_set_3_two_piece: artifactSet3Info ? artifactSet3Info.two_piece : null,
        artifact_set_3_four_piece: artifactSet3Info ? artifactSet3Info.four_piece : null,
        artifact_set_4_two_piece: artifactSet4Info ? artifactSet4Info.two_piece : null,
        
        // Artifact option 3
        artifact_set_5_two_piece: artifactSet5Info ? artifactSet5Info.two_piece : null,
        artifact_set_5_four_piece: artifactSet5Info ? artifactSet5Info.four_piece : null,
        artifact_set_6_two_piece: artifactSet6Info ? artifactSet6Info.two_piece : null,
        
        // Artifact option 4
        artifact_set_7_two_piece: artifactSet7Info ? artifactSet7Info.two_piece : null,
        artifact_set_7_four_piece: artifactSet7Info ? artifactSet7Info.four_piece : null,
        artifact_set_8_two_piece: artifactSet8Info ? artifactSet8Info.two_piece : null,

        // Artifact option 5
        artifact_set_9_two_piece: artifactSet9Info ? artifactSet9Info.two_piece : null,
        artifact_set_9_four_piece: artifactSet9Info ? artifactSet9Info.four_piece : null,
        artifact_set_10_two_piece: artifactSet10Info ? artifactSet10Info.two_piece : null,
      };
    });
    }, [buildsDataRaw]);


  // SORTING OPTIONS: Set the method of sorting
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 States/refs (current & available methods, ascending/descending, ref for menu) 
    const [sortingOption, setSortingOption] = useState<string>('Relevance');
    const [sortingOptionsMenuOpen, setSortingOptionsMenuOpen] = useState<boolean>(false);
    const [sortDescending, setSortDescending] = useState<boolean>(false)
    const sortingOptions: string[] = [
      'Relevance', 
      'Character – A–Z', 
      'Character – By Release',  
      'Artifact Set – A–Z', 
      'Artifact Set – By Release'];
    const sortingOptionsMenuOpenRef = useRef<HTMLInputElement>(null);
  // #2 Handle updating of selected method 
    const handleChangeSortingOption = (option: string) => {
      setSortingOption(option);
      setSortingOptionsMenuOpen(!sortingOptionsMenuOpen);
    }
  // #3 Handle open/close sorting menu 
    const handleToggleSortingMenu = () => {
      setSortingOptionsMenuOpen(!sortingOptionsMenuOpen);
    }
  // #4 Listen for clicks outside of menu if opened 
    useEffect(() => {
      // Add the event listener when the dropdown is open
      if (sortingOptionsMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      // Cleanup the event listener on component unmount or when dropdown closes
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [sortingOptionsMenuOpen]);
  // #5 Handle clicks outside menu 
    const handleClickOutside = (event: any) => {
      // Check if the click was outside the dropdown and button
      if (sortingOptionsMenuOpenRef.current && !sortingOptionsMenuOpenRef.current.contains(event.target)) {
        setSortingOptionsMenuOpen(false);
      }
    };


  // SORT: Apply default sorting order 
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Get character and artifact order from data 
    const artifactOrder = artifactSets.map(artifact => artifact.name);
    const characterOrder = characterData.map(character => character.name);
  // #2 Get element order from data 
    const elementOrder = elements;
  // #3 Swap artifact values to first in option, if selected 
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
      if (build.artifact_set_10 === selectedArtifactSet) {
        const temp = build.artifact_set_10;
        build.artifact_set_10 = build.artifact_set_9;
        build.artifact_set_9 = temp;
      }
      return build;
    };
    const swappedBuilds = buildsDataEnriched.map((build: FullBuild) => swapArtifactSets(build, selectedArtifactSet[0]?.toString()));
  // #4 Apply default sorting 
    const sortedBuilds = swappedBuilds.sort((a: FullBuild, b: FullBuild) => {

      // Establish indexes
      const indexACharacter = characterOrder.indexOf(a.character_name);
      const indexBCharacter = characterOrder.indexOf(b.character_name); 
      const indexAArtifact = artifactOrder.indexOf(a.artifact_set_1);
      const indexBArtifact = artifactOrder.indexOf(b.artifact_set_1);
      const indexAElement = elementOrder.indexOf(a.element);
      const indexBElement = elementOrder.indexOf(b.element);

      // If a character filter is checked, sort builds by internal build IDs
      if(selectedCharacter.length > 0) {
       return sortDescending ? b.ID - a.ID : a.ID - b.ID;
      }

      // If a element filter is checked, sort builds by elemental groups > character order
      if(selectedElements.length > 0) {
        // Sort by artifact order
        if (indexAElement !== indexBElement) {
          return indexAElement - indexBElement;
        }
        // Sort by character order
        if (indexACharacter !== indexBCharacter) {
          return indexACharacter - indexBCharacter;
        }
        // Sort by build IDs
        return sortDescending ? b.ID - a.ID : a.ID - b.ID;
      }

      // If an artifact set filter is checked, sort builds by character order, then by artifact
      if(selectedArtifactSet.length > 0) {
        // Sort by character order
        if (indexACharacter !== indexBCharacter) {
          return indexACharacter - indexBCharacter;
        }
        // Sort by artifact order
        if (indexAArtifact !== indexBArtifact) {
          return indexAArtifact - indexBArtifact;
        }
        // Sort by build IDs
        return sortDescending ? b.ID - a.ID : a.ID - b.ID;
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
        // Sort by build IDs
        return sortDescending ? b.ID - a.ID : a.ID - b.ID;

        // Sort by name, alphabetical
        //return a.character_name.localeCompare(b.character_name);
      }
      return 0;
    });


  // FILTER: Apply user filters to main data 
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Create new array containing the filtered builds from default sorted builds 
    const filteredResults = sortedBuilds.filter((build: FullBuild) => { 
  // #2 Check pinned builds 
    const isBuildPinned = selectedPinned.length === 0 || 
      selectedPinned.includes(build.ID);
  // #3 Check character 
    const isCharacterSelected = selectedCharacter.length === 0 || 
      selectedCharacter.includes(build.character_name);
  // #4 Check artifact set 
    const isArtifactSetSelected = selectedArtifactSet.length === 0 || 
      selectedArtifactSet.includes(build.artifact_set_1) ||
      selectedArtifactSet.includes(build.artifact_set_2) ||
      selectedArtifactSet.includes(build.artifact_set_3) ||
      selectedArtifactSet.includes(build.artifact_set_4) ||
      selectedArtifactSet.includes(build.artifact_set_5) ||
      selectedArtifactSet.includes(build.artifact_set_6) ||
      selectedArtifactSet.includes(build.artifact_set_7) ||
      selectedArtifactSet.includes(build.artifact_set_8) ||
      selectedArtifactSet.includes(build.artifact_set_9) ||
      selectedArtifactSet.includes(build.artifact_set_10);
  // #5 Check sands 
    const isSandsSelected = selectedSands.length === 0 || 
      selectedSands.includes(build.sands_1) ||
      selectedSands.includes(build.sands_2) ||
      selectedSands.includes(build.sands_3);
  // #6 Check goblet 
    const isGobletSelected = selectedGoblet.length === 0 || 
      selectedGoblet.includes(build.goblet_1) ||
      selectedGoblet.includes(build.goblet_2);
  // #7 Check circlet 
    const isCircletSelected = selectedCirclet.length === 0 || 
      selectedCirclet.includes(build.circlet_1) ||
      selectedCirclet.includes(build.circlet_2);
  // #8 Check substats 
    const isSubstatsSelected = selectedSubstats.length === 0 || 
      selectedSubstats.includes(build.substats_1) ||
      selectedSubstats.includes(build.substats_2) ||
      selectedSubstats.includes(build.substats_3) ||
      selectedSubstats.includes(build.substats_4) ||
      selectedSubstats.includes(build.substats_5) ||
      selectedSubstats.includes(build.flatstats_1) ||
      selectedSubstats.includes(build.flatstats_2);
  // #9 Check element 
    const isElementSelected = selectedElements.length === 0 || 
      selectedElements.includes(build.element);
  // #10 Return results that match criteria (If pinned, push to front) 
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


  // MATCHING BUILDS: Add a new result for matching 2-Piece set boni 
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Get selected artifact and it's bonus. Omit bonus if 4* set 
    const fourStarSets = ['The Exile', 'Instructor'];
    const selectedArtifact = artifactSets.find((set) => set.name === selectedArtifactSet[0]);
    const selectedBonus = 
      fourStarSets.includes(selectedArtifact?.name ?? '') ? null :
      !fourStarSets.includes(selectedArtifact?.name ?? '') ? selectedArtifact?.two_piece : 
      null;
  // #2 Get sets that match the selected bonus 
    const matchingSets = artifactSets
      .filter((set) => set.two_piece === selectedBonus) // Filter sets with the same bonus
      .filter((set) => set.name !== selectedArtifact?.name) // Exclude the selected set
      .map((set) => set.name);
  // #3 Get all builds that use a combination option with the selected bonus 
    const matchingBuilds = sortedBuilds.filter((build: FullBuild) => {
      const artifactSet1 = matchingSets.includes(build.artifact_set_1);
      const artifactSet2 = matchingSets.includes(build.artifact_set_2);
      const artifactSet3 = matchingSets.includes(build.artifact_set_3);
      const artifactSet4 = matchingSets.includes(build.artifact_set_4);
      const artifactSet5 = matchingSets.includes(build.artifact_set_5);
      const artifactSet6 = matchingSets.includes(build.artifact_set_6);
      const artifactSet7 = matchingSets.includes(build.artifact_set_7);
      const artifactSet8 = matchingSets.includes(build.artifact_set_8);
      const artifactSet9 = matchingSets.includes(build.artifact_set_9);
      const artifactSet10 = matchingSets.includes(build.artifact_set_10);

      const option1Combo = build.artifact_set_2;
      const option2Combo = build.artifact_set_4;
      const option3Combo = build.artifact_set_6;
      const option4Combo = build.artifact_set_8;
      const option5Combo = build.artifact_set_10;

      const match1 = option1Combo && (artifactSet1 || artifactSet2)
      const match2 = option2Combo && (artifactSet3 || artifactSet4)
      const match3 = option3Combo && (artifactSet5 || artifactSet6)
      const match4 = option4Combo && (artifactSet7 || artifactSet8)
      const match5 = option5Combo && (artifactSet9 || artifactSet10)

      return match1 || match2 || match3 || match4 || match5
    });
  // #4 Get IDs of all builds in the main dataset 
    const mainBuildsIDs = filteredResults.map((build: FullBuild) => build.ID)
  // #5 Remove any builds that are already present the in main dataset based on the IDs 
    const matchingBuildsFiltered = matchingBuilds.filter((build: FullBuild) => !mainBuildsIDs.includes(build.ID));
  

  // FILTER: Apply user filters to additional data
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Create new array containing the filtered builds from matching builds 
    const filteredAdditionalResults = matchingBuildsFiltered.filter((build: FullBuild) => {
  // #2 Check character 
    const isCharacterSelected = selectedCharacter.length === 0 || 
      selectedCharacter.includes(build.character_name);
  // #3 Check sands 
    const isSandsSelected = selectedSands.length === 0 || 
      selectedSands.includes(build.sands_1) ||
      selectedSands.includes(build.sands_2) ||
      selectedSands.includes(build.sands_3);
  // #4 Check goblet 
    const isGobletSelected = selectedGoblet.length === 0 || 
      selectedGoblet.includes(build.goblet_1) ||
      selectedGoblet.includes(build.goblet_2);
  // #5 Check circlet 
    const isCircletSelected = selectedCirclet.length === 0 || 
      selectedCirclet.includes(build.circlet_1) ||
      selectedCirclet.includes(build.circlet_2);
  // #6 Check substats 
    const isSubstatsSelected = selectedSubstats.length === 0 || 
      selectedSubstats.includes(build.substats_1) ||
      selectedSubstats.includes(build.substats_2) ||
      selectedSubstats.includes(build.substats_3) ||
      selectedSubstats.includes(build.substats_4) ||
      selectedSubstats.includes(build.substats_5) ||
      selectedSubstats.includes(build.flatstats_1) ||
      selectedSubstats.includes(build.flatstats_2);
  // #7 Check element 
    const isElementSelected = selectedElements.length === 0 || 
      selectedElements.includes(build.element);
  // #8 Return results that match criteria 
      return (
        isCharacterSelected &&
        isSandsSelected &&
        isGobletSelected &&
        isCircletSelected &&
        isSubstatsSelected &&
        isElementSelected
      );
    });


  // APPLY USER SELECTED SORTING: 
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Assign filtered data to variable for further sorting 
    let sortedResults = filteredResults;
    let sortedAdditionalResults = filteredAdditionalResults;


  // SORT DATA BY OPTION: Relevance
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Key maps. Establish relevancy rankings 
    const substatsKeyMap = {
      flatstats_2: selectedSubstats,
      flatstats_1: selectedSubstats,
      substats_5: selectedSubstats,
      substats_4: selectedSubstats,
      substats_3: selectedSubstats,
      substats_2: selectedSubstats,
      substats_1: selectedSubstats,
    };

    const artifactKeyMapMain = {
      circlet_3: selectedCirclet,
      circlet_2: selectedCirclet,
      circlet_1: selectedCirclet,
      goblet_2: selectedGoblet,
      goblet_1: selectedGoblet,
      sands_3: selectedSands,
      sands_2: selectedSands,
      sands_1: selectedSands,
      artifact_set_10: selectedArtifactSet,
      artifact_set_9: selectedArtifactSet,
      artifact_set_8: selectedArtifactSet,
      artifact_set_7: selectedArtifactSet,
      artifact_set_6: selectedArtifactSet,
      artifact_set_5: selectedArtifactSet,
      artifact_set_4: selectedArtifactSet,
      artifact_set_3: selectedArtifactSet,
      artifact_set_2: selectedArtifactSet,
      artifact_set_1: selectedArtifactSet,
    };

    const artifactKeyMapMatching = {
      circlet_3: selectedCirclet,
      circlet_2: selectedCirclet,
      circlet_1: selectedCirclet,
      goblet_2: selectedGoblet,
      goblet_1: selectedGoblet,
      sands_3: selectedSands,
      sands_2: selectedSands,
      sands_1: selectedSands,
      artifact_set_10: matchingSets,
      artifact_set_9: matchingSets,
      artifact_set_8: matchingSets,
      artifact_set_7: matchingSets,
      artifact_set_6: matchingSets,
      artifact_set_5: matchingSets,
      artifact_set_4: matchingSets,
      artifact_set_3: matchingSets,
      artifact_set_2: matchingSets,
      artifact_set_1: matchingSets,
    };
  // #2 Sort by specified key order 
    const sortByMultipleKeysMain = (
      data: any,
      keyValueMap: Record<string, string | string[]>,
      conditionFn: any
    ) => {
      return Object.entries(keyValueMap).reduce((acc, [key, selectedValue]) => {
        const sortToFront = acc.filter((item: any) => {

          // Skip sorting if the conditionFn is satisfied
          if (conditionFn(item, key)) {
            return false;
          }
          if (selectedValue) {
            return selectedValue.includes(item[key]);
          }
          return false;
        });

        const sortToBack = acc.filter((item: any) => {
          // Skip sorting if the conditionFn is satisfied
          if (conditionFn(item, key)) {
            return true;
          }
          if (selectedValue) {
            return !selectedValue.includes(item[key]);
          }
          return true;
        });

        return sortToFront.length > 0 ? [...sortToFront, ...sortToBack] : acc;
      }, data);
    };
    const sortByMultipleKeysMatches = (
      data: any,
      keyValueMap: Record<string, string | string[]>,
      conditionFn: any
    ) => {
      return Object.entries(keyValueMap).reduce((acc, [key, selectedValue]) => {
        const sortToFront = acc.filter((item: any) => {

          // Only sort for combinations artifact options
          if (key.startsWith("artifact_set_")) {

            // Get the set number from the key (e.g., artifact_set_10 -> 10)
            const setNumber = parseInt(key.split('_')[2]);

            // Check for the previous set in the sequence and handle accordingly
            if (setNumber === 9 && (!item["artifact_set_10"] || item["artifact_set_10"].length === 0)) {
              return false;  // Skip artifact_set_9 if artifact_set_10 is null/empty
            }
            if (setNumber === 7 && (!item["artifact_set_8"] || item["artifact_set_8"].length === 0)) {
              return false;
            }
            if (setNumber === 5 && (!item["artifact_set_6"] || item["artifact_set_6"].length === 0)) {
              return false;  // Skip artifact_set_7 if artifact_set_8 is empty
            }     
            if (setNumber === 3 && (!item["artifact_set_4"] || item["artifact_set_4"].length === 0)) {
              return false;  // Skip artifact_set_7 if artifact_set_8 is empty
            }
            if (setNumber === 1 && (!item["artifact_set_2"] || item["artifact_set_2"].length === 0)) {
              return false;  // Skip artifact_set_7 if artifact_set_8 is empty
            }
          }

          // Skip sorting if the conditionFn is satisfied
          if (conditionFn(item, key)) {
            return false;
          }
          if (selectedValue) {
            return selectedValue.includes(item[key]);
          }
          return false;
        });

        const sortToBack = acc.filter((item: any) => {
          // Skip sorting if the conditionFn is satisfied
          if (conditionFn(item, key)) {
            return true;
          }
          if (selectedValue) {
            return !selectedValue.includes(item[key]);
          }
          return true;
        });

        return sortToFront.length > 0 ? [...sortToFront, ...sortToBack] : acc;
      }, data);
    };
  // #3 Special exclusion criteria for relevancy sorting 
    const conditionFn = (item: any, key: string) => {
      // Define a map for the artifact sets that need to be compared for each key
      const higherSetsMap: Record<string, string[]> = {
        'artifact_set_10': ['artifact_set_1', 'artifact_set_2', 'artifact_set_3', 'artifact_set_4', 'artifact_set_5', 'artifact_set_6', 'artifact_set_7', 'artifact_set_8'],
        'artifact_set_9': ['artifact_set_1', 'artifact_set_2', 'artifact_set_3', 'artifact_set_4', 'artifact_set_5', 'artifact_set_6', 'artifact_set_7', 'artifact_set_8'],
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
  // #4 Count matching substats 
    const countMatchingSubstats = (item: any, selectedSubstats: any, maxSubstats = 5, maxFlatstats = 2) => {
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
      for (let i = 1; i <= maxFlatstats; i++) {
        const key = `flatstats_${i}`;
        if (item[key]) {
          matchCount += selectedSubstats.filter((stat: string) => item[key] === stat).length;
        }
      }
      return matchCount;
    };
  // #5 Apply relevancy sorting to main results 
    if(sortingOption === 'Relevance') {
      sortedResults = sortByMultipleKeysMain(sortedResults, substatsKeyMap, conditionFn);
      sortedResults.sort((a: FullBuild, b: FullBuild) => {
        const aCount = countMatchingSubstats(a, selectedSubstats);
        const bCount = countMatchingSubstats(b, selectedSubstats);
        return bCount - aCount;
      });
      sortedResults = sortByMultipleKeysMain(sortedResults, artifactKeyMapMain, conditionFn);
    }
  // #6 Apply relevancy sorting to additional results 
    if(sortingOption === 'Relevance') {
      sortedAdditionalResults = sortByMultipleKeysMatches(sortedAdditionalResults, substatsKeyMap, conditionFn);
      sortedAdditionalResults.sort((a: FullBuild, b: FullBuild) => {
        const aCount = countMatchingSubstats(a, selectedSubstats);
        const bCount = countMatchingSubstats(b, selectedSubstats);
        return bCount - aCount;
      });
      sortedAdditionalResults = sortByMultipleKeysMatches(sortedAdditionalResults, artifactKeyMapMatching, conditionFn);
    } 


  // SORT DATA BY OPTION: Character
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 ALPHABETICAL
    // #1 Apply sorting to main results 
      if(sortingOption === 'Character – A–Z') {
        sortedResults.sort((a: FullBuild, b: FullBuild) => {
          if (a.character_name < b.character_name) {
            return -1; // a comes before b
          }
          if (a.character_name > b.character_name) {
            return 1; // b comes before a
          }
          return sortDescending ? b.ID - a.ID : a.ID - b.ID;
        });
      }
    // #2 Apply sorting to additional results 
      if(sortingOption === 'Character – A–Z') {
        sortedAdditionalResults.sort((a: FullBuild, b: FullBuild) => {
          if (a.character_name < b.character_name) {
            return -1; // a comes before b
          }
          if (a.character_name > b.character_name) {
            return 1; // b comes before a
          }
          return sortDescending ? b.ID - a.ID : a.ID - b.ID;
        });
      }
  
  // #2 CHRONOLOGICAL
    // #1 Apply sorting to main results 
      if(sortingOption === 'Character – By Release') {
        sortedResults.sort((a: FullBuild, b: FullBuild) => {
          const indexACharacter = characterOrder.indexOf(a.character_name);
          const indexBCharacter = characterOrder.indexOf(b.character_name);

          // Sort by character chronology
          if (indexACharacter !== indexBCharacter) {
            return indexACharacter - indexBCharacter;
          }
          return sortDescending ? b.ID - a.ID : a.ID - b.ID;
        });
      }
    // #2 Apply sorting to additional results 
      if(sortingOption === 'Character – By Release') {
        sortedAdditionalResults.sort((a: FullBuild, b: FullBuild) => {
          if (a.character_name < b.character_name) {
            return -1; // a comes before b
          }
          if (a.character_name > b.character_name) {
            return 1; // b comes before a
          }
          return sortDescending ? b.ID - a.ID : a.ID - b.ID;
        });
      }


  // SORT DATA BY OPTION: Artifact Set
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 ALPHABETICAL
    // #1 Apply sorting to main results 
      if(sortingOption === 'Artifact Set – A–Z') {
        sortedResults.sort((a: FullBuild, b: FullBuild) => {
          if (a.artifact_set_1 < b.artifact_set_1) {
            return -1; // a comes before b
          }
          if (a.artifact_set_1 > b.artifact_set_1) {
            return 1; // b comes before a
          }

          // Sort by character chronology
          const indexACharacter = characterOrder.indexOf(a.character_name);
          const indexBCharacter = characterOrder.indexOf(b.character_name);
          if(sortDescending) {
            if (indexACharacter !== indexBCharacter) {
              return indexBCharacter - indexACharacter;
            }
          }

          return 0;
        });
      }
    // #2 Apply sorting to additional results 
      if(sortingOption === 'Artifact Set – A–Z') {
        sortedAdditionalResults.sort((a: FullBuild, b: FullBuild) => {
          if (a.artifact_set_1 < b.artifact_set_1) {
            return -1; // a comes before b
          }
          if (a.artifact_set_1 > b.artifact_set_1) {
            return 1; // b comes before a
          }

          // Sort by character chronology
          const indexACharacter = characterOrder.indexOf(a.character_name);
          const indexBCharacter = characterOrder.indexOf(b.character_name);
          if(sortDescending) {
            if (indexACharacter !== indexBCharacter) {
              return indexBCharacter - indexACharacter;
            }
          }

          return 0; // a and b are equal
        });
      }

  // #2 CHRONOLOGICAL
    // #1 Apply sorting to main results 
      if(sortingOption === 'Artifact Set – By Release') {
        sortedResults.sort((a: FullBuild, b: FullBuild) => {
          const indexAArtifact = artifactOrder.indexOf(a.artifact_set_1);
          const indexBArtifact = artifactOrder.indexOf(b.artifact_set_1);
          // Sort by artifact order
          if (indexAArtifact !== indexBArtifact) {
            return indexAArtifact - indexBArtifact;
          }

          // Sort by character chronology
          const indexACharacter = characterOrder.indexOf(a.character_name);
          const indexBCharacter = characterOrder.indexOf(b.character_name);
          if(sortDescending) {
            if (indexACharacter !== indexBCharacter) {
              return indexBCharacter - indexACharacter;
            }
          }

          return 0; // If equal, return 0 to indicate no sorting needed
        });
      }
    // #2 Apply sorting to additional results 
      if(sortingOption === 'Artifact Set – By Release') {
        sortedAdditionalResults.sort((a: FullBuild, b: FullBuild) => {
          const indexAArtifact = artifactOrder.indexOf(a.artifact_set_1);
          const indexBArtifact = artifactOrder.indexOf(b.artifact_set_1);
          // Sort by artifact order
          if (indexAArtifact !== indexBArtifact) {
            return indexAArtifact - indexBArtifact;
          }

          // Sort by character chronology
          const indexACharacter = characterOrder.indexOf(a.character_name);
          const indexBCharacter = characterOrder.indexOf(b.character_name);
          if(sortDescending) {
            if (indexACharacter !== indexBCharacter) {
              return indexBCharacter - indexACharacter;
            }
          }

          return 0; // If equal, return 0 to indicate no sorting needed
        });
      }


  // SORT ORDER: Ascending or Descending?
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Handle change of sort order 
    const handleToggleSortingOrder = () => {
      setSortDescending(!sortDescending)
    }
  // #2 Apply order to results if ascending, else leave as default (descending) 
    if(sortDescending) {
      sortedResults = sortedResults.reverse();
    }


  // PINNED BUILS: Move to front of results 
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Split pinned builds from the main data 
    const pinnedBuilds = sortedResults.filter((pinned: FullBuild) => selectedPinned.includes(pinned.ID));
    const otherBuilds = sortedResults.filter((pinned: FullBuild) => !selectedPinned.includes(pinned.ID));
  // #2 Combine pinned builds back with main data 
    const sortedMainResults = pinnedBuilds.length > 0 ? pinnedBuilds.concat(otherBuilds) : otherBuilds;

  // Run function to set amount of results
  // Used in mobile filter options
  updateResults(sortedMainResults.length + sortedAdditionalResults.length);

  return (
    <section id="results">

      {/* Results Header */}
      <header id="results-header">
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
        {/* Builds filter menu: What sections are shown? */} 
          {!isMobile &&
          <div id="filter-build">
            {/* Filter Options */}
              <h4>Show build sections</h4>
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
          </div>}{/* End Builds Filter Menu */}
        {/* Select sorting option */} 
          {!isMobile &&
          <div id="select-sorting-option" ref={sortingOptionsMenuOpenRef}>
            <h4>Sort results by</h4>
            <div className="sorting-buttons">
              <button className="option" onClick={() => handleToggleSortingMenu()}>
                <img 
                  className="sort-image"
                  src="./images/icons/Icon Sort.webp"
                />
                <p>{sortingOption}</p>
              </button>
              <button className="order" onClick={() => handleToggleSortingOrder()}>
                <img 
                  className="sort-order-image"
                  src="./images/icons/Icon Sort Direction.webp"
                />
              </button>
            </div>
            {sortingOptionsMenuOpen &&
            <ul>
              {sortingOptions.map((option: string) => (
                <li onClick={() => handleChangeSortingOption(option)}>{option}</li>
              ))}
            </ul>}
          </div>}
      </header>{/* End Results Header */}

      {/* Main Results Content */}   
      <div id="main-content">

        {!viewPinned ? (
          <>
            {/* MAIN RESULTS */}
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
                isMenuOpen={isMenuOpen}
                matchingSets={matchingSets}
              />
            ))}

            {/* ADDITIONAL RESULTS */}
            {sortedAdditionalResults.length > 0 &&
            <>
            <div className="additional-results-text">
              <h3>
                Matching 2&ndash;Piece Set Bonus
              </h3>
              <p className="selected-bonus">
                <b>{selectedArtifact?.two_piece.replace('.', '')}</b> from {selectedArtifact?.name}.
              </p>
              <p>The following builds use the same 2&ndash;piece set bonus. You can use {selectedArtifact?.name} to substitute the highlighted sets.</p>
            </div>

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
                isMenuOpen={isMenuOpen}
                matchingSets={matchingSets}
              />
            ))}
            </>}
          </>
        ) : (
          <>
            {/* PINNED BUILDS ONLY */}
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
                isMenuOpen={isMenuOpen}
                matchingSets={matchingSets}
              />
            ))}
          </>
        )}

        {/* No results display */}
          {/* 1. View pinned */}
          {
            viewPinned && pinnedBuilds.length === 0 &&
            <div id="no-results">
              <img
                className="no-result-img"
                src={'./option1.webp'}
              />
              <h3>No pinned builds.<br /> You can pin a build by clicking the &#9733; icon.</h3>
            </div>}
          {/* 2. Only artifact set is selected */}
          {
            sortedMainResults.length === 0 && sortedAdditionalResults.length === 0 && 
            selectedArtifactSet.length > 0 &&
            selectedCharacter.length === 0 &&
            selectedSands.length === 0 &&
            selectedGoblet.length === 0 &&
            selectedCirclet.length === 0 &&
            selectedSubstats.length === 0 &&
            selectedElements.length === 0 &&
            <div id="no-results">
              <img
                className="no-result-img surprised"
                src={'./option4.webp'}
              />
              <h3>No one wants {selectedArtifactSet}? Inconceivable!</h3>
              <button className="reset-filters error" onClick={() => resetFilters('artifact')}>Select something useful instead.</button>
            </div>}
          {/* 3. Artifact set is selected, character is not */}
          {
            sortedMainResults.length === 0 && sortedAdditionalResults.length === 0 && 
            selectedCharacter.length === 0 &&
            selectedArtifactSet.length > 0 &&
            (
              selectedSands.length > 0 ||
              selectedGoblet.length > 0 ||
              selectedCirclet.length > 0 ||
              selectedSubstats.length > 0 ||
              selectedElements.length > 0
            ) &&
            <div id="no-results">
              <img
                className="no-result-img sad"
                src={'./option3.webp'}
              />
              {selectedElements.length === 0 &&
              <>
              <h3>No on-set results found for {selectedArtifactSet} with the current filter selection.</h3>
              <button className="reset-filters error" onClick={() => resetFilters('artifact')}>Check for off-piece matches</button></>}

              {selectedElements.length > 0 &&
              <>
              <h3>{selectedArtifactSet} isn't used by any {selectedElements.join(' or ')} characters.</h3>
              <button className="reset-filters error" onClick={() => resetFilters('view-artifact')}>View builds using {selectedArtifactSet}</button></>}

            </div>}
          {/* 4. Character is selected + any combination */}
          {
            sortedMainResults.length === 0 && sortedAdditionalResults.length === 0 && 
            selectedCharacter.length > 0 &&
            (
              selectedArtifactSet.length > 0 || 
              selectedSands.length > 0 ||
              selectedGoblet.length > 0 ||
              selectedCirclet.length > 0 ||
              selectedSubstats.length > 0 ||
              selectedElements.length > 0
            ) &&
            <div id="no-results">
              <img
                className="no-result-img sad"
                src={'./option3.webp'}
              />

              {/* 1. No artifact set selected */}
              {selectedArtifactSet.length === 0 &&
              <>
              <h3>{selectedCharacter[0]} doesn't have any builds matching the current filters.</h3>
              <button className="reset-filters error" onClick={() => resetFilters('view-character')}>View builds for {selectedCharacter[0]}</button>
              </>}

              {/* 2. Selected an artifact set */}
              {selectedArtifactSet.length > 0 &&
              <>
              <h3>{selectedCharacter} does not use {selectedArtifactSet}.</h3>
              <button className="reset-filters error" onClick={() => resetFilters('view-character')}>View builds for {selectedCharacter}</button>
              <button className="reset-filters error" onClick={() => resetFilters('view-artifact')}>View builds using {selectedArtifactSet}</button>
              </>}

            </div>}
          {/* 5. No artifact nor character selected */}
          {
            sortedMainResults.length === 0 && sortedAdditionalResults.length === 0 && 
            selectedArtifactSet.length === 0 &&
            selectedCharacter.length === 0 &&
            <div id="no-results">
              <img
                className="no-result-img"
                src={'./option1.webp'}
              />
              <h3>Paimon looked everywhere, but she couldn't find what you're looking for...</h3>
              <button className="reset-filters error" onClick={() => resetFilters(null)}>Clear all filters</button>
            </div>}

      </div>{/* End Main Content */}
      
      <Footer />
    </section>
  );
}