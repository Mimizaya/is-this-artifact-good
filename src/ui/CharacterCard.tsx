import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Build } from '../types/types';

export default function CharacterCard({
  build,
  buildSectionsVisible,
  selectedCharacter,
  selectedArtifactSet,
  selectedSands,
  selectedGoblet,
  selectedCirclet,
  selectedSubstats,
} : {
  build: Build;
  buildSectionsVisible: string[];
  selectedCharacter: any;
  selectedArtifactSet: any;
  selectedSands: any;
  selectedGoblet: any;
  selectedCirclet: any;
  selectedSubstats: any;
}) {

	// REFS
		const elementOneRef = useRef<HTMLInputElement>(null);
	  const elementTwoRef = useRef<HTMLInputElement>(null);
	  const elementThreeRef = useRef<HTMLInputElement>(null);

	// Calculate and set tooltip positions
 		const [artifactSetOneHeight, setArtifactSetOneHeight] = useState<number>();
 		const [artifactSetTwoHeight, setArtifactSetTwoHeight] = useState<number>();

		useLayoutEffect(() => {
			const offset = 5;
			const artifactOne = elementOneRef.current;
			const artifactTwo = elementTwoRef.current;

			if(artifactOne) {
				const artifactOneHeight = artifactOne.offsetHeight;
				setArtifactSetOneHeight(artifactOneHeight - offset);
			}
			if(artifactTwo) {
				const artifactTwoHeight = artifactTwo.offsetHeight;
				setArtifactSetTwoHeight(artifactTwoHeight - offset);
			}
			
		}, []);

	// Set up checks for filters for conditional rendering
		const filterApplied = buildSectionsVisible.some(section => section !== 'All');
		const showArtifactSets = buildSectionsVisible.includes('Artifact Sets') || buildSectionsVisible.includes('All');
		const showAbout = buildSectionsVisible.includes('About') || buildSectionsVisible.includes('All');
		const showSands = buildSectionsVisible.includes('Sands') || buildSectionsVisible.includes('All');
		const showGoblet = buildSectionsVisible.includes('Goblet') || buildSectionsVisible.includes('All');
		const showCirclet = buildSectionsVisible.includes('Circlet') || buildSectionsVisible.includes('All');
		const showSubstats = buildSectionsVisible.includes('Substats') || buildSectionsVisible.includes('All');
		const showERRequirement = buildSectionsVisible.includes('ER Requirement') || buildSectionsVisible.includes('All');

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
      <div className={`rarity-${build.rarity} build-header`}>
				{/*<img className="character-element" src={"./images/elements/" + build.element + ".webp"} alt={build.element}/>*/}

				<img className="character-element" src={"./images/elements/" + build.element + ".webp"} alt={build.element}/>

				<div className="character-banner-wrapper">
					<img className="character-banner" src={"./images/characters/" + build.character_name + " Banner.webp"} alt={build.element}/>
				</div>

				{build.character_name.includes('Traveler') && !filterApplied
					?
					<>
						<img className="character-portrait" src={"./images/characters/Aether.webp"} alt={build.character_name}/>
						<img className="character-portrait-two" src={"./images/characters/Lumine.webp"} alt={build.character_name}/>
					</>
					:
					<img className="character-portrait" src={"./images/characters/" + build.character_name + ".webp"} alt={build.character_name}/>
				}
        
        <div className="character-title">
        	<h2 className={selectedCharacter.includes(build.character_name) ? 'highlighted' : ''}>{build.character_name}</h2>
        	<h3 className="build-name">{build.build_name}</h3>
        </div>
{/*        <div className="artifact-set-images">
        	<img className="artifact-set-image" src={"./images/artifacts/" + build.artifact_set + " Flower.webp"} alt={build.artifact_set}/>
        	<br />
        	<img className="artifact-set-image-2" src={"./images/artifacts/" + build.artifact_set + " Flower.webp"} alt={build.artifact_set}/>
        </div>*/}
      </div>



      <div className="build-content">
      	<div className="constellation">
      		{/*<img src={"./images/constellations/" + build.character_name +" Constellation.webp"}/>*/}
      		{/*<img src={"./images/artifacts/flowers/" + build.artifact_set +" Flower.webp"}/>*/}
      	</div>


      	{showArtifactSets &&
      	<>
				{/* BUILD ENTRY - ARTIFACT SET */}
      	<div className={build.artifact_set_2 && build.artifact_logic === 'OR' ? 'artifact-set multiple' : 'artifact-set'}>
					<div className="build-content-entry tooltip-on-hover" ref={elementOneRef}>
						<div className="artifact-icon-wrapper">
	        		<img className="artifact-icon"  src={"./images/artifacts/flowers/" + build.artifact_set +" Flower.webp"}/>
			      </div>

			      <div className="build-content-entry-content">
				      <h4>Artifact Set{build.artifact_set_2 && build.artifact_logic === 'AND' && 's'}</h4>
			        <ul>
		          	{build.artifact_set && 
		          	<li className={selectedArtifactSet.includes(build.artifact_set) ? 'highlighted' : ''}>
		          		{build.artifact_set}{build.artifact_logic === 'AND' && ' ×2'}
		          	</li>}
		          	{build.artifact_set_2 && build.artifact_logic === 'AND' &&
		          	<li className={selectedArtifactSet.includes(build.artifact_set) ? 'highlighted' : ''}>
		          		{build.artifact_set_2} ×2
		          	</li>}
			        </ul>
			      </div>
		      </div>
		 	 		<div className="artifact-info tooltip" style={{top: artifactSetOneHeight +'px'}}>
		  			<h4>2-Piece Bonus</h4>
		  			<p>{build.artifact_set_two_piece}</p>
		  			<h4>4-Piece Bonus</h4>
		  			<p>{build.artifact_set_four_piece}</p>
		  		</div>
		     </div>

				{/* BUILD ENTRY - ALTERNATIVE ARTIFACT SETS - FULL INFO */}
			    {build.artifact_set_2 && build.artifact_logic === 'OR' && !filterApplied &&
	      	<div className="artifact-set-alternative">
						<div className="build-content-entry tooltip-on-hover" ref={elementTwoRef}>
							<div className="artifact-icon-wrapper">
		        		<img className="artifact-icon" src={"./images/artifacts/flowers/" + build.artifact_set_2 +" Flower.webp"}/>
				      </div>
				      <div className="build-content-entry-content">
					      <h4>Alternative</h4>
				        <ul>
			          	{build.artifact_set_2 && 
			          	<li className={selectedArtifactSet.includes(build.artifact_set_2) ? 'highlighted' : ''}>
			          		{build.artifact_set_2}
			          	</li>}
				        </ul>
				      </div>
			      </div>
			 	 		<div className="artifact-info tooltip-alt" style={{top: artifactSetTwoHeight +'px'}}>
			  			<h4>2-Piece Bonus</h4>
			  			<p>{build.artifact_set_2_two_piece}</p>
			  			<h4>4-Piece Bonus</h4>
			  			<p>{build.artifact_set_2_four_piece}</p>
			  		</div>

					{/* BUILD ENTRY - ALTERNATIVE ARTIFACT SETS */}
			    {build.artifact_set_3 && build.artifact_logic_2 === 'OR' &&
						<div className="build-content-entry" ref={elementThreeRef}>
							<div className="artifact-icon-wrapper">
		        		<img className="artifact-icon" src={"./images/artifacts/flowers/" + build.artifact_set_3 +" Flower.webp"}/>
				      </div>
				      <div className="build-content-entry-content">
					      <h4>Alternative</h4>
				        <ul>
			          	{build.artifact_set_3 && 
			          	<li className={selectedArtifactSet.includes(build.artifact_set_3) ? 'highlighted' : ''}>
			          		{build.artifact_set_3}
			          	</li>}
				        </ul>
				      </div>
			      </div>}

			    </div>}
		     	</>
		   		}

				{/* BUILD ENTRY - ALTERNATIVE ARTIFACT SETS - PICTURES ONLY */}
			    {build.artifact_set_2 && build.artifact_logic === 'OR' && filterApplied && showArtifactSets &&
			    <>
	      	<div className="artifact-set-alternative">

						<div className="build-content-entry tooltip-on-hover" ref={elementTwoRef}>
							<div className="artifact-icon-wrapper">
		        		<img className="artifact-icon" src={"./images/artifacts/flowers/" + build.artifact_set_2 +" Flower.webp"}/>
				      </div>
			      </div>

					{/* BUILD ENTRY - ALTERNATIVE ARTIFACT SETS */}
			    {build.artifact_set_3 && build.artifact_logic_2 === 'OR' &&
						<div className="build-content-entry" ref={elementThreeRef}>
							<div className="artifact-icon-wrapper">
		        		<img className="artifact-icon" src={"./images/artifacts/flowers/" + build.artifact_set_3 +" Flower.webp"}/>
				      </div>
			      </div>}

			    </div>
		     	</>
		   		}


      	{showAbout && 
      	<>
				{/* BUILD ENTRY - NOTE/DESCRIPTION */}
				<div className="note">
	      	<div className="build-content-entry">
	      		<img className="artifact-icon" src={"./images/artifacts/plumes/" + build.artifact_set +" Plume.webp"}/>
	      		{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Tutorial.webp"}/>*/}
	      		<div className="build-content-entry-content">
		      		<h4>About</h4>
				      <p>{build.note ? build.note : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the'}</p>  
			      </div>
			  	</div>
	      </div>
		    </>
		   	}

	      <div className="artifact-types">

	      	{showSands &&
	      	<>
		      {/* BUILD ENTRY - SANDS */}
		      <div className="build-content-entry">
	        	<img className="artifact-icon"  src={"./images/artifacts/sands/" + build.artifact_set +" Sands.webp"}/>
	        	{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Sands.webp"}/>*/}
	        	<div className="build-content-entry-content">
			      	<h4>Sands</h4>
			        <ol>
			          {build.sands && <li className={selectedSands.includes(build.sands) ? 'highlighted' : ''}>{build.sands}</li>}
			          {build.sands_2 && <li className={selectedSands.includes(build.sands_2) ? 'highlighted' : ''}>{build.sands_2}</li>}
			          {build.sands_3 && <li className={selectedSands.includes(build.sands_3) ? 'highlighted' : ''}>{build.sands_3}</li>}
			        </ol>
			      </div>
			     </div>
			    </>
			   	}


	      	{showGoblet && 
	      	<>
		      {/* BUILD ENTRY - GOBLET */}
		      <div className="build-content-entry">
	        	<img className="artifact-icon"  src={"./images/artifacts/goblets/" + build.artifact_set +" Goblet.webp"}/>
	        	{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Goblet.webp"}/>*/}
	        	<div className="build-content-entry-content">
		      		<h4>Goblet</h4>
		        	<ol>
		          	{build.goblet && <li className={selectedGoblet.includes(build.goblet) ? 'highlighted' : ''}>{build.goblet}</li>}
		          	{build.goblet_2 && <li className={selectedGoblet.includes(build.goblet_2) ? 'highlighted' : ''}>{build.goblet_2}</li>}
		        	</ol>
			      </div>
		      </div>
			    </>
			   	}

	      	{showCirclet && 
	      	<>
					{/* BUILD ENTRY - CIRCLET */}
					<div className="build-content-entry">
	        	<img className="artifact-icon"  src={"./images/artifacts/circlets/" + build.artifact_set +" Circlet.webp"}/>
						{/*<img className="artifact-icon"  src={"./images/artifacts/Icon Circlet.webp"}/>*/}
			      <div className="build-content-entry-content">
				      <h4>Circlet</h4>
			        <ol>
			          {build.circlet && <li className={selectedCirclet.includes(build.circlet) ? 'highlighted' : ''}>{build.circlet}</li>}
			          {build.circlet_2 && <li className={selectedCirclet.includes(build.circlet_2) ? 'highlighted' : ''}>{build.circlet_2}</li>}
			          {build.circlet_3 && <li className={selectedCirclet.includes(build.circlet_3) ? 'highlighted' : ''}>{build.circlet_3}</li>}
			        </ol>
			      </div>
		      </div>
		      </>
			   	}

	      </div>			    


      	{showSubstats && 
      	<>
	      {/* BUILD ENTRY - SUBSTATS */}
	      <div className="substats">
	      	<div className="build-content-entry">
	      		<img className="artifact-icon-simple"  src={"./images/artifacts/Icon Substats.webp"}/>
		      	<div className="build-content-entry-content">
			      <h4>Substats Priority</h4>
			        <ol>
			          {build.substats && <li className={selectedSubstats.includes(build.substats) ? 'highlighted' : ''}>{build.substats}</li>}
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


      	{showERRequirement && 
      	<>
	      <div className="er-requirements">
	      	<div className="build-content-entry">
		      	<img className="artifact-icon-simple" src={"./images/artifacts/Icon Energy Recharge.webp"}/>
		      	<div className="build-content-entry-content">
				      <h4>ER Requirement</h4>
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

      </div>
      <div className="clear"></div>
    </div>
	);
}