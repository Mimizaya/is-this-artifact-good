import { useState, useEffect, useRef } from 'react';
import { FilterTab, SavedFilters, SelectedFilters, ArtifactSet } from '../types/types.ts';

import { artifactSets } from '../data/artifact-data.ts';

export default function FilterTabs({ 
  handleTabChange, 
  currentFilterTab, 
  selectedFilters, 
  savedFilters, 
  isMobile,
  isMenuOpen,
} : {
  handleTabChange: any;
  currentFilterTab: number;
  selectedFilters: SelectedFilters;
  savedFilters: SavedFilters; 
  isMobile: boolean;
  isMenuOpen: boolean;
}) {

  // SELECTED FILTERS
    // 1. Destructure the selected filters object 
      const { selectedCharacter, selectedArtifactSet, selectedSands, selectedGoblet, selectedCirclet, selectedSubstats, selectedElements } = selectedFilters;
  
  // TABS
    // 1. Initial Tabs 
    const initialFilterTabs: FilterTab[] = [
      {
        id: 1,
        default_name: 'Default tab',
        name: null,
      },
    ];

    const [filterTabs, setFilterTabs] = useState(initialFilterTabs);
    // 2. Handle Add Tab 
    // Reference for tracking the next available ID
    const nextId = useRef(2); // Start from 2 since we already have Tab 1 as initial

    const handleAddTab = (artifact: string | null) => {
      const newId = nextId.current; // Get the next available ID
      nextId.current += 1; // Increment the ID for the next tab
        setFilterTabs((prev) => {
          return [
            ...prev,
            {
              id: newId,
              default_name: 'New tab',
              name: null,
            }
          ];
        });
      handleTabChange(newId, artifact);
    };
    // 3. Handle Close Tab 
    const handleTabClose = (id: number) => {
      setFilterTabs((prev) => {
        const newTabs = prev.filter((tab) => tab.id !== id);
        return newTabs;
      });
      // If the closed tab was the current tab, find the previous tab
      if (id === currentFilterTab) {
        // Get the index of the tab to be removed in the updated filterTabs
        const currentIndex = filterTabs.findIndex((tab) => tab.id === id);

        // Get the tab before and after the current tab
        const prevTab = filterTabs[currentIndex - 1];
        const nextTab = filterTabs[currentIndex + 1];

        // If current index is not 0, go to previous
        if(currentIndex !== 0) {
          handleTabChange(prevTab.id);
        }
        // Else if 0, go to next
        else {
          handleTabChange(nextTab.id);
        }

      }
    };
    // 4. Automatic re-naming of Tabs 
    useEffect(() => {
      setFilterTabs((prev) =>
        prev.map((tab: FilterTab) => {
          if (tab.id === currentFilterTab) {
            if(selectedCharacter.length > 0) {
              return { ...tab, name: selectedCharacter }; 
            }
            else if(selectedArtifactSet.length > 0) {
              return { ...tab, name: selectedArtifactSet }; 
            }
            else if(selectedElements.length > 0) {
              return { ...tab, name: [selectedElements.join(', ')] }; 
            }
            else if(selectedSands.length > 0) {
              return { ...tab, name: ['Sands: ' + selectedSands[0]] }; 
            }
            else if(selectedGoblet.length > 0) {
              return { ...tab, name: ['Goblet: ' + selectedGoblet[0]] }; 
            }
            else if(selectedCirclet.length > 0) {
              return { ...tab, name: ['Circlet: ' + selectedCirclet[0]] }; 
            }
            else if(selectedSubstats.length > 0) {
              return { ...tab, name: ['Substats: ' + selectedSubstats[0]] };
            }
            else {
              return { ...tab, name: null };
            }
          }
          return tab;
        })
      );
    }, [selectedFilters, currentFilterTab]);
    // 5. Suggest other artifact from same domain 
    const artifactDomain = artifactSets.find((set: ArtifactSet) => set.name === selectedArtifactSet?.toString())
    const partnerArtifact = artifactDomain?.domain
      ? artifactSets
        .filter((set: ArtifactSet) => set.domain === artifactDomain?.domain)
        .filter((set) => set.name !== artifactDomain?.name)
        .map((set) => set.name)
        .toString() // Convert the array to a string
      : ''; // Return an empty string if domain is null or undefined

    const tabIsAlreadyOpen = filterTabs?.map((tab: FilterTab) => {
      return tab?.name?.toString() === partnerArtifact;
    });

  return (
    <div id="filter-tabs" className={isMenuOpen ? 'open' : 'closed'}>
      <button 
        className={currentFilterTab === 0 ? 'filter-pinned highlighted' : 'filter-pinned'}
        onClick={() => {
          handleTabChange(0);
        }}
      >
        &#9733; {/* Star Icon */}
      </button>

      {filterTabs.map((tab: FilterTab) => (
        <div key={tab.id} className={currentFilterTab === tab.id ? 'filter-tab highlighted' : 'filter-tab'}>
          <button
            className="filter-select"
            onClick={() => handleTabChange(tab.id)}
          >
          {savedFilters[tab.id] &&
          <img 
            src={
              // Character 
              savedFilters[tab.id].selectedCharacter.length > 0 ? 
              './images/characters/portraits/' + savedFilters[tab.id].selectedCharacter + '.webp' :

              // Artifact Set
              savedFilters[tab.id].selectedArtifactSet.length > 0 ? 
              './images/artifacts/flowers/' + savedFilters[tab.id].selectedArtifactSet + ' Flower.webp' :

              // Element
              savedFilters[tab.id].selectedElements.length > 0 ? 
              './images/elements/' + savedFilters[tab.id].selectedElements[0] + '.webp' :

              // Sands
              savedFilters[tab.id].selectedSands.length > 0 ? 
              './images/icons/Icon Sands.webp' :

              // Goblet
              savedFilters[tab.id].selectedGoblet.length > 0 ? 
              './images/icons/Icon Goblet.webp' :

              // Circlet
              savedFilters[tab.id].selectedCirclet.length > 0 ? 
              './images/icons/Icon Circlet.webp' :

              // Substats
              savedFilters[tab.id].selectedSubstats.length > 0 ? 
              './images/icons/Icon CRIT Rate.webp' :
              ''
            }
          />}
          
          {!isMobile &&
          <p>{tab.name ? tab.name : tab.default_name}</p>}

          {isMobile &&
          <p>Tab</p>}
          
          </button>
          {filterTabs.length > 1 && !isMobile &&
          <button
            className="filter-close"
            onClick={() => handleTabClose(tab.id)}
          >×
          </button>}
        </div>
      ))}

        {selectedArtifactSet.length > 0 && !tabIsAlreadyOpen.includes(true) && partnerArtifact &&
        <button 
          className="filter-suggestion"
          onClick={() => handleAddTab(partnerArtifact)}>
          <img 
            src={'./images/artifacts/flowers/' + partnerArtifact + ' Flower.webp'}
          />
          <p>
            Add {partnerArtifact}?
          </p>
        </button>}

        <button 
          className="filter-new"
          onClick={() => handleAddTab(null)}
        >
          +
        </button>
    </div>
  );
}
