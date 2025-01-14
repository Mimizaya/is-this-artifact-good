import React from 'react'
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
  handleTabChange: (tabId: number, filter: string | null, value: string | null) => void;
  currentFilterTab: number;
  selectedFilters: SelectedFilters;
  savedFilters: SavedFilters; 
  isMobile: boolean;
  isMenuOpen: boolean;
}) {

  // SELECTED FILTERS
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Destructure the selected filters object 
      const { selectedCharacter, selectedArtifactSet, selectedSands, selectedGoblet, selectedCirclet, selectedSubstats, selectedElements } = selectedFilters;
  
  // TABS
  // ——————————————————————————————————————————————————————————————————————————————————————————
  // #1 Initial Tabs 
    const initialFilterTabs: FilterTab[] = [
      {
        id: 1,
        default_name: 'All builds',
        name: null,
      },
    ];
    const [filterTabs, setFilterTabs] = useState(initialFilterTabs);
  // #2 Handle Add Tab 
    // Reference for tracking the next available ID
    const nextId = useRef(2); // Start from 2 since we already have Tab 1 as initial

    const handleAddTab = (filter: string | null, value: string | null) => {
      const newId = nextId.current; // Get the next available ID
      nextId.current += 1; // Increment the ID for the next tab
      const currentTabIndex = filterTabs.findIndex(tab => tab.id === currentFilterTab);

        setFilterTabs((prev) => {
          // Split the array into two parts: before the index and after the index
          const before = prev.slice(0, currentTabIndex+1); // Tabs before and including the current index
          const after = prev.slice(currentTabIndex+1); // Tabs after the specified index

          if(filter) {
            return [
              ...before,
              { id: newId, default_name: 'All builds', name: null },
              ...after,
            ];
          }
          else {
            return [
              ...prev,
              {
                id: newId,
                default_name: 'All builds',
                name: null,
              }
            ];
          }
          // Return a new array with the new tab inserted at the specified index

        });



      handleTabChange(newId, filter, value);
    };
  // #3 Handle Close Tab 
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
          handleTabChange(prevTab.id, null, null);
        }
        // Else if 0, go to next
        else {
          handleTabChange(nextTab.id, null, null);
        }

      }
    };
  // #4 Automatic re-naming of Tabs 
    useEffect(() => {
      setFilterTabs((prev) =>
        prev.map((tab: FilterTab) => {
          if (tab.id === currentFilterTab) {
            if(selectedCharacter.length > 0) {
              return { ...tab, name: [selectedCharacter[0]] }; 
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
  // #5 Suggest other artifact from same domain 
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
          handleTabChange(0, null, null);
        }}
      >&#9733; {/* Star Icon */}
      </button>

      {filterTabs.map((tab: FilterTab) => (
        <React.Fragment key={tab.id}>
          <div className={currentFilterTab === tab.id ? 'filter-tab highlighted' : 'filter-tab'}>
            <button
              className="filter-select"
              onClick={() => handleTabChange(tab.id, null, null)}
            >
            {savedFilters[tab.id] &&
            <img 
              src={
                // Character
                savedFilters[tab.id].selectedCharacter.length > 0 ? 
                './images/characters/portraits/' + savedFilters[tab.id].selectedCharacter[0] + '.webp' :

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

                isMobile ? 
                './images/icons/Icon Tab.webp' :

                undefined
              }
            />}
            
            {!isMobile &&
            <p>{tab.name ? tab.name : tab.default_name}</p>}

            </button>
            {filterTabs.length > 1 && !isMobile &&
            <button
              className="filter-close"
              onClick={() => handleTabClose(tab.id)}
            >×
            </button>}
          </div>

          {selectedArtifactSet.length > 0 && !tabIsAlreadyOpen.includes(true) && partnerArtifact && currentFilterTab === tab.id &&
          <button
            className="filter-suggestion"
            onClick={() => handleAddTab('artifact', partnerArtifact)}>
            <img 
              src={'./images/artifacts/flowers/' + partnerArtifact + ' Flower.webp'}
            />
            <p>
              Add {partnerArtifact}?
            </p>
          </button>}
        </React.Fragment>
      ))}

        <button 
          className="filter-new"
          onClick={() => handleAddTab(null, null)}
        >
          +
        </button>
    </div>
  );
}
