import { useState, useEffect, useRef } from 'react';

// Stylesheet
import './style/App.css';

// CSV Parser and raw data
import Papa from 'papaparse';
import buildData from './data/builds-data.csv';

// Router
import { useParams, useNavigate } from 'react-router-dom';

// Datasets
import { characterData } from './data/character-data.ts';
import { artifactSets } from './data/artifact-data.ts';
import { elements } from './data/elements.ts';

// UI components
import Filter from './ui/Filter.tsx';
import Results from './ui/Results.tsx';
import MobileHeader from './ui/MobileHeader.tsx';

// Filter Functions
import { 
  updateFiltersSingleSelect,
  updateFiltersSubstats,
  updateFiltersElements,
  createUrlNumber,
  decodeUrlNumber,
} from './utility/functions';

// Type definitions
import { RawBuild, SavedFilters } from './types/types.ts';

export default function Home() {

  // IMPORT DATA: Handle CSV data
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Data version 
    const VERSION = '1.0.035';
  // #2 State to store data 
    const [rawData, setRawData] = useState<RawBuild[]>([]);
  // #3 Parse and set data to state and localstorage 
    useEffect(() => {
      // Check if localstorage data exists
      const storedData = localStorage.getItem('csvData');
      const storedVersion = localStorage.getItem('csvDataVersion');

      // If local data exists, parse from storage
      if (storedData && storedVersion === VERSION) {
        setRawData(JSON.parse(storedData));
      } 
      // Else fetch CSV, parse and store
      else {
        fetch(buildData)
          .then((response) => response.text())
          .then((text) => {
            Papa.parse(text, {
              header: true,
              skipEmptyLines: true,
              complete: (results: any) => {
                // Set parsed data to state
                setRawData(results.data);
                // Save parsed data to local storage
                localStorage.setItem('csvData', JSON.stringify(results.data));
                localStorage.setItem('csvDataVersion', VERSION);
              },
              error: (error: any) => {
                console.error('Error parsing CSV:', error);
              },
            });
          })
          .catch((error) => {
            console.error('Error fetching CSV:', error);
          });
      }
    }, []);


  // FILTERS: Which filters are set?
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 States 
    const [selectedCharacter, setSelectedCharacter] = useState<string[]>([]);
    const [selectedArtifactSet, setSelectedArtifactSet] = useState<string[]>([]);
    const [selectedSands, setSelectedSands] = useState<string[]>([]);
    const [selectedGoblet, setSelectedGoblet] = useState<string[]>([]);
    const [selectedCirclet, setSelectedCirclet] = useState<string[]>([]);
    const [selectedSubstats, setSelectedSubstats] = useState<string[]>([]);
    const [selectedElements, setSelectedElements] = useState<string[]>([]);
  // #2 Combined filter states into single object 
    const selectedFilters = {
      selectedCharacter,
      selectedArtifactSet,
      selectedSands,
      selectedGoblet,
      selectedCirclet,
      selectedSubstats,
      selectedElements
    };
  // #3 Determine number of selected substats 
    const substatsToRemove = ['CRIT Rate/DMG', 'CRIT Rate (Favonius)', 'EM (Vaporize)', 'EM (Vape/Melt)', 'EM (Quicken)', 'EM (Melt)', 'EM (Vape)', 'EM (Aggravate)', 'Energy Recharge (C2)'];
    const numberOfSubstats = selectedSubstats.filter(substat => !substatsToRemove.includes(substat)).length;
  // #4 Handle changes to filter states 
    const handleCharacterChange = (name: string) => {
      updateFiltersSingleSelect(name, setSelectedCharacter);

      // If another character besides Traveler is selected, reset elements selection.
      // Don't reset if just clearing the name.
      if(!name.includes('Traveler') && name !== 'clear selection') {
        resetFilters('elements')
      }
    };

    const handleElementsChange = (element: string) => {
      updateFiltersElements(element, setSelectedElements);

      // If selecting an element, reset character unless it's the Traveler.
      if(!selectedCharacter.includes('Traveler')) {
        resetFilters('character')
      }
    };

    const handleArtifactSetChange = (set: string) => {
      updateFiltersSingleSelect(set, setSelectedArtifactSet);
    };

    const handleSandsChange = (stat: string) => {
      updateFiltersSingleSelect(stat, setSelectedSands);
    }

    const handleGobletChange = (stat: string) => {
      updateFiltersSingleSelect(stat, setSelectedGoblet);
    }

    const handleCircletChange = (stat: string) => {
      updateFiltersSingleSelect(stat, setSelectedCirclet);
    }

    const handleSubstatsChange = (stat: string) => {
      updateFiltersSubstats(stat, setSelectedSubstats, numberOfSubstats);
    }
  // #5 Handle clearing of filters 
    const resetFilters = (filter: string | null) => {
      if(filter === 'artifact') {
        setSelectedArtifactSet([]);
      }
      else if(filter === 'character') {
        setSelectedCharacter([]);
      }
      else if(filter === 'elements') {
        setSelectedElements([]);
      }
      else if(filter === 'view-character') {
        setSelectedArtifactSet([]);
        setSelectedSands([]);
        setSelectedGoblet([]);
        setSelectedCirclet([]);
        setSelectedSubstats([]);
        setSelectedElements([]);
      }
      else if(filter === 'view-artifact') {
        setSelectedCharacter([]);
        setSelectedSands([]);
        setSelectedGoblet([]);
        setSelectedCirclet([]);
        setSelectedSubstats([]);
        setSelectedElements([]);
      }
      else if(filter === 'view-elements') {
        setSelectedArtifactSet([]);
        setSelectedCharacter([]);
        setSelectedSands([]);
        setSelectedGoblet([]);
        setSelectedCirclet([]);
        setSelectedSubstats([]);
      }
      else {
        setSelectedArtifactSet([]);
        setSelectedSands([]);
        setSelectedGoblet([]);
        setSelectedCirclet([]);
        setSelectedSubstats([]);
        setSelectedCharacter([]);
        setSelectedElements([]);
      }
    }
  // #6 Handle open menu (Mobile) 
    // State to store open/closed
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle menu on button click
    const toggleMenu = () => {
      setIsMenuOpen(prev => !prev);
    };
  
    // Refs for storing touch positions
    const touchStartX = useRef(0); // Store the start position of the touch
    const touchEndX = useRef(0);   // Store the end position of the touch

    // Handle the touch start event
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      touchStartX.current = e.touches[0].clientX;
      touchEndX.current = e.touches[0].clientX;
    };

    // Handle the touch move event
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
      touchEndX.current = e.touches[0].clientX;
    };

    // Handle the touch end event
    const handleTouchEnd = () => {
      // Calculate the horizontal distance
      const diffX = touchStartX.current - touchEndX.current;
      const swipeThreshold = 75;

      // Swipe left
      if (diffX > swipeThreshold) {  
        setIsMenuOpen(false);
      } 
      // Swipe right
      else if (diffX < -swipeThreshold) { 
        setIsMenuOpen(true);
      }
    };


  // TABS: Store seperate filter states per tab
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 States for storing information 
    const [currentFilterTab, setCurrentFilterTab] = useState(1);
    const [savedFilters, setSavedFilters] = useState<SavedFilters>({});
  // #2 Change filters: Save information 
    useEffect(() => {
      // Save the current filter settings in the `savedFilters` object for the active tab
      setSavedFilters((prev) => {
        return {
          ...prev,
          [currentFilterTab]: selectedFilters
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentFilterTab,
        selectedCharacter,
        selectedArtifactSet,
        selectedSands,
        selectedGoblet,
        selectedCirclet,
        selectedSubstats,
        selectedElements
      ]);
  // #3 Change tab: Load information 
    const [viewPinned, setViewPinned] = useState(false);
    const handleTabChange = (tabId: number, filter: string | null, value: string | null) => {
      setCurrentFilterTab(tabId);
      if(filter) {
        if(filter === 'artifact'){
          if(value) {
            setSelectedArtifactSet([value]);
          }
        }
      }
      if(tabId === 0) {
        setViewPinned(true)
      }
      else if (tabId !== 0) {
        setViewPinned(false)
      }
      
      if(!filter) {
        // Load filters from the saved state of the current tab
        const filtersForTab = savedFilters[tabId] || {}; // Default to empty if no saved filters for the tab
        setSelectedCharacter(filtersForTab.selectedCharacter || []);
        setSelectedArtifactSet(filtersForTab.selectedArtifactSet || []);
        setSelectedSands(filtersForTab.selectedSands || []);
        setSelectedGoblet(filtersForTab.selectedGoblet || []);
        setSelectedCirclet(filtersForTab.selectedCirclet || []);
        setSelectedSubstats(filtersForTab.selectedSubstats || []);
        setSelectedElements(filtersForTab.selectedElements || []);
      }

    };
  

  // MOBILE: Check width and set state 
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 State 
    const [isMobile, setIsMobile] = useState<boolean>(false);
  // #2 Measure width and set state 
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 600); // Adjust threshold as needed
      };

      // Set initial state
      handleResize();

      // Add event listener for resizing
      window.addEventListener('resize', handleResize);

      // Cleanup the event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);



  // URL: Handle updates to URL based on filters, or set filters based on URL
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // Define BASE58 Alphanumericals
    const BASE58_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  // Declare BASE58_MAP with the correct type
    const BASE58_MAP: { [key: string]: bigint } = {};  // Use `bigint` (lowercase)
  // Initialize BASE58_MAP with `bigint` values (using BigInt literals)
    for (let i = 0; i < BASE58_ALPHABET.length; i++) {
        BASE58_MAP[BASE58_ALPHABET[i]] = BigInt(i);  // Store as `bigint` using BigInt constructor
    }
  // Function to convert an integer to Base58
    function intToBase58(num: string | number): string {
      let bigNum = BigInt(num); // Convert num to `bigint` using BigInt constructor if necessary

      let base58 = '';
      while (bigNum > 0n) {  // Use `n` suffix for `bigint` comparison
        const remainder = bigNum % 58n;  // Ensure you're using `bigint` literals
        base58 = BASE58_ALPHABET[Number(remainder)] + base58; // Convert to number for indexing
        bigNum = bigNum / 58n;  // Division with `bigint` literals
      }

      return base58;
    }
  // Function to convert Base58 back to an integer (using `bigint`)
    function base58ToInt(base58: string): bigint {
      let num = 0n;  // Start with `bigint` zero (`0n`)

      for (let i = 0; i < base58.length; i++) {
        const digitValue = BASE58_MAP[base58[i]];  // Get `bigint` from map
        num = num * 58n + digitValue;  // Ensure both operands are `bigint`
      }

      return num;
    }


  const { id } = useParams();
  const navigate = useNavigate();
  const urlPrefix = 'view=';
  

  // 1. Update State based on URL
  useEffect(() => {
    if (id) {

      // Check for match with character name or alias 
        const character = characterData.find(character => 
          character.name.replace(/ /g, '_').toLowerCase() === id.toLowerCase() || 
          character.alias?.toLowerCase() === id.toLowerCase() 
        );
        // If match, set character
        if(character) {
          handleCharacterChange(character.name);
          return;
        }
      // Check for match with artifact name or alias 
        const artifact = artifactSets.find(artifact => 
          artifact.name.replace(/ /g, '_').toLowerCase() === id.toLowerCase() || 
          artifact.alias?.toLowerCase() === id.toLowerCase() 
        );
        // If match, set character
        if(artifact) {
          handleArtifactSetChange(artifact.name);
          return;
        }
      // Check for match with element 
        const element = elements.find(element => 
          element === id
        );
        // If match, set element
        if(element) {
          setSelectedElements([element]);
          return;
        }

      // No specific matches? Move to decrypt
      else {

      // Convert URL
      // ——————————————————————————————————————————————————————————————————————————————————————————
        const getURL = id.replace(urlPrefix, '');
        const idToInt = base58ToInt(getURL);
        const urlToString = idToInt.toString(); // remove bigint
        const filtersFromURL = decodeUrlNumber(Number(urlToString));

      // Define what the filters should be set to from URL info
      // —————————————————————————————————————————————————————————————————————————————————————————— 
      // #1 Substats 
        const substatsToBinary = filtersFromURL?.substats?.toString(2);
        const substatsPadded = substatsToBinary?.padStart(10, '0')
        const substats = [];
        if(filtersFromURL?.substats) {
          if(substatsPadded.slice(0,1) === '1') {
            substats.push('ATK%');
          }
          if(substatsPadded.slice(1,2) === '1') {
            substats.push('DEF%');
          }
          if(substatsPadded.slice(2,3) === '1') {
            substats.push('HP%');
          }
          if(substatsPadded.slice(3,4) === '1') {
            substats.push('CRIT Rate', 'CRIT Rate/DMG', 'CRIT Rate (Favonius)');
          }
          if(substatsPadded.slice(4,5) === '1') {
            substats.push('CRIT DMG', 'CRIT Rate/DMG');
          }
          if(substatsPadded.slice(5,6) === '1') {
            substats.push('Elemental Mastery', 'EM (Vape/Melt)', 'EM (Vaporize)', 'EM (Quicken)', 'EM (Melt)', 'EM (Aggravate)');
          }
          if(substatsPadded.slice(6,7) === '1') {
            substats.push('Energy Recharge', 'Energy Recharge (C2)');
          }
          if(substatsPadded.slice(7,8) === '1') {
            substats.push('Flat ATK');
          }
          if(substatsPadded.slice(8,9) === '1') {
            substats.push('Flat DEF');
          }
          if(substatsPadded.slice(9,10) === '1') {
            substats.push('Flat HP');
          }
        }
      // #2 Character 
        const character = characterData.find(character => Number(character.id) === Number(filtersFromURL.character - 1));
      // #3 Artifact Set 
        const artifactSet = artifactSets.find(artifact => Number(artifact.id) === Number(filtersFromURL.artifact));
      // #4 Artifact Main Stats 
        const sands = [];
          if(filtersFromURL.sands === 1) {
            sands.push('ATK%');
          }
          if(filtersFromURL.sands === 2) {
            sands.push('DEF%');
          }
          if(filtersFromURL.sands === 3) {
            sands.push('HP%', 'HP% (C1)');
          }
          if(filtersFromURL.sands === 4) {
            sands.push('Elemental Mastery', 'EM (Vape/Melt)', 'EM (Vaporize)', 'EM (Quicken)', 'EM (Aggravate)');
          }
          if(filtersFromURL.sands === 5) {
            sands.push('Energy Recharge', 'Energy Recharge (C2)');
          }
        const goblet = [];
          if(filtersFromURL.goblet === 1) {
            goblet.push('ATK%');
          }
          if(filtersFromURL.goblet === 2) {
            goblet.push('DEF%');
          }
          if(filtersFromURL.goblet === 3) {
            goblet.push('HP%', 'HP% (C1)');
          }
          if(filtersFromURL.goblet === 4) {
            goblet.push('Elemental Mastery', 'EM (Vape/Melt)', 'EM (Vaporize)', 'EM (Quicken)', 'EM (Aggravate)');
          }
          if(filtersFromURL.goblet === 5) {
            goblet.push('Physical DMG Bonus');
          }
          if(filtersFromURL.goblet === 6) {
            goblet.push('Hydro DMG Bonus');
          }
          if(filtersFromURL.goblet === 7) {
            goblet.push('Pyro DMG Bonus');
          }
          if(filtersFromURL.goblet === 8) {
            goblet.push('Cryo DMG Bonus');
          }
          if(filtersFromURL.goblet === 9) {
            goblet.push('Dendro DMG Bonus');
          }
          if(filtersFromURL.goblet === 10) {
            goblet.push('Electro DMG Bonus');
          }
          if(filtersFromURL.goblet === 11) {
            goblet.push('Anemo DMG Bonus');
          }
          if(filtersFromURL.goblet === 12) {
            goblet.push('Geo DMG Bonus');
          }
        const circlet = [];
          if(filtersFromURL.circlet === 1) {
            circlet.push('ATK%');
          }
          if(filtersFromURL.circlet === 2) {
            circlet.push('DEF%');
          }
          if(filtersFromURL.circlet === 3) {
            circlet.push('HP%', 'HP% (C1)');
          }
          if(filtersFromURL.circlet === 4) {
            circlet.push('CRIT Rate', 'CRIT Rate/DMG', 'CRIT Rate (Favonius)');
          }
          if(filtersFromURL.circlet === 5) {
            circlet.push('CRIT DMG', 'CRIT Rate/DMG');
          }
          if(filtersFromURL.circlet === 6) {
            circlet.push('Elemental Mastery', 'EM (Vape/Melt)', 'EM (Vaporize)', 'EM (Quicken)', 'EM (Aggravate)');
          }
          if(filtersFromURL.circlet === 7) {
            circlet.push('Healing Bonus');
          }
      // #5 Elements 
        const elements = [];
        const elementsToBinary = filtersFromURL?.elements?.toString(2);
        const elementsPadded = elementsToBinary?.padStart(7, '0')
        if(filtersFromURL?.elements) {
          if(elementsPadded.slice(0,1) === '1') {
            elements.push('Pyro');
          }
          if(elementsPadded.slice(1,2) === '1') {
            elements.push('Hydro');
          }
          if(elementsPadded.slice(2,3) === '1') {
            elements.push('Anemo');
          }
          if(elementsPadded.slice(3,4) === '1') {
            elements.push('Electro');
          }
          if(elementsPadded.slice(4,5) === '1') {
            elements.push('Dendro');
          }
          if(elementsPadded.slice(5,6) === '1') {
            elements.push('Cryo');
          }
          if(elementsPadded.slice(6,7) === '1') {
            elements.push('Geo');
          }
        }


      // Set all filter states
      // ——————————————————————————————————————————————————————————————————————————————————————————
        if(substats) {
          setSelectedSubstats(substats);
        }
        if(character) {
          handleCharacterChange(character.name);
        }
        if(artifactSet) {
          handleArtifactSetChange(artifactSet.name);
        }
        if(sands) {
          setSelectedSands(sands);
        }
        if(goblet) {
          setSelectedGoblet(goblet);
        }
        if(circlet) {
          setSelectedCirclet(circlet);
        }
        if(elements) {
          setSelectedElements(elements);
        }
      }
    }
  }, []);



  // 2. Update URL based on State
  useEffect(() => {

    // Define the default values
    let artifactSetNumber = 0;
    let sandsNumber = 0;
    let gobletNumber = 0;
    let circletNumber = 0;
    let characterNumber = 1; // Default value of 1 to pad end number
    let weaponNumber = 0;
    let weaponTypeNumber = 0;
    let substatsNumber = '0000000000';
    let elementsNumber = '0000000';

    // Change the numbers that make up the URL based on filters set
    if (selectedSubstats.length > 0) {
      let atk = '0';
      let def = '0';
      let hp = '0';
      let crit = '0';
      let cdmg = '0';
      let em = '0';
      let er = '0';
      let fatk = '0';
      let fdef = '0';
      let fhp = '0';

      if(selectedSubstats.includes('ATK%')) {
        atk = '1';
      }
      if(selectedSubstats.includes('DEF%')) {
        def = '1';
      }
      if(selectedSubstats.includes('HP%')) {
        hp = '1';
      }
      if(selectedSubstats.includes('CRIT Rate')) {
        crit = '1';
      }
      if(selectedSubstats.includes('CRIT DMG')) {
        cdmg = '1';
      }
      if(selectedSubstats.includes('Elemental Mastery')) {
        em = '1';
      }
      if(selectedSubstats.includes('Energy Recharge')) {
        er = '1';
      }
      if(selectedSubstats.includes('Flat ATK')) {
        fatk = '1';
      }
      if(selectedSubstats.includes('Flat DEF')) {
        fdef = '1';
      }
      if(selectedSubstats.includes('Flat HP')) {
        fhp = '1';
      }
      substatsNumber = atk+def+hp+crit+cdmg+em+er+fatk+fdef+fhp;
    }
    if (selectedCharacter.length > 0) {
      const character = characterData.find(character => character.name === selectedCharacter[0]);
      if(character) {
        characterNumber = Number(character.id + 1);  
      }
    }
    if (selectedArtifactSet.length > 0) {
      const artifact = artifactSets.find(artifact => artifact.name === selectedArtifactSet[0]);
      artifactSetNumber = Number(artifact?.id);
    }
    if (selectedSands.length > 0) {
      if(selectedSands.includes('ATK%')) {
        sandsNumber = 1;
      }
      if(selectedSands.includes('DEF%')) {
        sandsNumber = 2;
      }
      if(selectedSands.includes('HP%')) {
        sandsNumber = 3;
      }
      if(selectedSands.includes('Elemental Mastery')) {
        sandsNumber = 4;
      }
      if(selectedSands.includes('Energy Recharge')) {
        sandsNumber = 5;
      }
    }
    if (selectedGoblet.length > 0) {
      if(selectedGoblet.includes('ATK%')) {
        gobletNumber = 1;
      }
      if(selectedGoblet.includes('DEF%')) {
        gobletNumber = 2;
      }
      if(selectedGoblet.includes('HP%')) {
        gobletNumber = 3;
      }
      if(selectedGoblet.includes('Elemental Mastery')) {
        gobletNumber = 4;
      }
      if(selectedGoblet.includes('Physical DMG Bonus')) {
        gobletNumber = 5;
      }
      if(selectedGoblet.includes('Hydro DMG Bonus')) {
        gobletNumber = 6;
      }
      if(selectedGoblet.includes('Pyro DMG Bonus')) {
        gobletNumber = 7;
      }
      if(selectedGoblet.includes('Cryo DMG Bonus')) {
        gobletNumber = 8;
      }
      if(selectedGoblet.includes('Dendro DMG Bonus')) {
        gobletNumber = 9;
      }
      if(selectedGoblet.includes('Electro DMG Bonus')) {
        gobletNumber = 10;
      }
      if(selectedGoblet.includes('Anemo DMG Bonus')) {
        gobletNumber = 11;
      }
      if(selectedGoblet.includes('Geo DMG Bonus')) {
        gobletNumber = 12;
      }
    }
    if (selectedCirclet.length > 0) {
      if(selectedCirclet.includes('ATK%')) {
        circletNumber = 1;
      }
      if(selectedCirclet.includes('DEF%')) {
        circletNumber = 2;
      }
      if(selectedCirclet.includes('HP%')) {
        circletNumber = 3;
      }
      if(selectedCirclet.includes('CRIT Rate')) {
        circletNumber = 4;
      }
      if(selectedCirclet.includes('CRIT DMG')) {
        circletNumber = 5;
      }
      if(selectedCirclet.includes('Elemental Mastery')) {
        circletNumber = 6;
      }
      if(selectedCirclet.includes('Healing Bonus')) {
        circletNumber = 7;
      }
    }
    if (selectedElements.length > 0) {
      let pyro = '0';
      let hydro = '0';
      let anemo = '0';
      let electro = '0';
      let dendro = '0';
      let cryo = '0';
      let geo = '0';

      if(selectedElements.includes('Pyro')) {
        pyro = '1';
      }
      if(selectedElements.includes('Hydro')) {
        hydro = '1';
      }
      if(selectedElements.includes('Anemo')) {
        anemo = '1';
      }
      if(selectedElements.includes('Electro')) {
        electro = '1';
      }
      if(selectedElements.includes('Dendro')) {
        dendro = '1';
      }
      if(selectedElements.includes('Cryo')) {
        cryo = '1';
      }
      if(selectedElements.includes('Geo')) {
        geo = '1';
      }
      elementsNumber = pyro+hydro+anemo+electro+dendro+cryo+geo;
    }
    // ADD WEAPON
    // ADD WEAPON TYPE


    // Convert substats and elements groups to binary after changing defaults
    const substats = parseInt(substatsNumber,2);
    const elements = parseInt(elementsNumber,2);

    // Create the URL
    const urlBase10 = createUrlNumber(    
      weaponNumber, 
      sandsNumber, 
      gobletNumber, 
      circletNumber, 
      characterNumber,
      artifactSetNumber,
      weaponTypeNumber,
      substats,
      elements
    );
    const urlBase58 = intToBase58(urlBase10);

    // Check if named URLs should be used. 
    // Only character, Artifact set or element
    const isOnlyCharacterSelected = () => {
      if(
        selectedCharacter.length > 0 &&
        selectedSubstats.length === 0 &&
        selectedArtifactSet.length === 0 &&
        selectedSands.length === 0 &&
        selectedGoblet.length === 0 &&
        selectedCirclet.length === 0 &&
        selectedElements.length === 0
        ) {
        return true;
      }
      else {
        return false;
      }
    }
    const isOnlyArtifactSetSelected = () => {
      if(
        selectedArtifactSet.length > 0 &&
        selectedSubstats.length === 0 &&
        selectedCharacter.length === 0 &&
        selectedSands.length === 0 &&
        selectedGoblet.length === 0 &&
        selectedCirclet.length === 0 &&
        selectedElements.length === 0
        ) {
        return true;
      }
      else {
        return false;
      }
    }
    const isOnlyElementSelected = () => {
      if(
        selectedElements.length === 1 &&
        selectedSubstats.length === 0 &&
        selectedCharacter.length === 0 &&
        selectedSands.length === 0 &&
        selectedGoblet.length === 0 &&
        selectedCirclet.length === 0 &&
        selectedArtifactSet.length === 0
        ) {
        return true;
      }
      else {
        return false;
      }
    }


    // Check for specific single selections first
    if (isOnlyCharacterSelected()) {
      navigate(`/is-this-artifact-good/${selectedCharacter[0].replace(/ /g, '_')}`, { replace: true });
    }
    else if (isOnlyArtifactSetSelected()) {
      navigate(`/is-this-artifact-good/${selectedArtifactSet[0].replace(/ /g, '_')}`, { replace: true });
    }
    else if (isOnlyElementSelected()) {
      navigate(`/is-this-artifact-good/${selectedElements[0]}`, { replace: true });
    }

    // Any selection that is not one of the above
    else if (urlBase58 !== 'BMepza') {
      navigate(`/is-this-artifact-good/${urlPrefix}${urlBase58}`, { replace: true });
    }

    // If no selection
    else {
      navigate(`/is-this-artifact-good/`, { replace: true });
    }
  }, [selectedSubstats, selectedCharacter, selectedArtifactSet, selectedSands, selectedGoblet, selectedCirclet, selectedElements]);



  const [resultsNumber, setResultsNumber] = useState<number>(0);
  const updateResults = (numberOfResults: number) => {
    setResultsNumber(numberOfResults);
  }

  return (
    <>       
      <main      
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>

        {isMobile &&
        <MobileHeader 
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
        />}

        <Filter 
          isMobile={isMobile}
          resetFilters={resetFilters}
          selectedFilters={selectedFilters}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          handleTabChange={handleTabChange}
          currentFilterTab={currentFilterTab}
          savedFilters={savedFilters}
          resultsNumber={resultsNumber}

          // Change filter values
          handleCharacterChange={handleCharacterChange}
          handleArtifactSetChange={handleArtifactSetChange}
          handleSandsChange={handleSandsChange}
          handleGobletChange={handleGobletChange}
          handleCircletChange={handleCircletChange}
          handleSubstatsChange={handleSubstatsChange}
          handleElementsChange={handleElementsChange}
        />

        <Results 
          updateResults={updateResults}
          viewPinned={viewPinned}
          isMenuOpen={isMenuOpen}
          isMobile={isMobile}
          resetFilters={resetFilters}
          selectedFilters={selectedFilters}
          savedFilters={savedFilters}
          buildsDataRaw={rawData}
          handleTabChange={handleTabChange}
          currentFilterTab={currentFilterTab}
        />
      </main>
    </>
  )
}