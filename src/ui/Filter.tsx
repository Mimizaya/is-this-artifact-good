import React from 'react';
import { useState, useRef, useEffect } from 'react';

// Datasets
import { characterData } from '../data/character-data.ts';
import { artifactSets, artifactSands, artifactGoblet, artifactCirclet } from '../data/artifact-data.ts';
import { substats } from '../data/substats.ts';
import { elements } from '../data/elements.ts';

// Type definitions
import { Character, ArtifactSet, SelectedFilters } from '../types/types.ts';

export default function Filter({
  resetFilters,
  selectedFilters,
  handleCharacterChange,
  handleArtifactSetChange,
  handleSandsChange,
  handleGobletChange,
  handleCircletChange,
  handleSubstatsChange,
  handleElementsChange,
} : {
  resetFilters: () => void;
  selectedFilters: SelectedFilters;
  handleCharacterChange: (name: string) => void;
  handleArtifactSetChange: (set: string) => void;
  handleSandsChange: (stat: string) => void;
  handleGobletChange: (stat: string) => void;
  handleCircletChange: (stat: string) => void;
  handleSubstatsChange: (stat: string) => void;
  handleElementsChange: (element: string) => void;
}) {

  // Destructure the selected filters object
    const { selectedCharacter, selectedArtifactSet, selectedSands, selectedGoblet, selectedCirclet, selectedSubstats, selectedElements } = selectedFilters;

  // States
    const [characterQuery, setCharacterQuery] = useState<string>('');
    const [characterDropDownOpen, setCharacterDropDownOpen] = useState<boolean>(false);

    const [artifactQuery, setArtifactQuery] = useState<string>('');
    const [artifactSetDropDownOpen, setArtifactSetDropDownOpen] = useState<boolean>(false);

    const [sandsDropDownOpen, setSandsDropDownOpen] = useState<boolean>(false);
    const [gobletDropDownOpen, setGobletDropDownOpen] = useState<boolean>(false);
    const [circletDropDownOpen, setCircletDropDownOpen] = useState<boolean>(false);

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

  // Sort artifacts alphabetically (currently not in use)
    /*const sortedArtifacts = artifactSets.sort((a: ArtifactSet, b: ArtifactSet) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });*/

  // Filtered artifact data based on the query
    const filteredArtifacts = artifactSets.filter((set: ArtifactSet) =>
      set.name.toLowerCase().includes(artifactQuery.toLowerCase())
    );

  // Handle menu behaviours
    const handleDropDown = (menu: string) => {
      if(menu === 'Character') {
        setCharacterDropDownOpen(true);
      }
      if(menu === 'Artifact') {
        setArtifactSetDropDownOpen(true);
      }
      if(menu === 'Sands') {
        setSandsDropDownOpen(true);
      }
      if(menu === 'Goblet') {
        setGobletDropDownOpen(true);
      }
      if(menu === 'Circlet') {
        setCircletDropDownOpen(true);
      }
    }

    const characterDropDownRef = useRef<HTMLInputElement>(null);
    const artifactDropDownRef = useRef<HTMLInputElement>(null);
    const sandsDropDownRef = useRef<HTMLInputElement>(null);
    const gobletDropDownRef = useRef<HTMLInputElement>(null);
    const circletDropDownRef = useRef<HTMLInputElement>(null);

    const handleClickOutside = (event: any) => {
      // Check if the click was outside the dropdown and button
      if (characterDropDownRef.current && !characterDropDownRef.current.contains(event.target)) {
        setCharacterDropDownOpen(false);
      }
      if (artifactDropDownRef.current && !artifactDropDownRef.current.contains(event.target)) {
        setArtifactSetDropDownOpen(false);
      }
      if (sandsDropDownRef.current && !sandsDropDownRef.current.contains(event.target)) {
        setSandsDropDownOpen(false);
      }
      if (gobletDropDownRef.current && !gobletDropDownRef.current.contains(event.target)) {
        setGobletDropDownOpen(false);
      }
      if (circletDropDownRef.current && !circletDropDownRef.current.contains(event.target)) {
        setCircletDropDownOpen(false);
      }
    };

    useEffect(() => {
      // Add the event listener when the dropdown is open
      if (characterDropDownOpen || artifactSetDropDownOpen || sandsDropDownOpen || gobletDropDownOpen || circletDropDownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      // Cleanup the event listener on component unmount or when dropdown closes
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [characterDropDownOpen, artifactSetDropDownOpen, sandsDropDownOpen, gobletDropDownOpen, circletDropDownOpen]);

  return (
    <section id="filter">
      <div className="filter-header">
        <h2>Filter options</h2>
      </div>

      {/* Artifact Filters */}
      <div id="filter-artifact">
        <h2>Artifacts</h2>

        {/* Set */}
        <div className="filter-option" ref={artifactDropDownRef}>
          <h3>Select set</h3>

            {/* Dropdown Toggle */}
            {!artifactSetDropDownOpen ? (
            <>
            <div className="dropdown-wrapper">
              <div 
                onClick={() => handleDropDown('Artifact')} 
                className={selectedArtifactSet.length === 1 ? 'dropdown highlighted' : 'dropdown'}
              >
                <img
                  className="filter-icon"  
                  src={
                    selectedArtifactSet.length > 0 ? `./images/artifacts/flowers/${selectedArtifactSet} Flower.webp` : 
                    selectedArtifactSet.length === 0 ? `./images/artifacts/Icon Artifact.webp` : ''
                  }
                  alt={selectedArtifactSet[0]}
                />
                <p>
                  {selectedArtifactSet.length > 0 ? selectedArtifactSet : "Artifact set"}
                </p>
              </div>

              {/* X button clear the input, if any */}
              {selectedArtifactSet.length === 1 &&
              <button
                className="clear-input"
                onClick={() => handleArtifactSetChange('clear selection')}>
                &#10006;
              </button>}

            </div>
            </>
            ) : (
              <>
              <div className="search-bar">
                <input
                  className="search-input"
                  ref={artifactRef}
                  value={artifactQuery}
                  onChange={handleArtifactQuery}
                  placeholder={selectedArtifactSet.length === 1 ? selectedArtifactSet[0] : "Type to search"}
                />
              </div>
              <ul 
                className="dropdown-menu"
                style={{height:'500px'}}
              >
                {filteredArtifacts.map((set: ArtifactSet) => (
                  <li key={set.name} onClick={() => {
                    handleArtifactSetChange(set.name)
                    setArtifactSetDropDownOpen(!artifactSetDropDownOpen)
                    setArtifactQuery('')
                  }}>
                    <img
                      src={`./images/artifacts/flowers/${set.name} Flower.webp`}
                      alt={selectedArtifactSet[0]}
                    />
                    <p>{set.name}</p>
                  </li>
                ))}
              </ul>


              </>
            )
          }
        </div>

        {/* Mainstats */}
        <div className="filter-artifact-mainstats">
          <h3>Select mainstats</h3>

          {/* Sands */}
          <div className="filter-option" ref={sandsDropDownRef}>
            {/*<h3>Select sands</h3>*/}

            {/* Dropdown Wrapper */}
            {/* Contents: Button and conditional X button */}
            <div className="dropdown-wrapper">

              {/* Dropdown Button */}
              <div 
                className={selectedSands.length > 0 ? 'dropdown highlighted' : 'dropdown'}
                onClick={() => handleDropDown('Sands')}>

                {/* Icon */}
                {/* If a set is selected, show that. Else show generic icon */}
                <img 
                  className="filter-icon"
                  src={
                    selectedArtifactSet.length > 0 ? `./images/artifacts/sands/${selectedArtifactSet} Sands.webp` : 
                    selectedArtifactSet.length === 0 ? `./images/artifacts/Icon Sands.webp` : ''
                  }
                  alt={
                    selectedArtifactSet.length > 0 ? `${selectedArtifactSet} Sands` : 
                    selectedArtifactSet.length === 0 ? `Sands Icon` : ''
                  }/>

                {/* Text */}
                {/* If a stat is selected, show that. Else show placeholder */}
                <p>{selectedSands.length > 0 ? selectedSands[0] : 'Sands'}</p>

              </div>{/* End Dropdown button */}

              {/* Clear Input Button */}
              {selectedSands.length > 0 &&
              <button
                className="clear-input"
                onClick={() => handleSandsChange('clear selection')}>
                &#10006;
              </button>}

            </div>{/* End Dropdown Wrapper */}
            
            {/* Dropdown Menu */}
            {sandsDropDownOpen && (
              <ul className="dropdown-menu">
                {artifactSands.map((stat: string) => (
                  <li key={stat} onClick={() => {
                    handleSandsChange(stat);
                    setSandsDropDownOpen(!sandsDropDownOpen);
                  }}>
                    {stat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Goblet */}
          <div className="filter-option" ref={gobletDropDownRef}>
            {/*<h3>Select goblet</h3>*/}

            {/* Dropdown Wrapper */}
            {/* Contents: Button and conditional X button */}
            <div className="dropdown-wrapper">

              {/* Dropdown Button */}
              <div 
                className={selectedGoblet.length > 0 ? 'dropdown highlighted' : 'dropdown'}
                onClick={() => handleDropDown('Goblet')}>

                {/* Icon */}
                {/* If a set is selected, show that. Else show generic icon */}
                <img 
                  className="filter-icon"
                  src={
                    selectedArtifactSet.length > 0 ? `./images/artifacts/goblets/${selectedArtifactSet} Goblet.webp` : 
                    selectedArtifactSet.length === 0 ? `./images/artifacts/Icon Goblet.webp` : ''
                  }
                  alt={
                    selectedArtifactSet.length > 0 ? `${selectedArtifactSet} Goblet` : 
                    selectedArtifactSet.length === 0 ? `Goblet Icon` : ''
                  }/>

                {/* Text */}
                {/* If a stat is selected, show that. Else show placeholder */}
                <p>{selectedGoblet.length > 0 ? selectedGoblet[0] : 'Goblet'}</p>

              </div>{/* End Dropdown button */}

              {/* Clear Input Button */}
              {selectedGoblet.length > 0 &&
              <button
                className="clear-input"
                onClick={() => handleGobletChange('clear selection')}>
                &#10006;
              </button>}

            </div>{/* End Dropdown Wrapper */}
            
            {/* Dropdown Menu */}
            {gobletDropDownOpen && (
              <ul className="dropdown-menu">
                {artifactGoblet.map((stat: string) => (
                  <li key={stat} onClick={() => {
                    handleGobletChange(stat);
                    setGobletDropDownOpen(!gobletDropDownOpen);
                  }}>
                    {stat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Circlet */}
          <div className="filter-option" ref={circletDropDownRef}>
            {/*<h3>Select circlet</h3>*/}

            {/* Dropdown Wrapper */}
            {/* Contents: Button and conditional X button */}
            <div className="dropdown-wrapper">

              {/* Dropdown Button */}
              <div 
                className={selectedCirclet.length > 0 ? 'dropdown highlighted' : 'dropdown'}
                onClick={() => handleDropDown('Circlet')}>

                {/* Icon */}
                {/* If a set is selected, show that. Else show generic icon */}
                <img 
                  className="filter-icon"
                  src={
                    selectedArtifactSet.length > 0 ? `./images/artifacts/circlets/${selectedArtifactSet} Circlet.webp` : 
                    selectedArtifactSet.length === 0 ? `./images/artifacts/Icon Circlet.webp` : ''
                  }
                  alt={
                    selectedArtifactSet.length > 0 ? `${selectedArtifactSet} Circlet` : 
                    selectedArtifactSet.length === 0 ? `Circlet Icon` : ''
                  }/>

                {/* Text */}
                {/* If a stat is selected, show that. Else show placeholder */}
                <p>{selectedCirclet.length > 0 ? selectedCirclet[0] : 'Circlet'}</p>

              </div>{/* End Dropdown button */}

              {/* Clear Input Button */}
              {selectedCirclet.length > 0 &&
              <button
                className="clear-input"
                onClick={() => handleCircletChange('clear selection')}>
                &#10006;
              </button>}

            </div>{/* End Dropdown Wrapper */}
            
            {/* Dropdown Menu */}
            {circletDropDownOpen && (
              <ul className="dropdown-menu">
                {artifactCirclet.map((stat: string) => (
                  <li key={stat} onClick={() => {
                    handleCircletChange(stat);
                    setCircletDropDownOpen(!circletDropDownOpen);
                  }}>
                    {stat}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>{/* End Mainstats */}

        {/* Substats */}
        <div className="filter-option">
          <h3>Select substats</h3>
          {substats.map((stat: string) => (
            <label key={stat} className={selectedSubstats.includes(stat) ? 'highlighted' : ''}>
              <input
                type="checkbox"
                checked={selectedSubstats.includes(stat)}
                onChange={() => handleSubstatsChange(stat)}
              />
              <img
                className="filter-icon"  
                src={
                  stat === 'HP%' ? `./images/artifacts/Icon HP.webp` :
                  stat === 'ATK%' ? `./images/artifacts/Icon ATK.webp` :
                  stat === 'DEF%' ? `./images/artifacts/Icon DEF.webp` :
                  stat === 'CRIT DMG' ? `./images/artifacts/Icon CRIT Rate.webp` :
                  `./images/artifacts/Icon ${stat}.webp`} 
              />
              {stat}
            </label>
          ))}
        </div>
      </div>{/* End Artifact Filters */}

      {/* Other Filters */}
      <div id="filter-other">
        <h2>Other</h2>

        {/* Character */}
        <div className="filter-option" ref={characterDropDownRef}>
          <h3>Select character</h3>

          {/* Dropdown Toggle */}
          {!characterDropDownOpen ? (
            <>
            {/* Dropdown Wrapper */}
            {/* Contents: Dropdown Button and conditional X button */}
            <div className="dropdown-wrapper">

              {/* Dropdown Button */}
              <div 
                onClick={() => handleDropDown('Character')} 
                className={selectedCharacter.length === 1 ? 'dropdown highlighted' : 'dropdown'}>

                {/* Image */}
                {/* If a character is selected, show that. Else show generic icon */}
                <img 
                  className="filter-icon" 
                  src={
                    selectedCharacter.length > 0 ? `./images/characters/${selectedCharacter}.webp` : 
                    selectedCharacter.length === 0 ? `./images/artifacts/Icon Character.webp` : ''
                  }
                  alt={selectedCharacter[0]}
                />
                <p>
                  {/* Text */}
                  {/* If a character is selected, show that. Else show placeholder */}
                  {selectedCharacter.length === 1 ? selectedCharacter : "Select character"}
                </p>
              </div>{/* End Dropdown Button */}

              {/* Clear Input Button */}
              {selectedCharacter.length === 1 &&
              <button
                className="clear-input"
                onClick={() => handleCharacterChange('clear selection')}>
                &#10006;
              </button>}

            </div>{/* End Dropdown Wrapper */}
            </>
          ) : (
            <>
            {/* Search Bar */}
            <div className="search-bar">
              <input
                className="search-input"
                ref={characterRef}
                value={characterQuery}
                onChange={handleCharacterQuery}
                placeholder={selectedCharacter.length === 1 ? selectedCharacter[0] : "Type to search"}
              />
            </div>
  
            {/* List of characters, filtered by Search Bar */}
            <ul className="dropdown-menu">
              {filteredCharacterData.map((character: Character) => (
                <li 
                  key={character.name} 
                  onClick={() => {
                    handleCharacterChange(character.name)
                    setCharacterDropDownOpen(!characterDropDownOpen)
                    setCharacterQuery('')
                  }}>

                  {/* Image */}
                  <img
                    src={`./images/characters/${character.name}.webp`}
                    alt={character.name}
                  />

                  {/* Text */}
                  <p>{character.name}</p>
                </li>
              ))}
            </ul>
            </>
          )}
        </div>

        {/* Elements */}
        <div className="filter-option">
          <h3>Select element</h3>
          {elements.map((element: string) => (
            <label key={element} className={selectedElements.includes(element) ? 'highlighted' : ''}>
              <input
                type="checkbox"
                checked={selectedElements.includes(element)}
                onChange={() => handleElementsChange(element)}
              />
              <img
                className="filter-icon"   
                src={`./images/elements/${element}.webp`} />
              {element}
            </label>
          ))}
        </div>
      </div>{/* End Other Filters */}


      <button className="reset-filters" onClick={() => resetFilters()}>Reset filters</button>
    </section>
  );
}