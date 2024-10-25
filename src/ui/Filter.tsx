import React from 'react';
import { useState } from 'react';

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

  const [characterDropDownOpen, setCharacterDropDownOpen] = useState(false);
  const [artifactSetDropDownOpen, setArtifactSetDropDownOpen] = useState(false);
  const [sandsDropDownOpen, setSandsDropDownOpen] = useState(false);
  const [gobletDropDownOpen, setGobletDropDownOpen] = useState(false);
  const [circletDropDownOpen, setCircletDropDownOpen] = useState(false);

  return (
    <section id="filter">

      {/* CHARACTER */}
      {/* --------------------------------------- */}
      <div className="filter-card">
        <h2>Character</h2>
        <div onClick={() => setCharacterDropDownOpen(!characterDropDownOpen)} className={selectedCharacter.length === 1 ? 'dropdown active' : 'dropdown'}>
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
        {characterDropDownOpen && (
          <ul className="dropdown-menu">
            <li onClick={() => {
              handleCharacterChange('clear selection')
              setCharacterDropDownOpen(!characterDropDownOpen)
            }}>Clear selection</li>
            {characterData.map((character) => (
              <li key={character.name} onClick={() => {
                handleCharacterChange(character.name)
                setCharacterDropDownOpen(!characterDropDownOpen)
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
        <div onClick={() => setArtifactSetDropDownOpen(!artifactSetDropDownOpen)} className={selectedArtifactSet.length === 1 ? 'dropdown active' : 'dropdown'}>
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
        {artifactSetDropDownOpen && (
          <ul className="dropdown-menu">
            <li onClick={() => {
              handleArtifactSetChange('clear selection')
              setArtifactSetDropDownOpen(!artifactSetDropDownOpen)
            }}>Clear selection</li>
            {artifactSets.map((set) => (
              <li key={set.name} onClick={() => {
                handleArtifactSetChange(set.name)
                setArtifactSetDropDownOpen(!artifactSetDropDownOpen)
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
                onClick={() => setSandsDropDownOpen(!sandsDropDownOpen)}
              >
                <p>{selectedSands.length > 0 ? selectedSands : 'Select a sands'}</p>
              </div>
            }

            {artifact.name === 'Goblet' && 
              <div 
                className={selectedGoblet.length > 0 ? 'dropdown active' : 'dropdown'}
                onClick={() => setGobletDropDownOpen(!gobletDropDownOpen)}
              >
                <p>{selectedGoblet.length > 0 ? selectedGoblet : 'Select a sands'}</p>
              </div>
            }

            {artifact.name === 'Circlet' && 
              <div 
                className={selectedCirclet.length > 0 ? 'dropdown active' : 'dropdown'}
                onClick={() => setCircletDropDownOpen(!circletDropDownOpen)}
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