import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { characterData } from '../data/character-data.ts';
import { artifactTypesAndStats, artifactSets } from '../data/artifact-data.ts';
import { substats } from '../data/substats.ts';
import { elements } from '../data/elements.ts';
import { Character, ArtifactType, ArtifactSet } from '../types/types.ts';

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
} : {
  resetFilters: any;
  handleCharacterChange: any;
  handleArtifactSetChange: any;
  handleMainstatChange: any;
  handleSubstatsChange: any;
  handleElementsChange: any;
  selectedCharacter: any;
  selectedArtifactSet: any;
  selectedSands: any;
  selectedGoblet: any;
  selectedCirclet: any;
  selectedSubstats: any;
  selectedElements: any;
}) {

  // States
    const [characterQuery, setCharacterQuery] = useState<string>('');
    const [characterDropDownOpen, setCharacterDropDownOpen] = useState<boolean>(false);

    const [artifactQuery, setArtifactQuery] = useState<string>('');
    const [artifactSetDropDownOpen, setArtifactSetDropDownOpen] = useState<boolean>(false);

    const [sandsDropDownOpen, setSandsDropDownOpen] = useState<boolean>(false);
    const [gobletDropDownOpen, setGobletDropDownOpen] = useState<boolean>(false);
    const [circletDropDownOpen, setCircletDropDownOpen] = useState<boolean>(false);

  // Handle menu behaviours
    const handleDropDown = (menu: string) => {
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
    const characterRef = useRef<HTMLInputElement>(null);
    const artifactRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (characterDropDownOpen && characterRef.current) {
        characterRef.current.focus();
      }
      if (artifactSetDropDownOpen && artifactRef.current) {
        artifactRef.current.focus();
      }
    }, [characterDropDownOpen, artifactSetDropDownOpen]);

  // Search queries
    const handleCharacterQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharacterQuery(e.target.value)
    }
    const handleArtifactQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
      setArtifactQuery(e.target.value)
    }

  // Filtered character data based on the query
    const filteredCharacterData = characterData.filter((character: Character) =>
      character.name.toLowerCase().includes(characterQuery.toLowerCase())
    );

  // Sort artifacts alphabetically
    const sortedArtifacts = artifactSets.sort((a: ArtifactSet, b: ArtifactSet) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

  // Filtered artifact data based on the query
    const filteredArtifacts = sortedArtifacts.filter((set: ArtifactSet) =>
      set.name.toLowerCase().includes(artifactQuery.toLowerCase())
    );

  return (
    <section id="filter">

      {/* CHARACTER */}
      <div className="filter-card">
        <h2>Character</h2>

          {/* If menu is open, render search bar */}
          {characterDropDownOpen ? (
            <>
            <div className="search-bar">

              {/* X button to close the dropdown */}
              <div
                className="close-menu"
                onClick={() => setCharacterDropDownOpen(false)}>
                X
              </div>

              {/* Input for filtering the character list */}
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
            <>
            {/* Else if menu is closed, render the dropdown toggle */}
            <div 
              onClick={() => handleDropDown('Character')} 
              className={selectedCharacter.length === 1 ? 'dropdown active' : 'dropdown'}>

              <p>
                {/* If character is selected, render their picture */}
                {selectedCharacter.length === 1 &&
                <img
                  src={`/images/characters/${selectedCharacter}.webp`}
                  alt={selectedCharacter}
                  style={{ width: '20px', marginRight: '10px' }}
                />}

                {/* If character is selected, display their name, otherwise placeholder text */}
                {selectedCharacter.length === 1 ? selectedCharacter : "Select a character"}
              </p>

            </div>
            </>
          )
        }
        {/* Dropdown is open */}
        {characterDropDownOpen && (
          <ul className="dropdown-menu">

            {/* If a character is selected, render a li to clear the selection */}
            {selectedCharacter.length === 1 &&
            <li 
              onClick={() => {
              handleCharacterChange('clear selection')
              setCharacterDropDownOpen(!characterDropDownOpen)
            }}>
              Clear selection
            </li>}

            {/* Render a li for every character in the filtered data */}
            {filteredCharacterData.map((character: Character) => (
              <li key={character.name + character.element} onClick={() => {
                handleCharacterChange(character.name)
                setCharacterDropDownOpen(!characterDropDownOpen)
                setCharacterQuery('')
              }}>

                {/* Character image */}
                <img
                  src={`/images/characters/${character.name}.webp`}
                  alt={character.name}
                  style={{ height: '64px', marginRight: '10px' }}
                />

                {/* Character name */}
                {character.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* ARTIFACT SET */}
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

            {filteredArtifacts.map((set: ArtifactSet) => (
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
      <div className="filter-card">
        {artifactTypesAndStats.map((artifact: ArtifactType) => (
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
                {artifact.stats.map((stat: string) => (
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
                {artifact.stats.map((stat: string) => (
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
                {artifact.stats.map((stat: string) => (
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
      <div className="filter-card">
        <h2>Substats</h2>
        {substats.map((stat: string) => (
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
      <div className="filter-card">
        <h2>Element</h2>
        {elements.map((element: string) => (
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