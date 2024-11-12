import { useState, useEffect } from 'react';

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
} from './functions/filters.ts'

// Type definitions
import { RawBuild } from './types/types.ts';

export default function App() {

  // Data version 
    const VERSION = '1.3';

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

  // Reset all filters 
    const resetFilters = () => {
      setSelectedArtifactSet([]);
      setSelectedSands([]);
      setSelectedGoblet([]);
      setSelectedCirclet([]);
      setSelectedSubstats([]);
      setSelectedCharacter([]);
      setSelectedElements([]);
    }

  return (
    <>
      <main>
        <Filter 
          resetFilters={resetFilters}
          selectedFilters={selectedFilters}

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
          resetFilters={resetFilters}
          selectedFilters={selectedFilters}
          buildsDataRaw={rawData}
        />

    {/* UNCOMMENT TO VIEW ALL CSV DATA
    <div>
      <h1>Parsed CSV Data</h1>
      <table>
        <thead>
          <tr>
            {rawData.length > 0 && Object.keys(rawData[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rawData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex}>{value !== undefined ? value : ''}</td> // Display empty strings for undefined values
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>*/}
      </main>
    </>
  )
}