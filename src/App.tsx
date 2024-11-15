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

  // Data version 
    const VERSION = '1.1';

  // Prepare data imported from CSV 
    const [rawData, setRawData] = useState<RawBuild[]>([]);
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

  // Filter selection states 
    const [selectedCharacter, setSelectedCharacter] = useState<string[]>([]);
    const [selectedArtifactSet, setSelectedArtifactSet] = useState<string[]>([]);
    const [selectedSands, setSelectedSands] = useState<string[]>([]);
    const [selectedGoblet, setSelectedGoblet] = useState<string[]>([]);
    const [selectedCirclet, setSelectedCirclet] = useState<string[]>([]);
    const [selectedSubstats, setSelectedSubstats] = useState<string[]>([]);
    const [selectedElements, setSelectedElements] = useState<string[]>([]);

    const selectedFilters = {
      selectedCharacter,
      selectedArtifactSet,
      selectedSands,
      selectedGoblet,
      selectedCirclet,
      selectedSubstats,
      selectedElements
    };
  
  // Filter Tabs 
    // 1. States for saving information 
      const [currentFilterTab, setCurrentFilterTab] = useState(1);
      const [savedFilters, setSavedFilters] = useState<SavedFilters>({});

    // 2. Save current filter tab when filters change 
      useEffect(() => {
        // Save the current filter settings in the `savedFilters` object for the active tab
        setSavedFilters((prev) => {
          return {
            ...prev,
            [currentFilterTab]: selectedFilters
          };
        });
      }, [
          selectedCharacter,
          selectedArtifactSet,
          selectedSands,
          selectedGoblet,
          selectedCirclet,
          selectedSubstats,
          selectedElements
        ]);

    // 3. Change tab function - Set the states with saved info 
      const handleTabChange = (tabId: number) => {
        setCurrentFilterTab(tabId);

        // Load filters from the saved state of the current tab
        const filtersForTab = savedFilters[tabId] || {}; // Default to empty if no saved filters for the tab
        setSelectedCharacter(filtersForTab.selectedCharacter || []);
        setSelectedArtifactSet(filtersForTab.selectedArtifactSet || []);
        setSelectedSands(filtersForTab.selectedSands || []);
        setSelectedGoblet(filtersForTab.selectedGoblet || []);
        setSelectedCirclet(filtersForTab.selectedCirclet || []);
        setSelectedSubstats(filtersForTab.selectedSubstats || []);
        setSelectedElements(filtersForTab.selectedElements || []);
      };
    
  // Handle filter selections 

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

  // Reset filters 
    const resetFilters = (filter: string | null) => {
      if(filter === 'artifact-set') {
        setSelectedArtifactSet([]);
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

  // Open/close filter options menu (swipe detection) 
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

  // Save filter configurations - WIP 

  // CHECK: Mobile? Check width 
    const [isMobile, setIsMobile] = useState<boolean>(false);
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