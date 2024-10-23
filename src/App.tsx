import { useState } from 'react';
import './App.css';
import CharacterCards from 'src/ui/characters';


// DATA IMPORTS
// -------------------------------------------------------
// All character builds
import { characterBuilds } from 'src/data/builds';

// Artifacts and their possible mainstats
import { artifactTypes } from 'src/data/artifacttypes';

// All possible substats
import { substats } from 'src/data/substats';



export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState([]);
  const [selectedArtifactSets, setSelectedArtifactSets] = useState([]);
  const [selectedSubstats, setSelectedSubstats] = useState([]);
  const [selectedSands, setSelectedSands] = useState([]);
  const [selectedGoblet, setSelectedGoblet] = useState([]);
  const [selectedCirclet, setSelectedCirclet] = useState([]);

  const handleCharacterChange = (name) => {
    setSelectedCharacter((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleArtifactSetChange = (set) => {
    setSelectedArtifactSets((prev) =>
      prev.includes(set) ? prev.filter((s) => s !== set) : [...prev, set]
    );
  };

  const handleMainstatChange = (stat, type) => {
    if(type === 'Sands') {
      setSelectedSands((prev) =>
        prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
      );
    }
    if(type === 'Goblet') {
      setSelectedGoblet((prev) =>
        prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
      );
    }
    if(type === 'Circlet') {
      setSelectedCirclet((prev) =>
        prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
      );
    }
  };

  const handleSubstatsChange = (stat) => {
    setSelectedSubstats((prev) =>
      prev.includes(stat) ? prev.filter((n) => n !== stat) : [...prev, stat]
    );
  }

  const resetFilters = () => {
    setSelectedCharacter([]);
    setSelectedArtifactSets([]);
    setSelectedArtifactTypes([]);
    setSelectedSubstats([]);
  }

  const finalFilteredBuilds = characterBuilds.filter(build => {
    // Check character filter
    const isCharacterSelected = selectedCharacter.length === 0 || selectedCharacter.includes(build.character_name);

    // Check artifact set filter
    const isArtifactSetSelected = selectedArtifactSets.length === 0 || 
      build.artifact_set.some(set => selectedArtifactSets.includes(set));

    // Check sands filter if Sands is selected
    const isSandsSelected = selectedSands.length === 0 || 
      build.sands.some(stat => selectedSands.includes(stat));

    // Check goblet filter if Goblet is selected
    const isGobletSelected = selectedGoblet.length === 0 || 
      build.goblet.some(stat => selectedGoblet.includes(stat));

    // Check circlet filter if Circlet is selected
    const isCircletSelected = selectedCirclet.length === 0 || 
      build.circlet.some(stat => selectedCirclet.includes(stat));

    // Check substats
    const isSubstatsSelected = selectedSubstats.length === 0 || 
      build.substats.some(stat => selectedSubstats.includes(stat));

    // Only include builds that meet the criteria for selected filters
    return isCharacterSelected && isArtifactSetSelected && isSandsSelected && isGobletSelected && isCircletSelected && isSubstatsSelected;
  });

  // Remove duplicate names from list of builds
  const uniqueCharacters = characterBuilds.reduce((acc, build) => {
    if (!acc.some(item => item.character_name === build.character_name)) {
      acc.push(build);
    }
    return acc;
  }, []);

  // Extract artifact sets and remove duplicates
  const uniqueArtifactSets = Array.from(new Set(
    characterBuilds.flatMap(build => build.artifact_set)
  ));

  // Check for no filters active
  const noFiltersActive = 
    selectedCharacter.length === 0 &&
    selectedArtifactSets.length === 0 &&
    selectedSands.length === 0 &&
    selectedGoblet.length === 0 &&
    selectedCirclet.length === 0 &&
    selectedSubstats.length === 0

  return (
    <>
      <main>
        <section id="filter">
          <button onClick={() => resetFilters()}>Reset all filters</button>
          <div className="filter-card">
          <h2>Character</h2>
          {uniqueCharacters.map((character) => (
            <label key={character.character_name}>
              <input
                type="checkbox"
                checked={selectedCharacter.includes(character.character_name)}
                onChange={() => handleCharacterChange(character.character_name)}
              />
              {character.character_name}
            </label>
          ))}
          </div>
          
          <div className="filter-card">
          <h2>Artifact Sets</h2>
          {uniqueArtifactSets.map((set) => (
            <label key={set}>
              <input
                type="checkbox"
                checked={selectedArtifactSets.includes(set)}
                onChange={() => handleArtifactSetChange(set)}
              />
              {set}
            </label>
          ))}
          </div>

          <div className="filter-card">
          <h2>Artifact Types</h2>
          {artifactTypes.map((type) => (
            <div className="artifact-type">
            <label key={type.name}>
              <b>{type.name}</b>
            </label>
            <br />
            {type.stats.map((stat) => (
              <label key={type.name + stat}>
              <input 
                type="checkbox"
                checked={
                  type.name === 'Sands' ? selectedSands.includes(stat) :
                  type.name === 'Goblet' ? selectedGoblet.includes(stat) :
                  type.name === 'Circlet' ? selectedCirclet.includes(stat) :
                  false
                }
                onChange={() => {
                  handleMainstatChange(stat, type.name)
                }}
              />
              {stat}
              <br />
              </label>
            ))}
            </div>
          ))}
          </div>

          <div className="filter-card">
          <h2>Substats</h2>
          {substats.map((stat) => (
            <label key={stat}>
              <input
                type="checkbox"
                checked={selectedSubstats.includes(stat)}
                onChange={() => handleSubstatsChange(stat)}
              />
              {stat}
            </label>
          ))}
          </div>
        </section>
        <section id="results">
          <h3>{noFiltersActive ? 'Showing all builds' : finalFilteredBuilds.length > 0 ? 'Builds matching filters' : 'No builds matching current filters'}</h3>
          {finalFilteredBuilds.map(build => (
            <>
              <div className="character-card">
                <h2 className={selectedCharacter.includes(build.character_name) && 'highlighted'}>{build.character_name}</h2>
                <p className="build-name">{build.build_name}</p>

                <p>Artifact Set(s)</p>
                  <ul>
                  {build.artifact_set.map(set => (
                    <li className={selectedArtifactSets.includes(set) && 'highlighted'}>{set}</li>
                  ))}
                  </ul>

                <div className="artifact-type">
                <p>Sands</p>
                  <ul>
                  {build.sands.map(stat => (
                    <li 
                      className={selectedSands.includes(stat) && 'highlighted'}>
                      {stat}
                    </li>
                  ))}
                  </ul>
                </div>

                <div className="artifact-type">
                <p className="artifact-type">Goblet</p>
                  <ul>
                  {build.goblet.map(stat => (
                    <li 
                      className={selectedGoblet.includes(stat) && 'highlighted'}>
                      {stat}
                    </li>
                  ))}
                  </ul>
                </div>

                <div className="artifact-type">
                <p className="artifact-type">Circlet</p>
                  <ul>
                  {build.circlet.map(stat => (
                    <li 
                      className={selectedCirclet.includes(stat) && 'highlighted'}>
                      {stat}
                    </li>
                  ))}
                  </ul>
                </div>

                <div className="substats">
                <p>Substats Priority</p>
                  <ul>
                  {build.substats.map(stat => (
                    <li 
                      className={selectedSubstats.includes(stat) && 'highlighted'}>
                      {stat}
                    </li>
                  ))}
                  </ul>
                </div>

                <div className="er-requirements">
                <p>ER Requirement</p>
                  <ul>
                    <li>{build.er_requirement === null ? 'To be added' : build.er_requirement}</li>
                  </ul>
                </div>
                
                {build.note &&
                <div className="note">
                <p>Note</p>
                  <ul>
                    <li>{build.note}</li>
                  </ul>
                </div>
                }

              </div>
            </>
          ))}
        </section>
      </main>
    </>
  )
}