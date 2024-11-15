import { useState, useEffect, useRef, useLayoutEffect } from 'react';

// Type definitions
import { FullBuild, SelectedFilters } from '../types/types';

// UI
import Artifact from './Artifact.tsx'


export default function CharacterCard({
  build,
  buildSectionsOptions,
  buildSectionsVisible,
  handleSelectedPinned,
  selectedPinned,
  selectedFilters,
  isMobile,
} : {
  build: FullBuild;
  buildSectionsOptions: string[];
  buildSectionsVisible: string[];
  handleSelectedPinned: (e: any, id: number) => void;
  selectedPinned: number[];
  selectedFilters: SelectedFilters;
  isMobile: boolean;
}) {

  // Destructure the selected filters object 
    const { 
    	selectedCharacter, 
    	selectedArtifactSet, 
    	selectedSands, 
    	selectedGoblet, 
    	selectedCirclet, 
    	selectedSubstats,
    	//selectedElements, // Part of the object, but not used.
    } = selectedFilters;
	
	// Refs 
	  const aboutSectionRef = useRef<HTMLInputElement>(null);

	// INTERACT: Show build contents toggle 
	  const [isBuildVisible, setIsBuildVisible] = useState<boolean>();
	  const toggleBuildVisibility = () => {
	  	console.log('Clicked build')
	    setIsBuildVisible(prev => !prev);
	  };

	// BUILD CONTENT: Set default showing of entire build content (mobile or not?) 
	  useLayoutEffect(() => {
	  	if(isMobile) {
	  		setIsBuildVisible(false)
	  	}
	  	else {
	  		setIsBuildVisible(true)
	  	}
	  }, [isMobile]);

	// BUILD CONTENT: Check filters for conditional rendering of build sections 

		const filterApplied = buildSectionsVisible.length !== buildSectionsOptions.length;
		const showArtifactSets = buildSectionsVisible.includes('Artifact Sets') || buildSectionsVisible.includes('All');
		const showAbout = buildSectionsVisible.includes('About') || buildSectionsVisible.includes('All');
		const showSands = buildSectionsVisible.includes('Sands') || buildSectionsVisible.includes('All');
		const showGoblet = buildSectionsVisible.includes('Goblet') || buildSectionsVisible.includes('All');
		const showCirclet = buildSectionsVisible.includes('Circlet') || buildSectionsVisible.includes('All');
		const showSubstats = buildSectionsVisible.includes('Substats') || buildSectionsVisible.includes('All');
		const showERRecommendation = buildSectionsVisible.includes('ER Recommendation') || buildSectionsVisible.includes('All');

	// INTERACT: Handle minimize/maximize About section 
		const [aboutIsExpandable, setAboutIsExpandable] = useState<boolean>();
		const [aboutIsExpanded, setAboutIsExpanded] = useState<boolean>();
		useEffect(() => {
		  const aboutSection = aboutSectionRef.current;

		  if (aboutSection) {
		    const aboutSectionHeight = aboutSection.scrollHeight;

		    if (aboutSectionHeight > 85) {
		      setAboutIsExpandable(true);
		      setAboutIsExpanded(false);
		    } 
		    else {
		      setAboutIsExpandable(false);
		    }
		  }
		}, [filterApplied, isBuildVisible]);

		const handleAboutIsExpanded = (e: any) => {
			e.preventDefault();
			e.stopPropagation();
			setAboutIsExpanded(!aboutIsExpanded);
		}
		


	return (
		<div className={filterApplied ? 'character-card small' : 'character-card full'}>

		{/* Build header wrapper */}
      <div onClick={() => isMobile && toggleBuildVisibility()} className={`build-header rarity-${build.rarity}`}>

      	{/* Character Element symbol */}
					<img className="character-element" src={"./images/elements/" + build.element + ".webp"} alt={build.element}/>
					
				{/* Character Banner */}
					<div className="character-banner-wrapper">
						<img
							className="character-banner" 
							src={"./images/characters/banners/" + build.character_name + " Banner.webp"} 
							alt={build.element}
							style={{
								bottom: 
								!filterApplied && !isMobile ? (build.banner_offset ? build.banner_offset : '60px') : 
								!filterApplied && isMobile ? (build.banner_offset ? build.banner_offset / 1.5 +2 : '60px') :
								'60px'
							}}
							/>
					</div>

				{/* Character Profile Pictures */}
					{/* Traveler build and no filters (i.e. big format display) */}
					{build.character_name.includes('Traveler') && !filterApplied
						?
						<>
							{/* Specific images for Traveler to include both of them */}
							<img className="character-portrait" src={"./images/characters/portraits/Aether.webp"} alt={build.character_name}/>
							<img className="character-portrait-two" src={"./images/characters/portraits/Lumine.webp"} alt={build.character_name}/>
						</>
						:
						<>
							{/* Single picture for everyone else (also for traveler in small format display) */}
							<img className="character-portrait" src={"./images/characters/portraits/" + build.character_name + ".webp"} alt={build.character_name}/>
						</>
					}
        
        {/* Character titles - Name and Build */}
	        <div className="character-title">
	        	<h2 className={selectedCharacter.includes(build.character_name) ? 'character-name highlighted' : 'character-name'}>{build.character_name}</h2>
	        	<h3 className="build-name">{build.build_name}</h3>
	        </div>

        {/* Pin Build Button */}
	        <div className="pin-build">
	        	<button 
	        		className={selectedPinned.includes(build.ID) ? 'pin-build-button active' : 'pin-build-button'}
	        		onClick={(e) => handleSelectedPinned(e, build.ID)}
	        		>&#9733; {/* Star Icon */}
	        		</button>
	        </div>
        
    	</div>{/* End of Header wrapper */}
      
    {/* Build content wrapper */}
	    {isBuildVisible &&
      <div className="build-content">

      {/* Constellation - Background image - REMOVE? */}
      	<div className="constellation">
      		{/*<img src={"./images/constellations/" + build.character_name +" Constellation.webp"}/>*/}
      		{/*<img src={"./images/artifacts/flowers/" + build.artifact_set_1 +" Flower.webp"}/>*/}
      	</div>

      {/* Artifact Sets */}
      	{showArtifactSets &&
      	<>
      	<div className={
      		build.artifact_set_7 ? 'artifact-sets-4' : 
      		build.artifact_set_5 ? 'artifact-sets-3' : 
      		build.artifact_set_3 ? 'artifact-sets-2' : 
      		'artifact-sets-1'
      	}>

	      {/* Artifact Option 2 - Full */}
	      <Artifact
	      	number={1}
	      	build={build}
	      	selectedArtifactSet={selectedArtifactSet}
	      />

	      {/* Artifact Option 2 - Full */}
			  {build.artifact_set_3 && !filterApplied &&
	      <Artifact 
	      	number={3}
	      	build={build}
	      	selectedArtifactSet={selectedArtifactSet}
	      />}
	      
				{/* Artifact Option 3 - Full */}
				{build.artifact_set_5 && !filterApplied &&
				<Artifact 
	      	number={5}
	      	build={build}
	      	selectedArtifactSet={selectedArtifactSet}
	      />}

				{/* Artifact Option 4 - Full */}
				{build.artifact_set_7 && !filterApplied &&
				<Artifact 
	      	number={7}
	      	build={build}
	      	selectedArtifactSet={selectedArtifactSet}
	      />}


				{/* Alternative Artifact Options Wrapper: Minimal view (Images only) */}
			    {build.artifact_set_3 && filterApplied &&
	      	<div className="artifact-set-alternative">

	      		{/* Artifact Option 2 - Minimal */}
	      		{build.artifact_set_3 &&
		        <img className="artifact-icon-alt-1-small" src={"./images/artifacts/flowers/" + build.artifact_set_3 +" Flower.webp"}/>}

						{/* Artifact Option 3 - Minimal */}
			    	{build.artifact_set_5 &&
		        <img className="artifact-icon-alt-2-small" src={"./images/artifacts/flowers/" + build.artifact_set_5 +" Flower.webp"}/>}

			    </div>}{/* End Alternative Artifact Option Wrapper - Minimal view */}
		    </div>
			  </>}

	    {/* About */}
      	{showAbout && 
      	<>
				<div className="about">
	      	<div 
	      		ref={aboutSectionRef} 
	      		className={aboutIsExpanded ? 'build-section expanded' : 'build-section minimized'}>

	      		<img className="artifact-icon" src={"./images/artifacts/plumes/" + build.artifact_set_1 +" Plume.webp"}/>
	      		{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Tutorial.webp"}/>*/}

	      		{aboutIsExpandable &&
	      		<button onClick={(e) => handleAboutIsExpanded(e)}>
	      			{aboutIsExpanded ? <span>&#9650;</span> : <span>&#9660;</span>}  
	      		</button>}
	      		<div className="build-section-text">
		      		<h4>About</h4>

		      		{/* About: First paragraph */}
				      {build.note &&
				      <p>{build.note}</p>}

		      		{/* About: Second paragraph */}
				      {/*{build.note &&*/}
				      {/*<p>{build.note}</p>}*/}

		      		{/* About: Third paragraph */}
				      {/*{build.note &&*/}
				      {/*<p>{build.note}</p>}*/}

				      {/* Placeholder if no about exists */}
				      {!build.note &&
				    	<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the</p>}

			      </div>
			  	</div>
	      </div>
		    </>}

		  {/* Artifact Types */}
	      <div className="artifact-types">

	      	{/* Sands */}
	      	{showSands &&
	      	<>
		      <div className="build-section">
	        	<img className="artifact-icon"  src={"./images/artifacts/sands/" + build.artifact_set_1 +" Sands.webp"}/>
	        	{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Sands.webp"}/>*/}
	        	<div className="build-section-text">
			      	<h4>Sands</h4>
			        <ol>
			          {build.sands_1 && <li className={selectedSands.includes(build.sands_1) ? 'highlighted' : ''}>{build.sands_1}</li>}
			          {build.sands_2 && <li className={selectedSands.includes(build.sands_2) ? 'highlighted' : ''}>{build.sands_2}</li>}
			          {build.sands_3 && <li className={selectedSands.includes(build.sands_3) ? 'highlighted' : ''}>{build.sands_3}</li>}
			        </ol>
			      </div>
			     </div>
			    </>}

			  {/* Goblet */}
	      	{showGoblet && 
	      	<>
		      <div className="build-section">
	        	<img className="artifact-icon"  src={"./images/artifacts/goblets/" + build.artifact_set_1 +" Goblet.webp"}/>
	        	{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Goblet.webp"}/>*/}
	        	<div className="build-section-text">
		      		<h4>Goblet</h4>
		        	<ol>
		          	{build.goblet_1 && <li className={selectedGoblet.includes(build.goblet_1) ? 'highlighted' : ''}>{build.goblet_1}</li>}
		          	{build.goblet_2 && <li className={selectedGoblet.includes(build.goblet_2) ? 'highlighted' : ''}>{build.goblet_2}</li>}
		        	</ol>
			      </div>
		      </div>
			    </>}

			  {/* Circlet */}
	      	{showCirclet && 
	      	<>
					<div className="build-section">
	        	<img className="artifact-icon"  src={"./images/artifacts/circlets/" + build.artifact_set_1 +" Circlet.webp"}/>
						{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Circlet.webp"}/>*/}
			      <div className="build-section-text">
				      <h4>Circlet</h4>
			        <ol>
			          {build.circlet_1 && <li className={selectedCirclet.includes(build.circlet_1) ? 'highlighted' : ''}>{build.circlet_1}</li>}
			          {build.circlet_2 && <li className={selectedCirclet.includes(build.circlet_2) ? 'highlighted' : ''}>{build.circlet_2}</li>}
			          {build.circlet_3 && <li className={selectedCirclet.includes(build.circlet_3) ? 'highlighted' : ''}>{build.circlet_3}</li>}
			        </ol>
			      </div>
		      </div>
		      </>}

	      </div>{/* End Artifact Types */}	    

	    {/* Substats */}
      	{showSubstats && 
      	<>
	      <div className="substats">
	      	<div className="build-section">
	      		<img className="artifact-icon-simple" src={"./images/icons/Icon Substats.webp"}/>
		      	<div className="build-section-text">
			      <h4>Substats Priority</h4>
			        <ol>
			          {build.substats_1 && <li className={selectedSubstats.includes(build.substats_1) ? 'highlighted' : ''}>{build.substats_1}</li>}
			          {build.substats_2 && <li className={selectedSubstats.includes(build.substats_2) ? 'highlighted' : ''}>{build.substats_2}</li>}
			          {build.substats_3 && <li className={selectedSubstats.includes(build.substats_3) ? 'highlighted' : ''}>{build.substats_3}</li>}
			          {build.substats_4 && <li className={selectedSubstats.includes(build.substats_4) ? 'highlighted' : ''}>{build.substats_4}</li>}
			          {build.substats_5 && <li className={selectedSubstats.includes(build.substats_5) ? 'highlighted' : ''}>{build.substats_5}</li>}
			          {build.substats_6 && <li className={selectedSubstats.includes(build.substats_6) ? 'highlighted' : ''}>{build.substats_6}</li>}
			          {build.flatstats_1 && selectedSubstats.includes(build.flatstats_1) && <li className={selectedSubstats.includes(build.flatstats_1) ? 'highlighted flatstat' : ''}>{build.flatstats_1}</li>}
			          {build.flatstats_2 && selectedSubstats.includes(build.flatstats_2) && <li className={selectedSubstats.includes(build.flatstats_2) ? 'highlighted flatstat' : ''}>{build.flatstats_2}</li>}
			        </ol>
			      </div>
		      </div>
		    </div>
	      </>
		   	}

		  {/* ER Recommendation */}
      	{showERRecommendation && 
      	<>
	      <div className="er-recommendation">
	      	<div className="build-section">
		      	<img className="artifact-icon-simple" src={"./images/icons/Icon Energy Recharge.webp"}/>
		      	<div className="build-section-text">
				      <h4>ER Recommendation</h4>
				        <ul>
				        	{build.er_min === '' && build.er_max === '' && <li>No data</li>}
				          {build.er_min === 'n/a' && build.er_max === 'n/a' && <li>No requirement</li>}
				          {build.er_min !== 'n/a' && build.er_min !== '' && build.er_max !== 'n/a' && build.er_max !== '' && <li>{build.er_min}&ndash;{build.er_max}%</li>}
				        </ul>
	     		 	</div>
      		</div>
      	</div>
	      </>
		   	}

      </div>}{/* End Build content wrapper */}

      <div className="clear"></div>
    </div>
	);
}