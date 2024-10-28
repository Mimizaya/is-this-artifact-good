import CharacterCard from './CharacterCard.tsx'
import { characterData } from '../data/character-data.ts';
import { artifactSets } from '../data/artifact-data.ts';
import { Character, Build } from '../types/types.ts';

export default function Results({
  characterDataCSV,
  selectedCharacter,
  selectedArtifactSet,
  selectedSands,
  selectedGoblet,
  selectedCirclet,
  selectedSubstats,
  selectedElements,
  resetFilters,
}: {
  characterDataCSV: any;
  selectedCharacter: any;
  selectedArtifactSet: any;
  selectedSands: any;
  selectedGoblet: any;
  selectedCirclet: any;
  selectedSubstats: any;
  selectedElements: any;
  resetFilters: any;
}) {

  // Save filter configurations
    //const [currentFilterTab, setCurrentFilterTab] = useState(1);
    //const [savedFilters, setSavedFilters] = useState([]);




  // Map static character data to builds in filteredResult
    const enrichedResults = characterDataCSV.map((build: Build) => {

      // Find the corresponding character data based on name
      const characterInfo = characterData.find((character: Character) => character.name === build.character_name);

      // If a match is found, merge the relevant data
      return {
        ...build,
        element: characterInfo ? characterInfo.element : null,
        rarity: characterInfo ? characterInfo.rarity : null,
      };
    });

  // Sorting 
    // Sort builds by element > name
      // Define order for elements (based on loading screen order)
      /*const elementOrder = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'];

      const sortedCharacters = enrichedResults.sort((a: Build, b: Build) => {
        const indexA = elementOrder.indexOf(a.element);
        const indexB = elementOrder.indexOf(b.element);

        // Sort by element order first
        if (indexA !== indexB) {
          return indexA - indexB;
        }

        // If elements are the same, sort by name
        return a.character_name.localeCompare(b.character_name);
      });*/

    // Sort builds by artifact set > name
      /*const artifactOrder = artifactSets.map(artifact => artifact.name);

      console.log(artifactOrder)

      const sortedCharacters = enrichedResults.sort((a: Build, b: Build) => {
        const indexA = artifactOrder.indexOf(a.artifact_set);
        const indexB = artifactOrder.indexOf(b.artifact_set);

        // Sort by element order first
        if (indexA !== indexB) {
          return indexA - indexB;
        }

        // If elements are the same, sort by name
        return a.character_name.localeCompare(b.character_name);
      });*/

    // Sort builds by artifact set > element > name
      const artifactOrder = artifactSets.map(artifact => artifact.name);
      const elementOrder = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Dendro', 'Cryo', 'Geo'];

      const sortedCharacters = enrichedResults.sort((a: Build, b: Build) => {
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
      });

  // Calculate results from active filters
    const filteredResults = sortedCharacters.filter((build: Build) => {
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

      // Only include builds that meet the criteria for selected filters
      return (
        isCharacterSelected &&
        isArtifactSetSelected &&
        isSandsSelected &&
        isGobletSelected &&
        isCircletSelected &&
        isSubstatsSelected &&
        isElementSelected
      );
    });

  // Filter applied?
    const noFilter = sortedCharacters.length === filteredResults.length;

  return (
    <section id="results">
      <div className="results-header">
        <h2>{
          noFilter ? 'Showing all builds' : 
          filteredResults.length === 1 ? `Found ${filteredResults.length} build matching filters` : 
          filteredResults.length > 1 ? `Found ${filteredResults.length} builds matching filters` : 
          'No builds matching current filters'}
        </h2>
      </div>


      <div className="row">
      {filteredResults.length === 0 &&
        <div id="no-results">
          <h3>These are not the builds you're looking for...</h3>
          <button className="reset-filters" onClick={() => resetFilters()}>Reset filters</button>
        </div>}

      {filteredResults.map((build: Build) => (
        <div 
          key={build.character_name + build.build_name + build.artifact_set + build.artifact_set_2} 
          className="column"
        >
          <CharacterCard 
            build={build}
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