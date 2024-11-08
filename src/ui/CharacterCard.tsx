import { useState, useEffect, useRef, useLayoutEffect } from 'react';

// Type definitions
import { FullBuild, SelectedFilters } from '../types/types';

export default function CharacterCard({
  build,
  buildSectionsVisible,
  handleSelectedPinned,
  selectedPinned,
  selectedFilters,
} : {
  build: FullBuild;
  buildSectionsVisible: string[];
  handleSelectedPinned: (id: number) => void;
  selectedPinned: number[];
  selectedFilters: SelectedFilters;
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
		const elementOneRef = useRef<HTMLInputElement>(null);
	  const elementTwoRef = useRef<HTMLInputElement>(null);
	  const elementThreeRef = useRef<HTMLInputElement>(null);

	// Calculate and set tooltip positions 
 		const [artifactSetOneHeight, setArtifactSetOneHeight] = useState<number>();
 		const [artifactSetTwoHeight, setArtifactSetTwoHeight] = useState<number>();
 		const [artifactSetThreeHeight, setArtifactSetThreeHeight] = useState<number>();

		useLayoutEffect(() => {
			const offset = 5;
			const artifactOne = elementOneRef.current;
			const artifactTwo = elementTwoRef.current;
			const artifactThree = elementThreeRef.current;

			if(artifactOne) {
				const artifactOneHeight = artifactOne.offsetHeight;
				setArtifactSetOneHeight(artifactOneHeight - offset);
			}
			if(artifactTwo) {
				const artifactTwoHeight = artifactTwo.offsetHeight;
				setArtifactSetTwoHeight(artifactTwoHeight - offset);
			}
			if(artifactThree) {
				const artifactThreeHeight = artifactThree.offsetHeight;
				setArtifactSetThreeHeight(artifactThreeHeight - offset);
			}
			
		}, []);

	// Check filters for conditional rendering of build sections 
		const filterApplied = buildSectionsVisible.some(section => section !== 'All');
		const showArtifactSets = buildSectionsVisible.includes('Artifact Sets') || buildSectionsVisible.includes('All');
		const showAbout = buildSectionsVisible.includes('About') || buildSectionsVisible.includes('All');
		const showSands = buildSectionsVisible.includes('Sands') || buildSectionsVisible.includes('All');
		const showGoblet = buildSectionsVisible.includes('Goblet') || buildSectionsVisible.includes('All');
		const showCirclet = buildSectionsVisible.includes('Circlet') || buildSectionsVisible.includes('All');
		const showSubstats = buildSectionsVisible.includes('Substats') || buildSectionsVisible.includes('All');
		const showERRecommendation = buildSectionsVisible.includes('ER Recommendation') || buildSectionsVisible.includes('All');

	// Ensure equal heights on Artifact Set and Alternatives sections 
		useEffect(() => {
	    const elementOne = elementOneRef.current;
	    const elementTwo = elementTwoRef.current;
	    const elementThree = elementThreeRef.current;

			if(filterApplied) {
				if(elementOne) {
		  		elementOne.style.height = '';
				}
				if(elementTwo) {
		  		elementTwo.style.height = '';
				}
		  }

	    if(!filterApplied) {
		    if(elementOne) {
		      const elementOneHeight = elementOne.offsetHeight;
		      let maxHeight = elementOneHeight;

		      if(elementTwo) {
		        const elementTwoHeight = elementTwo.offsetHeight;
		        maxHeight = Math.max(elementOneHeight, elementTwoHeight);

			      if (elementThree) {
			        const elementThreeHeight = elementThree.offsetHeight;
			        maxHeight = Math.max(elementOneHeight, elementTwoHeight + elementThreeHeight);
			      }

		        if(elementOneHeight !== elementTwoHeight && elementThree === null) {
		          elementOne.style.height = `${maxHeight}px`;
		          elementTwo.style.height = `${maxHeight}px`;
		        }
		        else if(elementThree) {
		        	elementOne.style.height = `${maxHeight + 5}px`; // +5 for margins
		        }
		      } 
	    	}
	    }
	  }, [filterApplied]);


	return (
		<div className={filterApplied ? 'character-card small' : 'character-card full'}>

		{/* Build header wrapper */}
      <div className={`rarity-${build.rarity} build-header`}>

      	{/* Character Element symbol */}
				<img className="character-element" src={"./images/elements/" + build.element + ".webp"} alt={build.element}/>

				{/* Character Banner */}
				<div className="character-banner-wrapper">
					<img className="character-banner" src={"./images/characters/" + build.character_name + " Banner.webp"} alt={build.element}/>
				</div>

				{/* Character Profile Pictures */}
				{/* Traveler build and no filters (i.e. big format display) */}
				{build.character_name.includes('Traveler') && !filterApplied
					?
					<>
						{/* Specific images for Traveler to include both of them */}
						<img className="character-portrait" src={"./images/characters/Aether.webp"} alt={build.character_name}/>
						<img className="character-portrait-two" src={"./images/characters/Lumine.webp"} alt={build.character_name}/>
					</>
					:
					<>
						{/* Single picture for everyone else (also for traveler in small format display) */}
						<img className="character-portrait" src={"./images/characters/" + build.character_name + ".webp"} alt={build.character_name}/>
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
        		className="pin-build-button"
        		onClick={() => handleSelectedPinned(build.ID)}
        		>{selectedPinned.includes(build.ID) ? 'Pinned' : 'Pin'}
        		</button>
        </div>
        
    	</div>{/* End of Header wrapper */}
      
    {/* Build content wrapper */}
      <div className="build-content">

      {/* Constellation - Background image - REMOVE? */}
      	<div className="constellation">
      		{/*<img src={"./images/constellations/" + build.character_name +" Constellation.webp"}/>*/}
      		{/*<img src={"./images/artifacts/flowers/" + build.artifact_set_1 +" Flower.webp"}/>*/}
      	</div>

      {/* Artifact Sets */}
      	{showArtifactSets &&
      	<>
	      {/* Main Artifact Combination - Wrapper (Images, Text & Tooltip) */}
	      	<div className={build.artifact_set_3 ? 'artifact-set multiple' : 'artifact-set'}>

	      		{/* Artifact Combination 1 */}
						<div className="build-section tooltip-on-hover" ref={elementOneRef}>

							{/* Artifact Set Single Image */}
							{build.artifact_set_1 && !build.artifact_set_2 &&
	        		<img className="artifact-icon" src={"./images/artifacts/flowers/" + build.artifact_set_1 +" Flower.webp"}/>}

	        		{/* Artifact Set Split Multi Image (double) */}
							{build.artifact_set_1 && build.artifact_set_2 &&
							<>
	        			<img className="artifact-icon-top" src={"./images/artifacts/flowers/" + build.artifact_set_1 +" Flower.webp"}/>
	        			<img className="artifact-icon-bottom" src={"./images/artifacts/flowers/" + build.artifact_set_2 +" Flower.webp"}/>
	        		</>}

	        		{/* Artifact Set Split Multi Image (split) */}
							{/*	{build.artifact_set_1 && build.artifact_logic === 'AND' &&
							<>
							<div className="clipping-mask-top">
	        			<img className="artifact-icon-split"  src={"./images/artifacts/flowers/" + build.artifact_set_1 +" Flower.webp"}/>
	        		</div>
	        		<div className="clipping-mask-bottom">
	        			<img className="artifact-icon-split"  src={"./images/artifacts/flowers/" + build.artifact_set_2 +" Flower.webp"}/>
	        		</div>
	        		</>}*/}

				      <div className="build-section-text">
					      <h4>Artifact Set{build.artifact_set_2 && 's'}</h4>
				        <ul>
			          	{build.artifact_set_1 && 
			          	<li className={selectedArtifactSet.includes(build.artifact_set_1) ? 'highlighted' : ''}>
			          		{build.artifact_set_1}{build.artifact_set_2 && <span className="artifact-logic"> ×2</span>}
			          	</li>}
			          	{build.artifact_set_2 && build.artifact_set_2 &&
			          	<li className={selectedArtifactSet.includes(build.artifact_set_2) ? 'highlighted' : ''}>
			          		{build.artifact_set_2}<span className="artifact-logic"> ×2</span>
			          	</li>}
				        </ul>
				      </div>
			      </div>{/* End Artifact Set 1 */}

				    {/* Tooltip - Artifact Set 1 */}

				    {/* Single set */}
				    {!build.artifact_set_2 &&
			 	 		<div className="artifact-info tooltip" style={{top: artifactSetOneHeight +'px'}}>
			  			<h4>2-Piece Bonus</h4>
			  			<p>{build.artifact_set_1_two_piece}</p>
			  			<h4>4-Piece Bonus</h4>
			  			<p>{build.artifact_set_1_four_piece}</p>
			  		</div>}

				    {/* Split set */}
				    {build.artifact_set_2 &&
			 	 		<div className="artifact-info tooltip" style={{top: artifactSetOneHeight +'px'}}>
			  			<h4>{build.artifact_set_1}</h4>
			  			<p>{build.artifact_set_1_two_piece}</p>
			  			<h4>{build.artifact_set_2}</h4>
			  			<p>{build.artifact_set_2_two_piece}</p>
			  		</div>}

			     </div>{/* End Artifact Set 1 Wrapper */}

				{/* Alternative Artifact Combinations Wrapper: Full view (Images, Text & Tooltip) */}
			    {build.artifact_set_3 && !filterApplied &&
	      	<div className="artifact-set-alternative">

	      		{/* Artifact Combination 2 - Full */}
						<div className="build-section tooltip-on-hover" ref={elementTwoRef}>

							{/* Single Set: Image */}
							{build.artifact_set_3 && !build.artifact_set_4 &&
	        		<img className="artifact-icon"  src={"./images/artifacts/flowers/" + build.artifact_set_3 +" Flower.webp"}/>}

	        		{/* Artifact Set Split Multi Image (double) */}
							{build.artifact_set_3 && build.artifact_set_4 &&
							<>
	        			<img className="artifact-icon-top" src={"./images/artifacts/flowers/" + build.artifact_set_3 +" Flower.webp"}/>
	        			<img className="artifact-icon-bottom" src={"./images/artifacts/flowers/" + build.artifact_set_4 +" Flower.webp"}/>
	        		</>}

	        		{/* Artifact Set Split Multi Image (split) */}
							{/*	{build.artifact_set_1 && build.artifact_logic === 'AND' &&
							<>
							<div className="clipping-mask-top">
	        			<img className="artifact-icon-split" src={"./images/artifacts/flowers/" + build.artifact_set_1 +" Flower.webp"}/>
	        		</div>
	        		<div className="clipping-mask-bottom">
	        			<img className="artifact-icon-split" src={"./images/artifacts/flowers/" + build.artifact_set_2 +" Flower.webp"}/>
	        		</div>
	        		</>}*/}

				      <div className="build-section-text">
								<h4>Alternative</h4>
				        <ul>
			          	{build.artifact_set_3 && 
			          	<li className={selectedArtifactSet.includes(build.artifact_set_3) ? 'highlighted' : ''}>
			          		{build.artifact_set_3}{build.artifact_set_4 && <span className="artifact-logic"> ×2</span>}
			          	</li>}
			          	{build.artifact_set_4 &&
			          	<li className={selectedArtifactSet.includes(build.artifact_set_4) ? 'highlighted' : ''}>
			          		{build.artifact_set_4}<span className="artifact-logic"> ×2</span>
			          	</li>}
				        </ul>
				      </div>
			      </div>{/* End Artifact Set 2 - Full */}

				    {/* Tooltip - Artifact Set 2 - Full */}
				    {/* Single set */}
				    {!build.artifact_set_4 &&
			 	 		<div className="artifact-info tooltip" style={{top: artifactSetTwoHeight +'px'}}>
			  			<h4>2-Piece Bonus</h4>
			  			<p>{build.artifact_set_3_two_piece}</p>
			  			<h4>4-Piece Bonus</h4>
			  			<p>{build.artifact_set_3_four_piece}</p>
			  		</div>}

				    {/* Split set */}
				    {build.artifact_set_4 &&
			 	 		<div className="artifact-info tooltip" style={{top: artifactSetTwoHeight +'px'}}>
			  			<h4>{build.artifact_set_3}</h4>
			  			<p>{build.artifact_set_3_two_piece}</p>
			  			<h4>{build.artifact_set_4}</h4>
			  			<p>{build.artifact_set_4_two_piece}</p>
			  		</div>}

						{/* Artifact Combination 3 - Full */}
				    {build.artifact_set_5 &&
						<div className="build-section tooltip-on-hover" ref={elementThreeRef}>

							{/* Artifact Set Single Image */}
							{build.artifact_set_5 && !build.artifact_set_6 &&
	        		<img className="artifact-icon"  src={"./images/artifacts/flowers/" + build.artifact_set_5 +" Flower.webp"}/>}

	        		{/* Artifact Set Split Multi Image (double) */}
							{build.artifact_set_5 && build.artifact_set_6 &&
							<>
	        			<img className="artifact-icon-top" src={"./images/artifacts/flowers/" + build.artifact_set_5 +" Flower.webp"}/>
	        			<img className="artifact-icon-bottom" src={"./images/artifacts/flowers/" + build.artifact_set_6 +" Flower.webp"}/>
	        		</>}

	        		{/* Artifact Set Split Multi Image (split) */}
							{/*	{build.artifact_set_1 && build.artifact_logic === 'AND' &&
							<>
							<div className="clipping-mask-top">
	        			<img className="artifact-icon-split"  src={"./images/artifacts/flowers/" + build.artifact_set_1 +" Flower.webp"}/>
	        		</div>
	        		<div className="clipping-mask-bottom">
	        			<img className="artifact-icon-split"  src={"./images/artifacts/flowers/" + build.artifact_set_2 +" Flower.webp"}/>
	        		</div>
	        		</>}*/}

				      <div className="build-section-text">
					      <h4>Alternative</h4>
				        <ul>
			          	{build.artifact_set_5 && 
			          	<li className={selectedArtifactSet.includes(build.artifact_set_5) ? 'highlighted' : ''}>
			          		{build.artifact_set_5}{build.artifact_set_6 && <span className="artifact-logic"> ×2</span>}
			          	</li>}
			          	{build.artifact_set_6 &&
			          	<li className={selectedArtifactSet.includes(build.artifact_set_6) ? 'highlighted' : ''}>
			          		{build.artifact_set_6}<span className="artifact-logic"> ×2</span>
			          	</li>}
				        </ul>
				      </div>
			      </div>}{/* End Artifact Set 3 - Full */}

				    {/* Tooltip - Artifact Set 3 - Full */}
				    {/* Single set */}
				    {!build.artifact_set_6 &&
			 	 		<div className="artifact-info tooltip" style={{top: artifactSetThreeHeight +'px'}}>
			  			<h4>2-Piece Bonus</h4>
			  			<p>{build.artifact_set_5_two_piece}</p>
			  			<h4>4-Piece Bonus</h4>
			  			<p>{build.artifact_set_5_four_piece}</p>
			  		</div>}

				    {/* Split set */}
				    {build.artifact_set_6 &&
			 	 		<div className="artifact-info tooltip" style={{top: artifactSetThreeHeight +'px'}}>
			  			<h4>{build.artifact_set_5}</h4>
			  			<p>{build.artifact_set_5_two_piece}</p>
			  			<h4>{build.artifact_set_6}</h4>
			  			<p>{build.artifact_set_6_two_piece}</p>
			  		</div>}

				  </div>}{/* End Alternative Artifact Sets Wrapper: Full view */}

				{/* Alternative Artifact Sets Wrapper: Minimal view (Images only) */}
			    {build.artifact_set_3 && filterApplied &&
	      	<div className="artifact-set-alternative">

	      		{/* Artifact Option 2 - Minimal */}
	      		{build.artifact_set_3 &&
		        <img className="artifact-icon-alt-small" src={"./images/artifacts/flowers/" + build.artifact_set_3 +" Flower.webp"}/>}

						{/* Artifact Option 3 - Minimal */}
			    	{build.artifact_set_5 &&
		        <img className="artifact-icon-alt-small" src={"./images/artifacts/flowers/" + build.artifact_set_5 +" Flower.webp"}/>}

			    </div>}{/* End Alternative Artifact Sets Wrapper - Minimal view */}

			  </>}

				

	    {/* About / Description / Note */}
      	{showAbout && 
      	<>
				<div className="note">
	      	<div className="build-section">
	      		<img className="artifact-icon" src={"./images/artifacts/plumes/" + build.artifact_set_1 +" Plume.webp"}/>
	      		{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Tutorial.webp"}/>*/}
	      		<div className="build-section-text">
		      		<h4>About</h4>
				      <p>{build.note ? build.note : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the'}</p>  
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
	      		<img className="artifact-icon-simple"  src={"./images/artifacts/Icon Substats.webp"}/>
		      	<div className="build-section-text">
			      <h4>Substats Priority</h4>
			        <ol>
			          {build.substats_1 && <li className={selectedSubstats.includes(build.substats_1) ? 'highlighted' : ''}>{build.substats_1}</li>}
			          {build.substats_2 && <li className={selectedSubstats.includes(build.substats_2) ? 'highlighted' : ''}>{build.substats_2}</li>}
			          {build.substats_3 && <li className={selectedSubstats.includes(build.substats_3) ? 'highlighted' : ''}>{build.substats_3}</li>}
			          {build.substats_4 && <li className={selectedSubstats.includes(build.substats_4) ? 'highlighted' : ''}>{build.substats_4}</li>}
			          {build.substats_5 && <li className={selectedSubstats.includes(build.substats_5) ? 'highlighted' : ''}>{build.substats_5}</li>}
			          {build.substats_6 && <li className={selectedSubstats.includes(build.substats_6) ? 'highlighted' : ''}>{build.substats_6}</li>}
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
		      	<img className="artifact-icon-simple" src={"./images/artifacts/Icon Energy Recharge.webp"}/>
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

      </div>{/* End Build content wrapper */}
      <div className="clear"></div>
    </div>
	);
}