import { useState, useEffect } from 'react';

// Stylesheet
import './style/App.css';

// CSV Parser
import Papa from 'papaparse';

// UI components
import Filter from './ui/Filter.tsx';
import Results from './ui/Results.tsx';

export default function App() {

  // Data version
    const VERSION = '1.7';

  // Prepare data imported from CSV
    const [rawData, setRawData] = useState<string[]>([]);
    useEffect(() => {
      // Check localstorage data exists, and which version
      const storedData = localStorage.getItem('csvData');
      const storedVersion = localStorage.getItem('csvDataVersion');

      if (storedData && storedVersion === VERSION) {
        setRawData(JSON.parse(storedData));
      } 
      else {
        // Fetch the CSV file from the public folder
        fetch('./builds-data.csv')
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

  // Handle filter selections
    const handleCharacterChange = (name: string) => {
      if(name === 'clear selection') {
        setSelectedCharacter([]);
      }
      else {
        setSelectedCharacter([name]);
      }
    };

    const handleArtifactSetChange = (set: string) => {
      if(set === 'clear selection') {
        setSelectedArtifactSet([]);
      }
      else {
        setSelectedArtifactSet([set]);
      }
    };

    const handleSandsChange = (stat: string) => {
      if(stat === 'clear selection') {
        setSelectedSands([])
      }
      else if (stat === 'HP%') {
        setSelectedSands(['HP%', 'HP% (C1)'])
      }
      else if (stat === 'Elemental Mastery') {
        setSelectedSands(['Elemental Mastery', 'Elemental Mastery (Vape)', 'Elemental Mastery (Quicken)'])
      }
      else {
        setSelectedSands([stat])
      }
    }

    const handleGobletChange = (stat: string) => {
      if(stat === 'clear selection') {
        setSelectedGoblet([])
      }
      if(stat !== 'clear selection') {
        setSelectedGoblet([stat])
      }
    }

    const handleCircletChange = (stat: string) => {
      if(stat === 'clear selection') {
        setSelectedCirclet([])
      }
      else if (stat === 'CRIT Rate') {
        setSelectedCirclet(['CRIT Rate', 'CRIT Rate/DMG', 'CRIT Rate (Favonius)'])
      }
      else if (stat === 'CRIT DMG') {
        setSelectedCirclet(['CRIT DMG', 'CRIT Rate/DMG'])
      }
      else {
        setSelectedCirclet([stat])
      }
    }

    const handleSubstatsChange = (stat: string) => {

      // If filtering for 'CRIT Rate' or 'CRIT DMG', also add the consolidated 'CRIT Rate/DMG'
      if (stat === 'CRIT Rate' || stat === 'CRIT DMG') {
        setSelectedSubstats((prev) => {

          // Check if the stat is already selected
          const isSelected = prev.includes(stat);
          const isCritIncluded = prev.includes('CRIT Rate/DMG');
          const isCritRateFavoniusIncluded = prev.includes('CRIT Rate (Favonius)');

          // Create a new selection based on the current state
          let newSelection = isSelected
            ? prev.filter((n) => n !== stat) // Remove the stat if it's already selected
            : [...prev, stat]; // Add the stat if it's not already selected

          // If "CRIT Rate" is selected and "CRIT Rate (Favonius)" is not already included, add it
          if (stat === 'CRIT Rate' && !isSelected && !isCritRateFavoniusIncluded) {
            newSelection.push('CRIT Rate (Favonius)');
          }

          // Add "CRIT Rate/DMG" if either "CRIT Rate" or "CRIT DMG" is selected, and "CRIT Rate/DMG" was not already included
          if (!isSelected && !isCritIncluded) {
            newSelection.push('CRIT Rate/DMG');
          }

          // Remove "CRIT" if neither "CRIT Rate" nor "CRIT DMG" is selected anymore
          if (!newSelection.includes('CRIT Rate') && !newSelection.includes('CRIT DMG')) {
            newSelection = newSelection.filter((n) => n !== 'CRIT Rate/DMG');
          }

          // Remove "CRIT Rate (Favonius)" if "CRIT Rate" is not selected anymore
          if (!newSelection.includes('CRIT Rate')) {
            newSelection = newSelection.filter((n) => n !== 'CRIT Rate (Favonius)');
          }

          return newSelection;
        });
      }

      else if (stat === 'Elemental Mastery') {
        setSelectedSubstats((prev) => {

          // Check if the stat is already selected
          const isSelected = prev.includes(stat);
          const isVapeIncluded = prev.includes('Elemental Mastery (Vape)');
          const isQuickenIncluded = prev.includes('Elemental Mastery (Quicken)');
          const isMeltIncluded = prev.includes('Elemental Mastery (Melt)');

          // Create a new selection based on the current state
          let newSelection = isSelected
            ? prev.filter((n) => n !== stat) // Remove the stat if it's already selected
            : [...prev, stat]; // Add the stat if it's not already selected

          // Add to selection
          if (!isSelected && !isVapeIncluded && !isQuickenIncluded && !isMeltIncluded) {
            newSelection.push('Elemental Mastery (Vape)');
            newSelection.push('Elemental Mastery (Quicken)');
            newSelection.push('Elemental Mastery (Melt)');
          }

          // Remove from selection
          if (!newSelection.includes('Elemental Mastery')) {
            newSelection = newSelection.filter((n) => n !== 'Elemental Mastery (Vape)');
            newSelection = newSelection.filter((n) => n !== 'Elemental Mastery (Quicken)');
            newSelection = newSelection.filter((n) => n !== 'Elemental Mastery (Melt)');
          }

          return newSelection;
        });
      }

      // All other stats
      else {
        setSelectedSubstats((prev) =>
          prev.includes(stat) ? prev.filter((n) => n !== stat) : [...prev, stat]
        );
      }
    }

    const handleElementsChange = (element: string) => {
      setSelectedElements((prev) =>
        prev.includes(element) ? prev.filter((n) => n !== element) : [...prev, element]
      );
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
          handleCharacterChange={handleCharacterChange}
          handleArtifactSetChange={handleArtifactSetChange}
          handleSandsChange={handleSandsChange}
          handleGobletChange={handleGobletChange}
          handleCircletChange={handleCircletChange}
          handleSubstatsChange={handleSubstatsChange}
          handleElementsChange={handleElementsChange}
          selectedCharacter={selectedCharacter}
          selectedArtifactSet={selectedArtifactSet}
          selectedSands={selectedSands}
          selectedGoblet={selectedGoblet}
          selectedCirclet={selectedCirclet}
          selectedSubstats={selectedSubstats}
          selectedElements={selectedElements}
        />
        <Results 
          resetFilters={resetFilters}
          buildsDataRaw={rawData}
          selectedCharacter={selectedCharacter}
          selectedArtifactSet={selectedArtifactSet}
          selectedSands={selectedSands}
          selectedGoblet={selectedGoblet}
          selectedCirclet={selectedCirclet}
          selectedSubstats={selectedSubstats}
          selectedElements={selectedElements}
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