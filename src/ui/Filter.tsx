import React from 'react';
import { useState, useRef, useEffect } from 'react';

// Datasets
import { characterData } from '../data/character-data.ts';
import { 
  artifactSets, 
  artifactSands, 
  artifactGoblet, 
  artifactCirclet } from '../data/artifact-data.ts';
import { substats } from '../data/substats.ts';
import { elements } from '../data/elements.ts';

// Type definitions
import { Character, ArtifactSet, SelectedFilters, SavedFilters } from '../types/types.ts';

// UI
import FilterTabs from './FilterTabs.tsx';
import Logo from './Logo.tsx';

export default function Filter({
  isMobile,
  resetFilters,
  selectedFilters,
  savedFilters,
  isMenuOpen,
  toggleMenu,
  handleTabChange,
  currentFilterTab,
  handleCharacterChange,
  handleArtifactSetChange,
  handleSandsChange,
  handleGobletChange,
  handleCircletChange,
  handleSubstatsChange,
  handleElementsChange,
  resultsNumber,
} : {
  isMobile: boolean;
  resetFilters: (filter: string | null) => void;
  selectedFilters: SelectedFilters;
  savedFilters: SavedFilters;
  isMenuOpen: boolean;
  toggleMenu: (toggle: boolean) => void;
  handleTabChange: (tabId: number, filter: string | null, value: string | null) => void;
  currentFilterTab: number;
  handleCharacterChange: (name: string) => void;
  handleArtifactSetChange: (set: string) => void;
  handleSandsChange: (stat: string) => void;
  handleGobletChange: (stat: string) => void;
  handleCircletChange: (stat: string) => void;
  handleSubstatsChange: (stat: string) => void;
  handleElementsChange: (element: string) => void;
  resultsNumber: number;
}) {

  // SELECTED FILTERS
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Destructure the selected filters object 
      const { selectedCharacter, selectedArtifactSet, selectedSands, selectedGoblet, selectedCirclet, selectedSubstats, selectedElements } = selectedFilters;


  // MENU: Handle dropdown menus
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 States & Refs 
    const [searchDropDownOpen, setSearchDropDownOpen] = useState<boolean>(false);
    const [characterDropDownOpen, setCharacterDropDownOpen] = useState<boolean>(false);
    const [artifactSetDropDownOpen, setArtifactSetDropDownOpen] = useState<boolean>(false);
    const [sandsDropDownOpen, setSandsDropDownOpen] = useState<boolean>(false);
    const [gobletDropDownOpen, setGobletDropDownOpen] = useState<boolean>(false);
    const [circletDropDownOpen, setCircletDropDownOpen] = useState<boolean>(false); 

    const searchDropDownRef = useRef<HTMLInputElement>(null);
    const characterDropDownRef = useRef<HTMLInputElement>(null);
    const artifactDropDownRef = useRef<HTMLInputElement>(null);
    const sandsDropDownRef = useRef<HTMLInputElement>(null);
    const gobletDropDownRef = useRef<HTMLInputElement>(null);
    const circletDropDownRef = useRef<HTMLInputElement>(null);
  // #2 Handle opening of menu on click 
    const handleDropDown = (menu: string) => {
      if(menu === 'Search') {
        setSearchDropDownOpen(true);
      }
      if(menu === 'character') {
        setCharacterDropDownOpen(true);

        //const targetElement = document.getElementById(`${menu}-section`);
        //if (targetElement) {
        //  requestAnimationFrame(() => {
        //    // Scroll the container to the target element
        //    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        //  });
        //}
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
  // #3 Listen for clicks on/outside of menu 
    useEffect(() => {
      // Add the event listener when the dropdown is open
      if (searchDropDownOpen || characterDropDownOpen || artifactSetDropDownOpen || sandsDropDownOpen || gobletDropDownOpen || circletDropDownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleClickOutside);
      }
      // Cleanup the event listener on component unmount or when dropdown closes
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleClickOutside);
      };
    }, [searchDropDownOpen, characterDropDownOpen, artifactSetDropDownOpen, sandsDropDownOpen, gobletDropDownOpen, circletDropDownOpen]);
  // #4 Handle clicks outside menu 
    const handleClickOutside = (event: any) => {
      // Check if the click was outside the dropdown and button
      if (searchDropDownRef.current && !searchDropDownRef.current.contains(event.target) || event.key === 'Enter') {
        setSearchDropDownOpen(false);
        setSearchQuery('');
      }
      if (characterDropDownRef.current && !characterDropDownRef.current.contains(event.target) || event.key === 'Enter') {
        setCharacterDropDownOpen(false);
        setCharacterQuery('');
      }
      if (artifactDropDownRef.current && !artifactDropDownRef.current.contains(event.target) || event.key === 'Enter') {
        setArtifactSetDropDownOpen(false);
        setArtifactQuery('');
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


  // SEARCH: All types
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 State to hold query 
    const [searchQuery, setSearchQuery] = useState<string>('');
  // #2 Update query on input 
    const handleSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value)
    }
  // #3 Filter and sort the list based on query 

    // Modify datasets to include a type property
    const characterDataType = characterData.map((character) => ({
      ...character,
      type: 'Character'
    }));
    const artifactSetsType = artifactSets.map((artifact) => ({
      ...artifact,
      type: 'Artifact'
    }));

    // Filter and sort data based on search
    const filteredSearchData = [...characterDataType, ...artifactSetsType]
    .filter((search: Character | ArtifactSet) =>
      search.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      search.alias?.toLowerCase().includes(searchQuery.toLowerCase())
      // other properties that should be matched?
    )
    .sort((a, b) => {
      const queryLower = searchQuery.toLowerCase();
      const indexA = a.name.toLowerCase().indexOf(queryLower);
      const indexB = b.name.toLowerCase().indexOf(queryLower);

      // If indexA or indexB is -1 (meaning no match), push those results to the end
      if (indexA === -1 && indexB === -1) return 0; // No change if neither match
      if (indexA === -1) return 1; // Put 'a' after 'b'
      if (indexB === -1) return -1; // Put 'b' after 'a'

      // Sort by the position of the first match
      return indexA - indexB;
    });


  // SEARCH: Character 
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 State to hold query 
    const [characterQuery, setCharacterQuery] = useState<string>('');
  // #2 Update query on input 
    const handleCharacterQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharacterQuery(e.target.value)
    }
  // #3 Filter and sort the list based on query 
    const filteredCharacterData = characterData
    .filter((character: Character) =>
      character.name.toLowerCase().includes(characterQuery.toLowerCase()) ||
      character.alias?.toLowerCase().includes(characterQuery.toLowerCase())
    )
    .sort((a, b) => {
      const queryLower = characterQuery.toLowerCase();
      const indexA = a.name.toLowerCase().indexOf(queryLower);
      const indexB = b.name.toLowerCase().indexOf(queryLower);

      // If indexA or indexB is -1 (meaning no match), push those characters to the end
      if (indexA === -1 && indexB === -1) return 0; // No change if neither match
      if (indexA === -1) return 1; // Put 'a' after 'b'
      if (indexB === -1) return -1; // Put 'b' after 'a'

      // Sort by the position of the first match
      return indexA - indexB;
    });
  // #4 Automatically set/unset filter based on result 
    useEffect(() => {
      if (filteredCharacterData.length === 1) {
        const newCharacter = filteredCharacterData[0].name;
        handleCharacterChange(newCharacter);
      } 
      else if (filteredCharacterData.length > 1) {
        if (characterQuery.length > 0) { // Prevent resetting when selecting by clicking, which sets the query to empty string.
          resetFilters('character');
        }
      }
    }, [characterQuery]);

    // SEARCH CHARACTER ADDITION: Toggle visible characters by their element
    // ————————————————————————————————————————————————————————————————————————————————————————
    // #1 State to hold the selected element 
      const [characterElementSelection, setCharacterElementSelection] = useState<string>('');
    // #2 Function to change the selected element 
      const handleCharacterElementSelection = (element: string) => {
        if(element === characterElementSelection) {
          setCharacterElementSelection('');
        }
        else {
          setCharacterElementSelection(element);
        }
      }
    // #3 Filter the data to only include characters of the selected element 
      const filteredCharacterDataByElement = filteredCharacterData.filter((character: Character) => {
        if (characterElementSelection) {
          return character.element === characterElementSelection;
        }
        else {
          return character;
        }
      })


  // SEARCH: Artifact set 
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 State to hold query 
    const [artifactQuery, setArtifactQuery] = useState<string>('');
  // #2 Update query on input 
    const handleArtifactQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
      setArtifactQuery(e.target.value)
    }
  // #3 Filter and sort the list based on query 
    const filteredArtifacts = artifactSets.filter((set: ArtifactSet) =>
      set.name.toLowerCase().includes(artifactQuery.toLowerCase()) ||
      set.alias?.toLowerCase().includes(artifactQuery.toLowerCase())
    )      
    .sort((a, b) => {
      const queryLower = artifactQuery.toLowerCase();
      const indexA = a.name.toLowerCase().indexOf(queryLower);
      const indexB = b.name.toLowerCase().indexOf(queryLower);

      // If indexA or indexB is -1 (meaning no match), push those characters to the end
      if (indexA === -1 && indexB === -1) return 0; // No change if neither match
      if (indexA === -1) return 1; // Put 'a' after 'b'
      if (indexB === -1) return -1; // Put 'b' after 'a'

      // Sort by the position of the first match
      return indexA - indexB;
    });
  // #4 Automatically set/unset filter based on result 
    useEffect(() => {
      if (filteredArtifacts.length === 1) {
        const newArtifact = filteredArtifacts[0].name;
        handleArtifactSetChange(newArtifact);
      }
      else if (filteredArtifacts.length > 1) {
        if(artifactQuery.length > 0 ) { // Prevent resetting when selecting by clicking, which sets the query to empty string.
          resetFilters('artifact');
        }
      }
    }, [artifactQuery]);


  // SCROLL: Save scroll distance and return if applicable
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Use a ref to persist the scroll position without causing re-renders 
    const currentScrollRef = useRef<number>(0);
  // #2 Effect to store scroll position when dropdown is opened 
    useEffect(() => {
      if (characterDropDownOpen || artifactSetDropDownOpen) {
        // Save the scroll position of the results section when the dropdown opens
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
          currentScrollRef.current = resultsSection.scrollTop;
        }
      }
    }, [characterDropDownOpen, artifactSetDropDownOpen]);
  // #3 Effect to detect changes and scroll when content is rendered 
    useEffect(() => {
      const resultsSection = document.getElementById('results');
      if (characterDropDownOpen) {
        if (resultsSection) {
          // Initialize a MutationObserver to detect changes in the #results content
          const observer = new MutationObserver(() => {
            // Once content is updated, scroll to the right position
            if (filteredCharacterData.length > 1) {
              resultsSection.scrollTo({
                top: currentScrollRef.current,
                behavior: 'auto',
              });
            } else if (filteredCharacterData.length === 1) {
              resultsSection.scrollTo({
                top: 0,
                behavior: 'auto',
              });
            }
            // Disconnect observer once the scroll has happened
            observer.disconnect();
          });

          // Start observing the results section for changes
          observer.observe(resultsSection, {
            childList: true, // Observe child elements being added or removed
            subtree: true, // Observe all descendants
          });
        }
      }
      else if (artifactSetDropDownOpen) {
        if (resultsSection) {
          // Initialize a MutationObserver to detect changes in the #results content
          const observer = new MutationObserver(() => {
            // Once content is updated, scroll to the right position
            if (filteredArtifacts.length > 1) {
              resultsSection.scrollTo({
                top: currentScrollRef.current,
                behavior: 'auto',
              });
            } else if (filteredArtifacts.length === 1) {
              resultsSection.scrollTo({
                top: 0,
                behavior: 'auto',
              });
            }
            // Disconnect observer once the scroll has happened
            observer.disconnect();
          });

          // Start observing the results section for changes
          observer.observe(resultsSection, {
            childList: true, // Observe child elements being added or removed
            subtree: true, // Observe all descendants
          });
        }
      }
    }, [characterDropDownOpen, artifactSetDropDownOpen, filteredCharacterData, filteredArtifacts]);


  // SEARCH: Focus input when menu open
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Refs 
    const searchRef = useRef<HTMLInputElement>(null);
    const characterRef = useRef<HTMLInputElement>(null);
    const artifactRef = useRef<HTMLInputElement>(null);
  // #2 Set focus based on ref 
    useEffect(() => {
      if (searchDropDownOpen && searchRef.current) {
        searchRef.current.focus();
      }
      if (characterDropDownOpen && characterRef.current) {
        characterRef.current.focus();
      }
      if (artifactSetDropDownOpen && artifactRef.current) {
        artifactRef.current.focus();
      }
    }, [searchDropDownOpen, characterDropDownOpen, artifactSetDropDownOpen]);



  return (
    <section id="filter" className={isMenuOpen ? 'open' : 'closed'}>

      {/* Filter tabs if on mobile */}
      {isMobile &&
      <FilterTabs 
        handleTabChange={handleTabChange}
        currentFilterTab={currentFilterTab}
        selectedFilters={selectedFilters}
        isMobile={isMobile}
        savedFilters={savedFilters}
        isMenuOpen={isMenuOpen}
      />}

      <div id="filter-header" className={isMenuOpen ? 'open' : 'closed'}>
        <Logo 
          resetFilters={resetFilters}
        />
        {/* Search all */}
        <div className="filter-option" ref={searchDropDownRef}>

            {/* Dropdown Toggle */}
            {!searchDropDownOpen ? (
            <>
            <div className="dropdown-wrapper">
              <div 
                onClick={() => handleDropDown('Search')} 
                className='dropdown'
              >
                <img
                  className="filter-icon"  
                  src="./images/icons/Icon Survey.webp"
                  alt="search"
                />
                <p>
                  Search...
                </p>
              </div>

            </div>
            </>
            ) : (
              <>
              <div className="search-bar">
                <input
                  className="search-input"
                  ref={searchRef}
                  value={searchQuery}
                  onChange={handleSearchQuery}
                  placeholder="Type to search"
                />
              </div>
              {searchQuery.length > 2 &&
              <>
              <ul className="dropdown-menu">
                {filteredSearchData.map((result: any) => (
                  <li key={result.name} onClick={() => {
                    if(result.type === 'Character') {
                      handleCharacterChange(result.name)
                    }
                    if(result.type === 'Artifact') {
                      handleArtifactSetChange(result.name)
                    }
                    setSearchDropDownOpen(!setSearchDropDownOpen)
                    setSearchQuery('')
                  }}>
                    <img
                      className="artifact"
                      src={
                        result.type === 'Character' ? `./images/characters/portraits/${result.name}.webp` : 
                        result.type === 'Artifact' ? `./images/artifacts/flowers/${result.name} Flower.webp` :
                        '' }
                      alt={selectedArtifactSet[0]}
                    />
                    <p>{result.name}</p>
                  </li>
                ))}
              </ul>
              </>
              }
              </>
            )
          }
        </div>
      </div>


      {/* 1. Character */}
      <div id="character-section" className="filter-option" ref={characterDropDownRef}>
        <h3>Character</h3>

        {/* Dropdown Toggle */}
        {!characterDropDownOpen ? (
          <>
          {/* Dropdown Wrapper */}
          {/* Contents: Dropdown Button and conditional X button */}
          <div className="dropdown-wrapper">

            {/* Dropdown Button */}
            <div 
              onClick={() => handleDropDown('character')} 
              className={selectedCharacter.length > 0 ? 'dropdown highlighted' : 'dropdown'}>

              {/* Image */}
              {/* If a character is selected, show that. Else show generic icon */}
              <img 
                className="filter-icon side" 
                src={
                  selectedCharacter.some(character => character.includes('Traveler')) && selectedCharacter.length > 0 ?
                  `./images/characters/portraits/Traveler.webp` : 
                  !selectedCharacter.some(character => character.includes('Traveler')) && selectedCharacter.length > 0 ? 
                  `./images/characters/portraits/${selectedCharacter}.webp` : 
                  selectedCharacter.length === 0 ? `./images/icons/Icon Character.webp` : ''
                }
                alt={selectedCharacter[0]}
              />

              <p>
                {/* Text */}
                {/* If a character is selected, show that. Else show placeholder */}
                {selectedCharacter.length > 0 ? selectedCharacter[0] : "Select character"}
              </p>
            </div>{/* End Dropdown Button */}

            {/* Clear Input Button */}
            {selectedCharacter.length > 0 &&
            <button
              className="clear-input"
              onClick={() => handleCharacterChange('clear selection')}>
              &#10006;
            </button>}

          </div>{/* End Dropdown Wrapper */}
          </>
        ) : (
          <>
          {/* Dropdown Open */}
          {/* Toggle Element of Displayed Characters */}
          <div className="element-toggle">
            {elements.map((element: string) => (
              <button 
                key={element}
                onClick={() => handleCharacterElementSelection(element)}
                className={characterElementSelection === element ? 'selected' : 'unselected'}
              >
                <img src={`./images/elements/${element}.webp`} />
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              className="search-input"
              ref={characterRef}
              value={characterQuery}
              onChange={handleCharacterQuery}
              placeholder={selectedCharacter.length > 0 ? selectedCharacter[0] : "Type to search"}
            />
          </div>

          {/* List of characters, filtered by Search Bar */}

          <ul className="dropdown-menu">
            {filteredCharacterDataByElement.map((character: Character) => {
              if(
                characterElementSelection !== 'Cryo' && character.name === 'Cryo Traveler' ||
                characterElementSelection !== 'Pyro' && character.name === 'Pyro Traveler' ||
                characterElementSelection !== 'Dendro' && character.name === 'Dendro Traveler' ||
                characterElementSelection !== 'Hydro' && character.name === 'Hydro Traveler' ||
                characterElementSelection !== 'Electro' && character.name === 'Electro Traveler' ||
                characterElementSelection !== 'Geo' && character.name === 'Geo Traveler' ||
                characterElementSelection !== 'Anemo' && character.name === 'Anemo Traveler'
                ) { return null;
              }
              return (
                <li 
                  key={character.name} 
                  onClick={() => {
                    handleCharacterChange(character.name)
                    setCharacterDropDownOpen(!characterDropDownOpen)
                    setCharacterQuery('')
                  }}>

                  {/* Image */}
                  <img
                    className="character"
                    src={
                      `./images/characters/portraits/${character.name}.webp`
                    }
                    alt={character.name}
                  />

                  {/* Text */}
                  <p>{character.name}</p>
                </li>
              );
            })}
          </ul>


          </>
        )}
      </div>

      {/* 1. Set */}
      <div className="filter-option" ref={artifactDropDownRef}>
        <h3>Artifact Set</h3>

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
                  selectedArtifactSet.length === 0 ? `./images/icons/Icon Artifact.webp` : ''
                }
                alt={selectedArtifactSet[0]}
              />
              <p>
                {selectedArtifactSet.length > 0 ? selectedArtifactSet : "Select set"}
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
            <ul className="dropdown-menu">
              {filteredArtifacts.map((set: ArtifactSet) => (
                <li key={set.name} onClick={() => {
                  handleArtifactSetChange(set.name)
                  setArtifactSetDropDownOpen(!artifactSetDropDownOpen)
                  setArtifactQuery('')
                }}>
                  <img
                    className="artifact"
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

      {/* 2. Mainstats */}
      <div className="filter-artifact-mainstats">
        <h3>Main Stats</h3>
        {/* 1. Sands */}
          <div className="filter-option" ref={sandsDropDownRef}>
            {/*<h3>Select sands</h3>*/}

            {/* Dropdown Wrapper */}
            {/* Contents: Button and conditional X button */}
            <div className="dropdown-wrapper">

              {/* Dropdown Button */}
              <div 
                className={
                  selectedSands.length > 0 ? 'dropdown highlighted' : 
                  sandsDropDownOpen ? 'dropdown open' :
                  'dropdown'
                }
                onClick={() => handleDropDown('Sands')}>

                {/* Icon */}
                {/* If a set is selected, show that. Else show generic icon */}
                <img 
                  className="filter-icon"
                  src={
                    selectedArtifactSet.length > 0 ? `./images/artifacts/sands/${selectedArtifactSet} Sands.webp` : 
                    selectedArtifactSet.length === 0 ? `./images/icons/Icon Sands.webp` : ''
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
                    <img 
                      src={
                        stat === 'HP%' ? `./images/icons/Icon HP.webp` :
                        stat === 'DEF%' ? `./images/icons/Icon DEF.webp` :
                        stat === 'ATK%' ? `./images/icons/Icon ATK.webp` :
                        `./images/icons/Icon ${stat}.webp`
                      }
                    />
                    <p>{stat}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        {/* 2. Goblet */}
          <div className="filter-option" ref={gobletDropDownRef}>
            {/*<h3>Select goblet</h3>*/}

            {/* Dropdown Wrapper */}
            {/* Contents: Button and conditional X button */}
            <div className="dropdown-wrapper">

              {/* Dropdown Button */}
              <div 
                className={
                  selectedGoblet.length > 0 ? 'dropdown highlighted' : 
                  gobletDropDownOpen ? 'dropdown open' :
                  'dropdown'
                }
                onClick={() => handleDropDown('Goblet')}>

                {/* Icon */}
                {/* If a set is selected, show that. Else show generic icon */}
                <img 
                  className="filter-icon"
                  src={
                    selectedArtifactSet.length > 0 ? `./images/artifacts/goblets/${selectedArtifactSet} Goblet.webp` : 
                    selectedArtifactSet.length === 0 ? `./images/icons/Icon Goblet.webp` : ''
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
                    <img
                      className={
                        stat === 'Hydro DMG Bonus' ||
                        stat === 'Pyro DMG Bonus' ||
                        stat === 'Cryo DMG Bonus' ||
                        stat === 'Dendro DMG Bonus' ||
                        stat === 'Electro DMG Bonus' ||
                        stat === 'Anemo DMG Bonus' ||
                        stat === 'Geo DMG Bonus' ? 'element' :
                        ''
                      }
                      src={
                        stat === 'HP%' ? `./images/icons/Icon HP.webp` :
                        stat === 'DEF%' ? `./images/icons/Icon DEF.webp` :
                        stat === 'ATK%' ? `./images/icons/Icon ATK.webp` :
                        stat === 'Hydro DMG Bonus' ? `./images/elements/Hydro White.webp` :
                        stat === 'Pyro DMG Bonus' ? `./images/elements/Pyro White.webp` :
                        stat === 'Cryo DMG Bonus' ? `./images/elements/Cryo White.webp` :
                        stat === 'Dendro DMG Bonus' ? `./images/elements/Dendro White.webp` :
                        stat === 'Electro DMG Bonus' ? `./images/elements/Electro White.webp` :
                        stat === 'Anemo DMG Bonus' ? `./images/elements/Anemo White.webp` :
                        stat === 'Geo DMG Bonus' ? `./images/elements/Geo White.webp` :
                        `./images/icons/Icon ${stat}.webp`
                      }
                    />
                    <p>{stat}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        {/* 3. Circlet */}
          <div className="filter-option" ref={circletDropDownRef}>
            {/*<h3>Select circlet</h3>*/}

            {/* Dropdown Wrapper */}
            {/* Contents: Button and conditional X button */}
            <div className="dropdown-wrapper">

              {/* Dropdown Button */}
              <div 
                className={
                  selectedCirclet.length > 0 ? 'dropdown highlighted' :
                  circletDropDownOpen ? 'dropdown open' :
                  'dropdown'
                }
                onClick={() => handleDropDown('Circlet')}>

                {/* Icon */}
                {/* If a set is selected, show that. Else show generic icon */}
                <img 
                  className="filter-icon"
                  src={
                    selectedArtifactSet.length > 0 ? `./images/artifacts/circlets/${selectedArtifactSet} Circlet.webp` : 
                    selectedArtifactSet.length === 0 ? `./images/icons/Icon Circlet.webp` : ''
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
                    <img
                      src={
                        stat === 'HP%' ? `./images/icons/Icon HP.webp` :
                        stat === 'DEF%' ? `./images/icons/Icon DEF.webp` :
                        stat === 'ATK%' ? `./images/icons/Icon ATK.webp` :
                        stat === 'CRIT DMG' ? `./images/icons/Icon CRIT Rate.webp` :
                        `./images/icons/Icon ${stat}.webp`
                      }
                    />
                    <p>{stat}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
      </div>{/* End Mainstats */}

      {/* 3. Substats */}
      <div className="filter-option">
        <h3>Substats</h3>
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
                stat === 'HP%' ? `./images/icons/Icon HP.webp` :
                stat === 'Flat HP' ? `./images/icons/Icon HP.webp` :
                stat === 'ATK%' ? `./images/icons/Icon ATK.webp` :
                stat === 'Flat ATK' ? `./images/icons/Icon ATK.webp` :
                stat === 'DEF%' ? `./images/icons/Icon DEF.webp` :
                stat === 'Flat DEF' ? `./images/icons/Icon DEF.webp` :
                stat === 'CRIT DMG' ? `./images/icons/Icon CRIT Rate.webp` :
                `./images/icons/Icon ${stat}.webp`} 
            />
            {stat}
          </label>
        ))}
      </div>


      {/* Other Filters */}
      {/* 2. Elements */}
          <div className="filter-option">
            <h3>Elements</h3>
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


      <div className={isMenuOpen ? 'toggle-filters open' : 'toggle-filters closed'}>
        <button className="reset-filters" onClick={() => resetFilters(null)}>Clear all filters</button>
        {isMobile && 
        <button className="apply-filters" onClick={() => toggleMenu(false)}>View {resultsNumber === 1 ? resultsNumber + ' result' : resultsNumber + ' results'}</button>}
      </div>
    </section>
  );
}