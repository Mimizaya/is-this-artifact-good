import { useState, useEffect, useRef } from 'react';

// Stylesheet
import './style/App.css';

// CSV Parser and raw data
import Papa from 'papaparse';
import buildData from './data/builds-data.csv';

// UI components
import Filter from './ui/Filter.tsx';
import Results from './ui/Results.tsx';

// Filter Functions
import { 
  updateFiltersSingleSelect,
  updateFiltersMultiSelect,
} from './utility/functions'

// Type definitions
import { RawBuild, SavedFilters } from './types/types.ts';

export default function App() {

  // IMPORT DATA: Handle CSV data
    // 1. Data version 
      const VERSION = '1.4';
    // 2. State to store data
      const [rawData, setRawData] = useState<RawBuild[]>([]);
    // 3. Parse and set data to state and localstorage
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

  // FILTERS: What filters are set?
    // 1. States 
      const [selectedCharacter, setSelectedCharacter] = useState<string[]>([]);
      const [selectedArtifactSet, setSelectedArtifactSet] = useState<string[]>([]);
      const [selectedSands, setSelectedSands] = useState<string[]>([]);
      const [selectedGoblet, setSelectedGoblet] = useState<string[]>([]);
      const [selectedCirclet, setSelectedCirclet] = useState<string[]>([]);
      const [selectedSubstats, setSelectedSubstats] = useState<string[]>([]);
      const [selectedElements, setSelectedElements] = useState<string[]>([]);
    // 2. Combined filter states into object 
      const selectedFilters = {
        selectedCharacter,
        selectedArtifactSet,
        selectedSands,
        selectedGoblet,
        selectedCirclet,
        selectedSubstats,
        selectedElements
      };
    // 3. Handle changes to filter states 
      const handleCharacterChange = (name: string) => {
        updateFiltersSingleSelect(name, setSelectedCharacter);
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
        updateFiltersMultiSelect(stat, setSelectedSubstats);
      }

      const handleElementsChange = (element: string) => {
        updateFiltersMultiSelect(element, setSelectedElements);
      };
    // 4. Handle clearing of filters
      const resetFilters = (filter: string | null) => {
        if(filter === 'artifact') {
          setSelectedArtifactSet([]);
        }
        else if(filter === 'character') {
          setSelectedCharacter([]);
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
    // 5. Swipe detection for opening menu (Mobile) 
      // State to store open/closed
      const [isMenuOpen, setIsMenuOpen] = useState(true);

      // Toggle menu on button click
      /* const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
      };*/
    
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
    // 1. States for storing information 
      const [currentFilterTab, setCurrentFilterTab] = useState(1);
      const [savedFilters, setSavedFilters] = useState<SavedFilters>({});
    // 2. Change filters: Save information 
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
    // 3. Change tab: Load information 
      const [viewPinned, setViewPinned] = useState(false);
      const handleTabChange = (tabId: number, artifact: string | null) => {
        setCurrentFilterTab(tabId);

        if(artifact) {
          setSelectedArtifactSet([artifact]);
        }
        if(tabId === 0) {
          setViewPinned(true)
        }
        else if (tabId !== 0) {
          setViewPinned(false)
        }
        
        if(!artifact) {
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
    // 1. State 
      const [isMobile, setIsMobile] = useState<boolean>(false);
    // 2. Measure width and set state 
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


  return (
    <>
      <main      
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>

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