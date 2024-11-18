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
  handleSelectedPinned: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void;
  selectedPinned: number[];
  selectedFilters: SelectedFilters;
  isMobile: boolean;
}) {

  // SELECTED FILTERS
  	// 1. Destructure the selected filters object 
	    const { 
	    	selectedCharacter, 
	    	selectedArtifactSet, 
	    	selectedSands, 
	    	selectedGoblet, 
	    	selectedCirclet, 
	    	selectedSubstats,
	    	//selectedElements, // Part of the object, but not used.
	    } = selectedFilters;
	
	// BUILD CONTENT: Which sections are shown? (set from Results.tsx)
	  // 1. Establish variables for conditional showing of sections (PC) 
			const filterApplied = buildSectionsVisible.length !== buildSectionsOptions.length;
			const showArtifactSets = buildSectionsVisible.includes('Artifact Sets') || buildSectionsVisible.includes('All');
			const showAbout = buildSectionsVisible.includes('About') || buildSectionsVisible.includes('All');
			const showSands = buildSectionsVisible.includes('Sands') || buildSectionsVisible.includes('All');
			const showGoblet = buildSectionsVisible.includes('Goblet') || buildSectionsVisible.includes('All');
			const showCirclet = buildSectionsVisible.includes('Circlet') || buildSectionsVisible.includes('All');
			const showSubstats = buildSectionsVisible.includes('Substats') || buildSectionsVisible.includes('All');
			const showERRecommendation = buildSectionsVisible.includes('ER Recommendation') || buildSectionsVisible.includes('All');
		// 2. Set default state based on mobile or not 
		  useLayoutEffect(() => {
		  	if(isMobile) {
		  		setIsBuildVisible(false)
		  	}
		  	else {
		  		setIsBuildVisible(true)
		  	}
		  }, [isMobile]);
	  // 3. Handle clicks to toggle build content section (Mobile) 
		  const [isBuildVisible, setIsBuildVisible] = useState<boolean>();
		  const toggleBuildVisibility = () => {
		    setIsBuildVisible(prev => !prev);
		  };

	// ABOUT: Handle minimize/maximize
		// 1. States & Refs 
			const [aboutIsExpandable, setAboutIsExpandable] = useState<boolean>();
			const [aboutIsExpanded, setAboutIsExpanded] = useState<boolean>();
			const aboutSectionRef = useRef<HTMLInputElement>(null);
		// 2. Set state based on content height. Expandable or not? 
			useEffect(() => {
			  const aboutSection = aboutSectionRef.current;

			  if (aboutSection) {
			    const aboutSectionHeight = aboutSection.scrollHeight;

			    if (aboutSectionHeight >= 85) {
			      setAboutIsExpandable(true);
			      setAboutIsExpanded(false);
			    } 
			    else {
			      setAboutIsExpandable(false);
			    }
			  }
			}, [filterApplied, isBuildVisible]);
		// 3. Handle maximizing of about section on click 
			const handleAboutIsExpanded = (e: any) => {
				e.preventDefault();
				e.stopPropagation();
				setAboutIsExpanded(!aboutIsExpanded);
			}
	
	// IMAGES
		// BANNER
			// 1. Placeholder 
		  	const bannerPlaceholderImage = './images/characters/banners/Placeholder Banner.webp';
		  // 2. Image source 
		  	const bannerImageUrl = `./images/characters/banners/${build.character_name} Banner.webp`;
		  // 3. State to store the final image URL 
		  	const [bannerImgSrc, setBannerImgSrc] = useState(bannerImageUrl);
		  // 4. Handle the error if image fails to load 
			  const handleBannerError = () => {
			    setBannerImgSrc(bannerPlaceholderImage);  // Set the image to placeholder if original image fails
			  };
		
		// PORTRAIT
			// 1. Placeholder 
		  	const portraitPlaceholderImage = './images/characters/portraits/Placeholder.webp';
		  // 2. Image source 
		  	const portraitImageUrl = `./images/characters/portraits/${build.character_name}.webp`;
		  // 3. State to store the final image URL 
		  	const [portraitImgSrc, setPortraitImgSrc] = useState(portraitImageUrl);
		  // 4. Handle the error if image fails to load 
			  const handlePortraitError = () => {
			    setPortraitImgSrc(portraitPlaceholderImage);  // Set the image to placeholder if original image fails
			  };

	return (
		<div className={filterApplied ? 'character-card small' : 'character-card full'}>

		{/* Build header wrapper */}
      <div onClick={() => isMobile && toggleBuildVisibility()} className={`build-header rarity-${build.rarity}`}>

      	{/* Element symbol */}
					<img className="character-element" src={"./images/elements/" + build.element + ".webp"} alt={build.element}/>
					
				{/* Banner */}
					<div className="character-banner-wrapper">
						<img
							className="character-banner" 
							src={bannerImgSrc} 
							onError={handleBannerError}
							alt={build.element}
							style={{
								bottom: 
								!filterApplied && !isMobile ? (build.banner_offset ? build.banner_offset : '60px') : 
								!filterApplied && isMobile ? (build.banner_offset ? build.banner_offset / 1.5 +2 : '60px') :
								filterApplied && !isMobile ? (build.banner_offset ? build.banner_offset / 2 : '35px') :
								'60px'
							}}
							/>
					</div>

				{/* Profile Pictures */}
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
							<img 
								className="character-portrait" 
								src={portraitImgSrc} 
								onError={handlePortraitError}
								alt={build.character_name}/>
						</>
					}
        
        {/* Titles - Name and Build */}
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

      {/* Artifact Sets */}
      	{showArtifactSets &&
      	<>
      	<div className={
      		build.artifact_set_7 ? 'artifact-options-4' : 
      		build.artifact_set_5 ? 'artifact-options-3' : 
      		build.artifact_set_3 ? 'artifact-options-2' : 
      		'artifact-options-1'
      	}>

	      {/* Artifact Option 1: Sets 1 & 2 */}
	      <Artifact
	      	number={1}
	      	build={build}
	      	selectedArtifactSet={selectedArtifactSet}
	      />

	      {/* Artifact Option 2: Sets 3 & 4 */}
			  {build.artifact_set_3 && !filterApplied &&
	      <Artifact 
	      	number={3}
	      	build={build}
	      	selectedArtifactSet={selectedArtifactSet}
	      />}
	      
				{/* Artifact Option 3: Sets 5 & 6 */}
				{build.artifact_set_5 && !filterApplied &&
				<Artifact 
	      	number={5}
	      	build={build}
	      	selectedArtifactSet={selectedArtifactSet}
	      />}

				{/* Artifact Option 4: Sets 7 & 8 */}
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
				    	<p>This is a build. You can build this character like this. It's one of the builds with artifacts and stats and stuff.</p>}

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
			        	{/* Normal substats: Always visible */}
			          {build.substats_1 && <li className={selectedSubstats.includes(build.substats_1) ? 'highlighted' : ''}>{build.substats_1}</li>}
			          {build.substats_2 && <li className={selectedSubstats.includes(build.substats_2) ? 'highlighted' : ''}>{build.substats_2}</li>}
			          {build.substats_3 && <li className={selectedSubstats.includes(build.substats_3) ? 'highlighted' : ''}>{build.substats_3}</li>}
			          {build.substats_4 && <li className={selectedSubstats.includes(build.substats_4) ? 'highlighted' : ''}>{build.substats_4}</li>}
			          {build.substats_5 && <li className={selectedSubstats.includes(build.substats_5) ? 'highlighted' : ''}>{build.substats_5}</li>}
			          {build.substats_6 && <li className={selectedSubstats.includes(build.substats_6) ? 'highlighted' : ''}>{build.substats_6}</li>}

			          {/* Flat substats: Visible only when filtered for */}
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
				        	{/* No data */}
				        	{build.er_min === '' && build.er_max === '' && <li>No data</li>}

				        	{/* Not applicable */}
				          {build.er_min === 'n/a' && build.er_max === 'n/a' && <li>No requirement</li>}

				          {/* Has value */}
				          {build.er_min !== 'n/a' && build.er_min !== '' && build.er_max !== 'n/a' && build.er_max !== '' && <li>{build.er_min}&ndash;{build.er_max}%</li>}
				        </ul>
	     		 	</div>
      		</div>
      	</div>
	      </>
		   	}

      </div>}{/* End Build content wrapper */}

    </div>
	);
}