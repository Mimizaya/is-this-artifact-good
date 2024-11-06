import { useState } from 'react';
import CharacterCard from './CharacterCard.tsx'
import { characterData } from '../data/character-data.ts';
import { artifactSets } from '../data/artifact-data.ts';
import { Character, Build, ArtifactSet } from '../types/types.ts';

export default function Results({
  buildsDataRaw,
  selectedCharacter,
  selectedArtifactSet,
  selectedSands,
  selectedGoblet,
  selectedCirclet,
  selectedSubstats,
  selectedElements,
  resetFilters,
}: {
  buildsDataRaw: any;
  selectedCharacter: any;
  selectedArtifactSet: any;
  selectedSands: any;
  selectedGoblet: any;
  selectedCirclet: any;
  selectedSubstats: any;
  selectedElements: any;
  resetFilters: any;
}) {

  // Save filter configurations - WIP
    //const [currentFilterTab, setCurrentFilterTab] = useState(1);
    //const [savedFilters, setSavedFilters] = useState([]);

  // Handle pin builds
    const [selectedPinned, setSelectedPinned] = useState<number[]>([]);
    const handleSelectedPinned = (id: number) => {
      setSelectedPinned((prev) =>
        prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
      );
    }

  // Add additional static data to builds
    const buildsDataEnriched = buildsDataRaw.map((build: Build) => {

      // Find the corresponding character data based on name
      const characterInfo = characterData.find((character: Character) => character.name === build.character_name);

      // Find the corresponding character data based on name
      const artifactSetOneInfo = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set);
      const artifactSetTwoInfo = artifactSets.find((artifact: ArtifactSet) => artifact.name === build.artifact_set_2);

      // If a match is found, merge the relevant data
      return {
        ...build,
        element: characterInfo ? characterInfo.element : null,
        rarity: characterInfo ? characterInfo.rarity : null,
        pinned: false,
        artifact_set_two_piece: artifactSetOneInfo ? artifactSetOneInfo.two_piece : null,
        artifact_set_four_piece: artifactSetOneInfo ? artifactSetOneInfo.four_piece : null,
        artifact_set_2_two_piece: artifactSetTwoInfo ? artifactSetTwoInfo.two_piece : null,
        artifact_set_2_four_piece: artifactSetTwoInfo ? artifactSetTwoInfo.four_piece : null,
      };
    });


  // SORTING / FILTERING 
  // --------------------------------------------

  // Apply default sorting order 
      const artifactOrder = artifactSets.map(artifact => artifact.name);
      const elementOrder = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'];

      const sortedBuilds = buildsDataEnriched.sort((a: Build, b: Build) => {
        // If a character is selected, sort by internal build IDs
        if(selectedCharacter.length > 0) {
          return a.ID - b.ID;  // Ascending order
        }
        // If no character is selected, sort builds by:
        // Selected Artifact Set > Artifact Sets > Element > Character Name
        if(selectedCharacter.length <= 0) {
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

  // Apply user filters to data
    const filteredResults = sortedBuilds.filter((build: Build) => {
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

  // Sort filtered data by relevancy
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

    sortedResults = sortByMultipleKeys(sortedResults, keyValueMapOne);
    sortedResults.sort((a: Build, b: Build) => {
      const aCount = countMatchingSubstats(a, selectedSubstats);
      const bCount = countMatchingSubstats(b, selectedSubstats);
      return bCount - aCount;
    });
    sortedResults = sortByMultipleKeys(sortedResults, keyValueMapTwo);


    const pinnedBuilds = sortedResults.filter((pinned: Build) => selectedPinned.includes(pinned.ID));
    const otherBuilds = sortedResults.filter((pinned: Build) => !selectedPinned.includes(pinned.ID));

    const filteredAndSortedResults = pinnedBuilds.length > 0 ? pinnedBuilds.concat(otherBuilds) : otherBuilds;

  // Are any filters applied? Compare raw data length vs final results.
    const noFilter = buildsDataRaw.length === filteredAndSortedResults.length; // returns true if same length

  // Handle filter build components
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
    

  return (
    <section id="results">
      <div className="results-header">
        <h2>{
          noFilter ? 'Showing all builds' : 
          filteredAndSortedResults.length === 1 ? `Found ${filteredAndSortedResults.length} build matching filters` : 
          filteredAndSortedResults.length > 1 ? `Found ${filteredAndSortedResults.length} builds matching filters` : 
          'No builds matching current filters'}
        </h2>

        {/* FILTER WHAT IS SHOWN IN THE BUILDS */}
        <div id="filter-build">
          <div className="filter-build-option">
            <h3>Select visible build sections</h3>
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
          </div>
        </div>

      </div>


      <div className="row">
      {filteredAndSortedResults.length === 0 &&
        <div id="no-results">
          <h3>These are not the builds you're looking for...</h3>
          <button className="reset-filters" onClick={() => resetFilters()}>Reset filters</button>
        </div>}

      {filteredAndSortedResults.map((build: Build) => (
        <div 
          key={build.ID} 
          className="column"
        >
          <CharacterCard 
            build={build}
            handleSelectedPinned={handleSelectedPinned}
            buildSectionsVisible={buildSectionsVisible}
            selectedPinned={selectedPinned}
            selectedCharacter={selectedCharacter}
            selectedArtifactSet={selectedArtifactSet}
            selectedSands={selectedSands}
            selectedGoblet={selectedGoblet}
            selectedCirclet={selectedCirclet}
            selectedSubstats={selectedSubstats}
          />
        </div>
      ))}
      </div>
    </section>
  );
}