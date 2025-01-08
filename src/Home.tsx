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

// UI components
import Filter from './ui/Filter.tsx';
import Results from './ui/Results.tsx';
import MobileHeader from './ui/MobileHeader.tsx';

// Filter Functions
import { 
  updateFiltersSingleSelect,
  updateFiltersSubstats,
  updateFiltersElements,
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
    const [isMenuOpen, setIsMenuOpen] = useState(true);

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

  // 1. Update State based on URL
  useEffect(() => {
    if (id) {

      // Check for match with character name or alias
      const character = characterData.find(character => 
        character.name.replace(' ', '_').toLowerCase() === id.toLowerCase() || 
        character.alias?.toLowerCase() === id.toLowerCase() 
      );

      // If match, set character
      if(character) {
        handleCharacterChange(character.name);
      }

      // If no match, perform normal operations
      else {

        // In case of manually inputting id that is not the right length, return early
        if(id.length !== 11) {
          return;
        }

      // Convert URL
      // ——————————————————————————————————————————————————————————————————————————————————————————
        const idToInt = base58ToInt(id);
        const urlToString = idToInt.toString();
        console.log(id.length)


      // Slice URL into seperate numbers per filter
      // ——————————————————————————————————————————————————————————————————————————————————————————
        const sandsFromUrl = urlToString.slice(0,1); // one digit: 1
        const gobletFromUrl = urlToString.slice(1,3); // two digits: 2-3
        const circletFromUrl = urlToString.slice(3,4); // one digit: 4

        const substatsAndElementsFromUrl = urlToString.slice(4,10); // six digits: 5-8
          const substatsAndElementsToBinary = parseInt(substatsAndElementsFromUrl, 10).toString(2);
          const substatsAndElementsPadded = substatsAndElementsToBinary.padStart(17, '0');
          const substatsFromUrl = substatsAndElementsPadded.slice(0,10);
          const elementsFromUrl = substatsAndElementsPadded.slice(10,17);

        const characterIdFromUrl = urlToString.slice(10,13); // three digits: 12-14
        const artifactSetFromUrl = urlToString.slice(13,16); // three digits: 15-17
        //const weaponFromUrl = urlToString.slice(16,19); // three digits: 17-20



      // Define what the filters should be set to from URL info
      // —————————————————————————————————————————————————————————————————————————————————————————— 
      // #1 Substats 
        const substats = [];
        const substatsPadded = substatsFromUrl.padStart(10, '0');
        if(substatsFromUrl) {
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
        const character = characterData.find(character => character.id === parseInt(characterIdFromUrl));
      // #3 Artifact Set 
        const artifactSet = artifactSets.find(artifact => artifact.id === parseInt(artifactSetFromUrl));
      // #4 Artifact Main Stats 
        const sands = [];
        if(sandsFromUrl) {
          if(sandsFromUrl === '2') {
            sands.push('ATK%');
          }
          if(sandsFromUrl === '3') {
            sands.push('DEF%');
          }
          if(sandsFromUrl === '4') {
            sands.push('HP%', 'HP% (C1)');
          }
          if(sandsFromUrl === '5') {
            sands.push('Elemental Mastery', 'EM (Vape/Melt)', 'EM (Vaporize)', 'EM (Quicken)', 'EM (Aggravate)');
          }
          if(sandsFromUrl === '6') {
            sands.push('Energy Recharge', 'Energy Recharge (C2)');
          }
        }

        const goblet = [];
        if(gobletFromUrl) {
          if(gobletFromUrl === '01') {
            goblet.push('ATK%');
          }
          if(gobletFromUrl === '02') {
            goblet.push('DEF%');
          }
          if(gobletFromUrl === '03') {
            goblet.push('HP%', 'HP% (C1)');
          }
          if(gobletFromUrl === '04') {
            goblet.push('Elemental Mastery', 'EM (Vape/Melt)', 'EM (Vaporize)', 'EM (Quicken)', 'EM (Aggravate)');
          }
          if(gobletFromUrl === '05') {
            goblet.push('Physical DMG Bonus');
          }
          if(gobletFromUrl === '06') {
            goblet.push('Hydro DMG Bonus');
          }
          if(gobletFromUrl === '07') {
            goblet.push('Pyro DMG Bonus');
          }
          if(gobletFromUrl === '08') {
            goblet.push('Cryo DMG Bonus');
          }
          if(gobletFromUrl === '09') {
            goblet.push('Dendro DMG Bonus');
          }
          if(gobletFromUrl === '10') {
            goblet.push('Electro DMG Bonus');
          }
          if(gobletFromUrl === '11') {
            goblet.push('Anemo DMG Bonus');
          }
          if(gobletFromUrl === '12') {
            goblet.push('Geo DMG Bonus');
          }
        }

        const circlet = [];
        if(circletFromUrl) {
          if(circletFromUrl === '1') {
            circlet.push('ATK%');
          }
          if(circletFromUrl === '2') {
            circlet.push('DEF%');
          }
          if(circletFromUrl === '3') {
            circlet.push('HP%', 'HP% (C1)');
          }
          if(circletFromUrl === '4') {
            circlet.push('CRIT Rate', 'CRIT Rate/DMG', 'CRIT Rate (Favonius)');
          }
          if(circletFromUrl === '5') {
            circlet.push('CRIT DMG', 'CRIT Rate/DMG');
          }
          if(circletFromUrl === '6') {
            circlet.push('Elemental Mastery', 'EM (Vape/Melt)', 'EM (Vaporize)', 'EM (Quicken)', 'EM (Aggravate)');
          }
          if(circletFromUrl === '7') {
            circlet.push('Healing Bonus');
          }
        }
      // #5 Elements 
        const elements = [];
        const elementsPadded = elementsFromUrl.padStart(7, '0');
        if(elementsFromUrl) {
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
    let sandsNumber = '1';
    let substatsNumber = '0000000000';
    let elementNumber = '0000000';
    let characterNumber = '000';
    let artifactSetNumber = '000';
    let gobletNumber = '00';
    let circletNumber = '0';
    let weaponNumber = '000';

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
      characterNumber = String(character?.id).padStart(3, '0');
    }
    if (selectedArtifactSet.length > 0) {
      const artifact = artifactSets.find(artifact => artifact.name === selectedArtifactSet[0]);
      artifactSetNumber = String(artifact?.id).padStart(3, '0');
    }
    if (selectedSands.length > 0) {
      if(selectedSands.includes('ATK%')) {
        sandsNumber = '2';
      }
      if(selectedSands.includes('DEF%')) {
        sandsNumber = '3';
      }
      if(selectedSands.includes('HP%')) {
        sandsNumber = '4';
      }
      if(selectedSands.includes('Elemental Mastery')) {
        sandsNumber = '5';
      }
      if(selectedSands.includes('Energy Recharge')) {
        sandsNumber = '6';
      }
    }
    if (selectedGoblet.length > 0) {
      if(selectedGoblet.includes('ATK%')) {
        gobletNumber = '01';
      }
      if(selectedGoblet.includes('DEF%')) {
        gobletNumber = '02';
      }
      if(selectedGoblet.includes('HP%')) {
        gobletNumber = '03';
      }
      if(selectedGoblet.includes('Elemental Mastery')) {
        gobletNumber = '04';
      }
      if(selectedGoblet.includes('Physical DMG Bonus')) {
        gobletNumber = '05';
      }
      if(selectedGoblet.includes('Hydro DMG Bonus')) {
        gobletNumber = '06';
      }
      if(selectedGoblet.includes('Pyro DMG Bonus')) {
        gobletNumber = '07';
      }
      if(selectedGoblet.includes('Cryo DMG Bonus')) {
        gobletNumber = '08';
      }
      if(selectedGoblet.includes('Dendro DMG Bonus')) {
        gobletNumber = '09';
      }
      if(selectedGoblet.includes('Electro DMG Bonus')) {
        gobletNumber = '10';
      }
      if(selectedGoblet.includes('Anemo DMG Bonus')) {
        gobletNumber = '11';
      }
      if(selectedGoblet.includes('Geo DMG Bonus')) {
        gobletNumber = '12';
      }
    }
    if (selectedCirclet.length > 0) {
      if(selectedCirclet.includes('ATK%')) {
        circletNumber = '1';
      }
      if(selectedCirclet.includes('DEF%')) {
        circletNumber = '2';
      }
      if(selectedCirclet.includes('HP%')) {
        circletNumber = '3';
      }
      if(selectedCirclet.includes('CRIT Rate')) {
        circletNumber = '4';
      }
      if(selectedCirclet.includes('CRIT DMG')) {
        circletNumber = '5';
      }
      if(selectedCirclet.includes('Elemental Mastery')) {
        circletNumber = '6';
      }
      if(selectedCirclet.includes('Healing Bonus')) {
        circletNumber = '7';
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
      elementNumber = pyro+hydro+anemo+electro+dendro+cryo+geo;
    }

    // Convert substats and elements from binary presentation to a single base10 integer
    const substatsAndElementsString = substatsNumber+elementNumber;
    const substatsAndElementsToBase10 = parseInt(substatsAndElementsString, 2);
    const substatsAndElementsNumber = substatsAndElementsToBase10.toString().padStart(6, '0');

    const url = 
      sandsNumber?.toString() +
      gobletNumber?.toString() +
      circletNumber?.toString() +
      substatsAndElementsNumber +
      characterNumber?.toString() + 
      artifactSetNumber?.toString() +
      weaponNumber?.toString();

    const urlBase58 = intToBase58(url);
    console.log(url.length)

    const isOnlyCharacterIsSelected = () => {
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
    const onlyCharacterIsSelected = isOnlyCharacterIsSelected();
    const selectedCharacterNoSpace = selectedCharacter[0]?.toString().replaceAll(' ','_')
    console.log(selectedCharacterNoSpace)

    if (url !== '1000000000000000000' && !onlyCharacterIsSelected) {
      navigate(`/is-this-artifact-good/${urlBase58}`, { replace: true });
    }
    else if (onlyCharacterIsSelected) {
      navigate(`/is-this-artifact-good/${selectedCharacterNoSpace}`, { replace: true });
    }
    else {
      navigate(`/is-this-artifact-good/`, { replace: true });
    }
  }, [selectedSubstats, selectedCharacter, selectedArtifactSet, selectedSands, selectedGoblet, selectedCirclet, selectedElements]);




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
          handleTabChange={handleTabChange}
          currentFilterTab={currentFilterTab}
          savedFilters={savedFilters}

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