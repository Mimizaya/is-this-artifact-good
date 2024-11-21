import { useState, useEffect, useRef, useLayoutEffect } from 'react';

// Type definitions
import { FullBuild, SelectedFilters } from '../types/types';

// UI
import Artifact from './Artifact.tsx'

// Functions
import { parseText } from '../utility/functions'

export default function CharacterCard({
  build,
  buildSectionsOptions,
  buildSectionsVisible,
  handleSelectedPinned,
  selectedPinned,
  selectedFilters,
  isMobile,
  isMenuOpen,
  matchingSets,
} : {
  build: FullBuild;
  buildSectionsOptions: string[];
  buildSectionsVisible: string[];
  handleSelectedPinned: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void;
  selectedPinned: number[];
  selectedFilters: SelectedFilters;
  isMobile: boolean;
  isMenuOpen: boolean;
	matchingSets: string[];
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
		// 2. Handle click on banner (visibility / expanded view toggle) 
		  const [isBuildVisible, setIsBuildVisible] = useState<boolean>(false);
			const [expanded, setExpanded] = useState<boolean>(false);
		  const handleBannerClick = () => {

		  		// Banner click on mobile
				  if (isMobile) {
				  	if (!isMenuOpen) {
				    	setIsBuildVisible(prev => !prev);
				    }
				  }

				  // Banner click on PC
					else if (filterApplied) {
				    setExpanded(prev => !prev)
				  }
				}
		// 3. Set default state based on mobile or not 
		  useLayoutEffect(() => {
		  	if(isMobile) {
		  		setIsBuildVisible(false)
		  	}
		  	else {
		  		setIsBuildVisible(true)
		  	}
		  }, [isMobile]);

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
			}, [filterApplied, isBuildVisible, buildSectionsVisible]);
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

		// ARTIFACT: Find number of different options
			const getMaxArtifactSetNumber = (build: FullBuild) => {
			  // Define the mapping for artifact sets to numbers
			  const artifactSetMapping = {
			    9: 5,
			    7: 4,
			    5: 3,
			    3: 2,
			    1: 1
			  };

			  // Array of artifact sets to check
			  const artifactSets = [
			    build.artifact_set_9,
			    build.artifact_set_7,
			    build.artifact_set_5,
			    build.artifact_set_3,
			    build.artifact_set_1
			  ];

			  // Iterate through the artifactSets array and find the highest valid mapped number
			  let highestNumber = 0; // Default to 0 if none found

			  artifactSets.forEach((artifact, index) => {
			    if (artifact) {
			      // Get the key from the artifactSets (9, 7, 5, etc.)
			      const artifactSetKey = [9, 7, 5, 3, 1][index];  // Explicitly map index to key 9, 7, 5, 3, 1
			      const mappedNumber = artifactSetMapping[artifactSetKey as 1 | 3 | 5 | 7 | 9];

			      // Update highestNumber if the current mappedNumber is higher
			      highestNumber = Math.max(highestNumber, mappedNumber);
			    }
			  });

			  return highestNumber;
			};
			const numberOfArtifactOptions = getMaxArtifactSetNumber(build)

	return (
		<div className={`character-card ${filterApplied ? (expanded ? 'full expanded' : 'small') : 'full'}`}>

		{/* Build header wrapper */}
      <div 
      	className={`build-header rarity-${build.rarity}`}
				onClick={() => handleBannerClick()}
      >

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
								filterApplied && !isMobile ? (build.banner_offset ? build.banner_offset / 2.1 : '35px') :
								'60px'
							}}
							/>
					</div>

				{/* Profile Pictures */}
					{/* Traveler build and no filters (i.e. big format display) */}
					{build.character_name.includes('Traveler') && (!filterApplied || expanded)
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
								src={
									build.character_name.includes('Traveler') ? "./images/characters/portraits/Aether.webp" :
									portraitImgSrc
								} 
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
	        		onClick={(e) => (!isMobile || (isMobile && !isMenuOpen)) && handleSelectedPinned(e, build.ID)}
	        		>&#9733; {/* Star Icon */}
	        		</button>
	        </div>
        
    	</div>{/* End of Header wrapper */}
      
    {/* Build content wrapper */}
	    {isBuildVisible &&
      <div className="build-content">

      {/* Artifact Sets */}
      	{(showArtifactSets || expanded) &&
      	<>
      	<div className={
      		build.artifact_set_9 ? 'artifact-options-5' : 
      		build.artifact_set_7 ? 'artifact-options-4' : 
      		build.artifact_set_5 ? 'artifact-options-3' : 
      		build.artifact_set_3 ? 'artifact-options-2' : 
      		'artifact-options-1'
      	}>

	      {/* Artifact Option 1: Sets 1 & 2 */}
		      <Artifact
						minimal={false}
		      	numberOfArtifactOptions={numberOfArtifactOptions}
		      	number={1}
		      	build={build}
		      	selectedArtifactSet={selectedArtifactSet}
					  matchingSets={matchingSets}
		      />
	      {/* Artifact Option 2: Sets 3 & 4 */}
				  {build.artifact_set_3 && (!filterApplied || expanded) &&
		      <Artifact
						minimal={false}
		      	numberOfArtifactOptions={numberOfArtifactOptions}
		      	number={3}
		      	build={build}
		      	selectedArtifactSet={selectedArtifactSet}
					  matchingSets={matchingSets}
		      />}
				{/* Artifact Option 3: Sets 5 & 6 */}
					{build.artifact_set_5 && (!filterApplied || expanded) &&
					<Artifact
						minimal={false}
		      	numberOfArtifactOptions={numberOfArtifactOptions}
		      	number={5}
		      	build={build}
		      	selectedArtifactSet={selectedArtifactSet}
					  matchingSets={matchingSets}
		      />}
				{/* Artifact Option 4: Sets 7 & 8 */}
					{build.artifact_set_7 && (!filterApplied || expanded) &&
					<Artifact
						minimal={false}
		      	numberOfArtifactOptions={numberOfArtifactOptions}
		      	number={7}
		      	build={build}
		      	selectedArtifactSet={selectedArtifactSet}
					  matchingSets={matchingSets}
		      />}
				{/* Artifact Option 5: Sets 9 & 10 */}
					{build.artifact_set_9 && (!filterApplied || expanded) &&
					<Artifact
						minimal={false}
		      	numberOfArtifactOptions={numberOfArtifactOptions}
		      	number={9}
		      	build={build}
		      	selectedArtifactSet={selectedArtifactSet}
					  matchingSets={matchingSets}
		      />}

				{/* Alternative Artifact Options Wrapper: Minimal view (Images only) */}
			    {build.artifact_set_3 && filterApplied && !expanded &&
	      	<div className="artifact-set-alternatives">

	      		{/* Artifact Alternative Option 1 - Minimal */}
		      		{build.artifact_set_3 &&
								<Artifact 
									minimal={true}
					      	numberOfArtifactOptions={numberOfArtifactOptions}
					      	number={3}
					      	build={build}
					      	selectedArtifactSet={selectedArtifactSet}
					      	matchingSets={matchingSets}
					      />}
						{/* Artifact Alternative Option 2 - Minimal */}
				    	{build.artifact_set_5 &&
								<Artifact 
									minimal={true}
					      	numberOfArtifactOptions={numberOfArtifactOptions}
					      	number={5}
					      	build={build}
					      	selectedArtifactSet={selectedArtifactSet}
					      	matchingSets={matchingSets}
					      />}
						{/* Artifact Alternative Option 3 - Minimal */}
				    	{build.artifact_set_7 &&
								<Artifact 
									minimal={true}
					      	numberOfArtifactOptions={numberOfArtifactOptions}
					      	number={7}
					      	build={build}
					      	selectedArtifactSet={selectedArtifactSet}
					      	matchingSets={matchingSets}
					      />}
						{/* Artifact Alternative Option 4 - Minimal */}
				    	{build.artifact_set_9 &&
								<Artifact 
									minimal={true}
					      	numberOfArtifactOptions={numberOfArtifactOptions}
					      	number={9}
					      	build={build}
					      	selectedArtifactSet={selectedArtifactSet}
					      	matchingSets={matchingSets}
					      />}

			    </div>}{/* End Alternative Artifact Option Wrapper - Minimal view */}
		    </div>
			  </>}

	    {/* About */}
      	{(showAbout || expanded) && 
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
	      	{(showSands || expanded) &&
	      	<>
		      <div className="build-section">
	        	<img className="artifact-icon"  src={"./images/artifacts/sands/" + build.artifact_set_1 +" Sands.webp"}/>
	        	{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Sands.webp"}/>*/}
	        	<div className="build-section-text">
			      	<h4>Sands</h4>
			        <ol>
			          {build.sands_1 && <li className={selectedSands.includes(build.sands_1) ? 'highlighted' : ''}>{parseText(build.sands_1)}</li>}
			          {build.sands_2 && <li className={selectedSands.includes(build.sands_2) ? 'highlighted' : ''}>{parseText(build.sands_2)}</li>}
			          {build.sands_3 && <li className={selectedSands.includes(build.sands_3) ? 'highlighted' : ''}>{parseText(build.sands_3)}</li>}
			        </ol>
			      </div>
			     </div>
			    </>}

			  {/* Goblet */}
	      	{(showGoblet || expanded) && 
	      	<>
		      <div className="build-section">
	        	<img className="artifact-icon"  src={"./images/artifacts/goblets/" + build.artifact_set_1 +" Goblet.webp"}/>
	        	{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Goblet.webp"}/>*/}
	        	<div className="build-section-text">
		      		<h4>Goblet</h4>
		        	<ol>
		          	{build.goblet_1 && <li className={selectedGoblet.includes(build.goblet_1) ? 'highlighted' : ''}>{parseText(build.goblet_1)}</li>}
		          	{build.goblet_2 && <li className={selectedGoblet.includes(build.goblet_2) ? 'highlighted' : ''}>{parseText(build.goblet_2)}</li>}
		        	</ol>
			      </div>
		      </div>
			    </>}

			  {/* Circlet */}
	      	{(showCirclet || expanded) && 
	      	<>
					<div className="build-section">
	        	<img className="artifact-icon"  src={"./images/artifacts/circlets/" + build.artifact_set_1 +" Circlet.webp"}/>
						{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Circlet.webp"}/>*/}
			      <div className="build-section-text">
				      <h4>Circlet</h4>
			        <ol>
			          {build.circlet_1 && <li className={selectedCirclet.includes(build.circlet_1) ? 'highlighted' : ''}>{parseText(build.circlet_1)}</li>}
			          {build.circlet_2 && <li className={selectedCirclet.includes(build.circlet_2) ? 'highlighted' : ''}>{parseText(build.circlet_2)}</li>}
			          {build.circlet_3 && <li className={selectedCirclet.includes(build.circlet_3) ? 'highlighted' : ''}>{parseText(build.circlet_3)}</li>}
			        </ol>
			      </div>
		      </div>
		      </>}

	      </div>{/* End Artifact Types */}	    

	    {/* Substats */}
      	{(showSubstats || expanded) && 
      	<>
	      <div className="substats">
	      	<div className="build-section">
	      		<img className="artifact-icon-simple" src={"./images/icons/Icon Substats.webp"}/>
		      	<div className="build-section-text">
			      <h4>Substats Priority</h4>
			        <ol>
			        	{/* Normal substats: Always visible */}
			          {build.substats_1 && <li className={selectedSubstats.includes(build.substats_1) ? 'highlighted' : ''}>{parseText(build.substats_1)}</li>}
			          {build.substats_2 && <li className={selectedSubstats.includes(build.substats_2) ? 'highlighted' : ''}>{parseText(build.substats_2)}</li>}
			          {build.substats_3 && <li className={selectedSubstats.includes(build.substats_3) ? 'highlighted' : ''}>{parseText(build.substats_3)}</li>}
			          {build.substats_4 && <li className={selectedSubstats.includes(build.substats_4) ? 'highlighted' : ''}>{parseText(build.substats_4)}</li>}
			          {build.substats_5 && <li className={selectedSubstats.includes(build.substats_5) ? 'highlighted' : ''}>{parseText(build.substats_5)}</li>}

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
      	{(showERRecommendation || expanded) && 
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