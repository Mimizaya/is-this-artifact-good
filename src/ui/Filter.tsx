import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { characterData } from 'src/data/character-data';
import { artifactTypesAndStats, artifactSets } from 'src/data/artifact-data';
import { substats } from 'src/data/substats';
import { elements } from 'src/data/elements'

export default function Filter({
  resetFilters,
  handleCharacterChange,
  handleArtifactSetChange,
  handleMainstatChange,
  handleSubstatsChange,
  handleElementsChange,
  selectedCharacter,
  selectedArtifactSet,
  selectedSands,
  selectedGoblet,
  selectedCirclet,
  selectedSubstats,
  selectedElements
}) {

  // States
    const [characterQuery, setCharacterQuery] = useState('');
    const [characterDropDownOpen, setCharacterDropDownOpen] = useState(false);

    const [artifactQuery, setArtifactQuery] = useState('');
    const [artifactSetDropDownOpen, setArtifactSetDropDownOpen] = useState(false);

    const [sandsDropDownOpen, setSandsDropDownOpen] = useState(false);
    const [gobletDropDownOpen, setGobletDropDownOpen] = useState(false);
    const [circletDropDownOpen, setCircletDropDownOpen] = useState(false);

  // Handle menu behaviours
    const handleDropDown = (menu) => {
    if(menu === 'Character') {
      setCharacterDropDownOpen(true);
      setArtifactSetDropDownOpen(false);
      setSandsDropDownOpen(false);
      setGobletDropDownOpen(false);
      setCircletDropDownOpen(false);
    }
    if(menu === 'Artifact') {
      setCharacterDropDownOpen(false);
      setArtifactSetDropDownOpen(true);
      setSandsDropDownOpen(false);
      setGobletDropDownOpen(false);
      setCircletDropDownOpen(false);
    }
    if(menu === 'Sands') {
      setCharacterDropDownOpen(false);
      setArtifactSetDropDownOpen(false);
      setSandsDropDownOpen(true);
      setGobletDropDownOpen(false);
      setCircletDropDownOpen(false);
    }
    if(menu === 'Goblet') {
      setCharacterDropDownOpen(false);
      setArtifactSetDropDownOpen(false);
      setSandsDropDownOpen(false);
      setGobletDropDownOpen(true);
      setCircletDropDownOpen(false);
    }
    if(menu === 'Circlet') {
      setCharacterDropDownOpen(false);
      setArtifactSetDropDownOpen(false);
      setSandsDropDownOpen(false);
      setGobletDropDownOpen(false);
      setCircletDropDownOpen(true);
    }
  }

  // Automatically focus the search inputs when opened
    const characterRef = useRef(null);
    const artifactRef = useRef(null);

    useEffect(() => {
      if (characterDropDownOpen && characterRef.current) {
        characterRef.current.focus();
      }
      if (artifactSetDropDownOpen && artifactRef.current) {
        artifactRef.current.focus();
      }
    }, [characterDropDownOpen, artifactSetDropDownOpen]);

  // Search queries
    const handleCharacterQuery = (e) => {
      setCharacterQuery(e.target.value)
    }
    const handleArtifactQuery = (e) => {
      setArtifactQuery(e.target.value)
    }

  // Filtered character data based on the query
    const filteredCharacterData = characterData.filter(character =>
      character.name.toLowerCase().includes(characterQuery.toLowerCase())
    );

  // Sort artifacts alphabetically
    const sortedArtifacts = artifactSets.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

  // Filtered artifact data based on the query
    const filteredArtifacts = sortedArtifacts.filter(set =>
      set.name.toLowerCase().includes(artifactQuery.toLowerCase())
    );

  return (
    <section id="filter">

      {/* CHARACTER */}
      {/* --------------------------------------- */}
      <div className="filter-card">
        <h2>Character</h2>
          {characterDropDownOpen ? (
            <>
            <div className="search-bar">
              <div
                className="close-menu"
                onClick={() => setCharacterDropDownOpen(false)} 
              >X
              </div>
              <input
                className="search-input"
                ref={characterRef}
                value={characterQuery}
                onChange={handleCharacterQuery}
                placeholder={selectedCharacter.length === 1 ? selectedCharacter : "Type to begin searching"}
              />
            </div>
            </>
            ) : (
            <div 
              onClick={() => handleDropDown('Character')} 
              className={selectedCharacter.length === 1 ? 'dropdown active' : 'dropdown'}
            >
            <p>
              {selectedCharacter.length === 1 &&
              <img
                src={`/images/characters/${selectedCharacter}.webp`}
                alt={selectedCharacter}
                style={{ width: '20px', marginRight: '10px' }}
              />}
              {selectedCharacter.length === 1 ? selectedCharacter[0] : "Select a character"}
            </p>
            </div>
            )
          }
        {characterDropDownOpen && (
          <ul className="dropdown-menu">
            {selectedCharacter.length === 1 &&
            <li 
              onClick={() => {
              handleCharacterChange('clear selection')
              setCharacterDropDownOpen(!characterDropDownOpen)
            }}>
              Clear selection
            </li>}

            {filteredCharacterData.map((character) => (
              <li key={character.name} onClick={() => {
                handleCharacterChange(character.name)
                setCharacterDropDownOpen(!characterDropDownOpen)
                setCharacterQuery('')
              }}>
                <img
                  src={`/images/characters/${character.name}.webp`}
                  alt={character.name}
                  style={{ height: '64px', marginRight: '10px' }}
                />
                {character.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* ARTIFACT SET */}
      {/* --------------------------------------- */}
      <div className="filter-card">
        <h2>Artifact Set</h2>
          {artifactSetDropDownOpen ? (
            <>
            <div className="search-bar">
              <div
                className="close-menu"
                onClick={() => setArtifactSetDropDownOpen(false)} 
              >X
              </div>
              <input
                className="search-input"
                ref={artifactRef}
                value={artifactQuery}
                onChange={handleArtifactQuery}
                placeholder={selectedArtifactSet.length === 1 ? selectedArtifactSet : "Type to begin searching"}
              />
            </div>
            </>
            ) : (
            <div 
              onClick={() => handleDropDown('Artifact')} 
              className={selectedArtifactSet.length === 1 ? 'dropdown active' : 'dropdown'}
            >
            <p>
              {/* {selectedArtifactSet.length > 0 &&
              <img
                src={`/images/characters/${selectedArtifactSet}.webp`}
                alt={selectedArtifactSet}
                style={{ width: '20px', marginRight: '10px' }}
              />}*/}
              {selectedArtifactSet.length > 0 ? selectedArtifactSet : "Select an artifact set"}
            </p>
          </div>
          )
        }
        {artifactSetDropDownOpen && (
          <ul className="dropdown-menu">
            {selectedArtifactSet.length === 1 &&
            <li onClick={() => {
              handleArtifactSetChange('clear selection')
              setArtifactSetDropDownOpen(!artifactSetDropDownOpen)
            }}>Clear selection</li>}

            {filteredArtifacts.map((set) => (
              <li key={set.name} onClick={() => {
                handleArtifactSetChange(set.name)
                setArtifactSetDropDownOpen(!artifactSetDropDownOpen)
                setArtifactQuery('')
              }}>
                {/* {selectedArtifactSet.length > 0 &&
                <img
                  src={`/images/characters/${selectedArtifactSet}.webp`}
                  alt={selectedArtifactSet}
                  style={{ width: '20px', marginRight: '10px' }}
                />}*/}
                {set.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ARTIFACT TYPE - SANDS/GOBLET/CIRCLET */}
      {/* --------------------------------------- */}
      <div className="filter-card">
        {artifactTypesAndStats.map((artifact) => (
          <React.Fragment key={artifact.name}>
            <h2>{artifact.name}</h2>

            {artifact.name === 'Sands' && 
              <div 
                className={selectedSands.length > 0 ? 'dropdown active' : 'dropdown'}
                onClick={() => handleDropDown('Sands')}
              >
                <p>{selectedSands.length > 0 ? selectedSands : 'Select a sands'}</p>
              </div>
            }

            {artifact.name === 'Goblet' && 
              <div 
                className={selectedGoblet.length > 0 ? 'dropdown active' : 'dropdown'}
                onClick={() => handleDropDown('Goblet')}
              >
                <p>{selectedGoblet.length > 0 ? selectedGoblet : 'Select a goblet'}</p>
              </div>
            }

            {artifact.name === 'Circlet' && 
              <div 
                className={selectedCirclet.length > 0 ? 'dropdown active' : 'dropdown'}
                onClick={() => handleDropDown('Circlet')}
              >
                <p>{selectedCirclet.length > 0 ? selectedCirclet : 'Select a circlet'}</p>
              </div>
            }
            
            {sandsDropDownOpen && artifact.name === 'Sands' && (
              <ul className="dropdown-menu">
                <li onClick={() => {
                  handleMainstatChange('clear selection', artifact.name);
                  setSandsDropDownOpen(!sandsDropDownOpen);
                }}>Clear selection</li>
                {artifact.stats.map((stat) => (
                  <li key={stat} onClick={() => {
                    handleMainstatChange(stat, artifact.name);
                    setSandsDropDownOpen(!sandsDropDownOpen);
                  }}>
                    {stat}
                  </li>
                ))}
              </ul>
            )}

            {gobletDropDownOpen && artifact.name === 'Goblet' && (
              <ul className="dropdown-menu">
                <li onClick={() => {
                  handleMainstatChange('clear selection', artifact.name);
                  setGobletDropDownOpen(!gobletDropDownOpen);
                }}>Clear selection</li>
                {artifact.stats.map((stat) => (
                  <li key={stat} onClick={() => {
                    handleMainstatChange(stat, artifact.name);
                    setGobletDropDownOpen(!gobletDropDownOpen);
                  }}>
                    {stat}
                  </li>
                ))}
              </ul>
            )}

            {circletDropDownOpen && artifact.name === 'Circlet' && (
              <ul className="dropdown-menu">
                <li onClick={() => {
                  handleMainstatChange('clear selection', artifact.name);
                  setCircletDropDownOpen(!circletDropDownOpen);
                }}>Clear selection</li>
                {artifact.stats.map((stat) => (
                  <li key={stat} onClick={() => {
                    handleMainstatChange(stat, artifact.name);
                    setCircletDropDownOpen(!circletDropDownOpen);
                  }}>
                    {stat}
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* SUBSTATS */}
      {/* --------------------------------------- */}
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

      {/* ELEMENTS */}
      {/* --------------------------------------- */}
      <div className="filter-card">
        <h2>Element</h2>
        {elements.map((element) => (
          <label key={element}>
            <input
              type="checkbox"
              checked={selectedElements.includes(element)}
              onChange={() => handleElementsChange(element)}
            />
            {element}
          </label>
        ))}
      </div>

      <button onClick={() => resetFilters()}>Reset all filters</button>
    </section>
  );
}