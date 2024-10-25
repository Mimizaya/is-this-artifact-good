import { useState, useEffect } from 'react';
import 'src/style/App.css';
import Papa from 'papaparse';
import rawData from 'src/data/raw-data.csv';
import { characterData } from 'src/data/character-data';
import Filter from 'src/ui/filter';
import Results from 'src/ui/results';

export default function App() {

  // Filter selection states
    const [selectedCharacter, setSelectedCharacter] = useState([]);
    const [selectedArtifactSet, setSelectedArtifactSet] = useState([]);
    const [selectedSands, setSelectedSands] = useState([]);
    const [selectedGoblet, setSelectedGoblet] = useState([]);
    const [selectedCirclet, setSelectedCirclet] = useState([]);
    const [selectedSubstats, setSelectedSubstats] = useState([]);
    const [selectedElements, setSelectedElements] = useState([]);

  // Handle filter selections
    const handleCharacterChange = (name) => {
      if(name === 'clear selection') {
        setSelectedCharacter([]);
      }
      else {
        setSelectedCharacter([name]);
      }
    };

    const handleArtifactSetChange = (set) => {
      if(set === 'clear selection') {
        setSelectedArtifactSet([]);
      }
      else {
        setSelectedArtifactSet([set]);
      }
    };

    const handleMainstatChange = (stat, type) => {
      if(type === 'Sands') {
        if(stat === 'clear selection') {
          setSelectedSands([])
        }
        if(stat !== 'clear selection') {
          setSelectedSands([stat])
          console.log(selectedSands)
        }
      }
      if(type === 'Goblet') {
        if(stat === 'clear selection') {
          setSelectedGoblet([])
        }
        if(stat !== 'clear selection') {
          setSelectedGoblet([stat])
        }
      }      
      if(type === 'Circlet') {
        if(stat === 'clear selection') {
          setSelectedCirclet([])
        }
        if(stat !== 'clear selection') {
          setSelectedCirclet([stat])
        }
      }
    }

    const handleSubstatsChange = (stat) => {
      setSelectedSubstats((prev) =>
        prev.includes(stat) ? prev.filter((n) => n !== stat) : [...prev, stat]
      );
    }

    const handleElementsChange = (element) => {
      setSelectedElements((prev) =>
        prev.includes(element) ? prev.filter((n) => n !== element) : [...prev, element]
      );
    };

  // Reset all filters
    const resetFilters = () => {
      setSelectedCharacter([]);
      setSelectedArtifactSet([]);
      setSelectedSands([]);
      setSelectedGoblet([]);
      setSelectedCirclet([]);
      setSelectedSubstats([]);
      setSelectedElements([]);
    }

  // Prepare data imported from CSV
    const [rawData, setRawData] = useState([]);

    // Increment version when updating data to invalidate storage and parse new data
    const VERSION = '1.1';

    useEffect(() => {
      // Check localstorage data exists, and which version
      const storedData = localStorage.getItem('csvData');
      const storedVersion = localStorage.getItem('csvDataVersion');

      if (storedData && storedVersion === VERSION) {
        setRawData(JSON.parse(storedData));
      } 
      else {
        // Fetch the CSV file from the public folder
        fetch('/builds-data.csv')
          .then((response) => response.text())
          .then((text) => {
            Papa.parse(text, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                // Set parsed data to state
                setRawData(results.data);
                // Save parsed data to local storage
                localStorage.setItem('csvData', JSON.stringify(results.data));
                localStorage.setItem('csvDataVersion', VERSION);
              },
              error: (error) => {
                console.error('Error parsing CSV:', error);
              },
            });
          })
          .catch((error) => {
            console.error('Error fetching CSV:', error);
          });
      }
    }, []);

  return (
    <>
      <main>
        <Filter 
          resetFilters={resetFilters}
          handleCharacterChange={handleCharacterChange}
          handleArtifactSetChange={handleArtifactSetChange}
          handleMainstatChange={handleMainstatChange}
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
          characterDataCSV={rawData}
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