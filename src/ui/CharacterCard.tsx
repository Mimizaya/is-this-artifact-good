import { useEffect, useRef } from 'react';
import { Build } from '../types/types';

export default function CharacterCard({
  build,
  selectedCharacter,
  selectedArtifactSet,
  selectedSands,
  selectedGoblet,
  selectedCirclet,
  selectedSubstats,
} : {
  build: Build;
  selectedCharacter: any;
  selectedArtifactSet: any;
  selectedSands: any;
  selectedGoblet: any;
  selectedCirclet: any;
  selectedSubstats: any;
}) {

 
	// Ensure equal heights on Artifact Set and Alternatives sections
	  const elementOneRef = useRef<HTMLInputElement>(null);
	  const elementTwoRef = useRef<HTMLInputElement>(null);
	  const elementThreeRef = useRef<HTMLInputElement>(null);

		useEffect(() => {
	    const elementOne = elementOneRef.current;
	    const elementTwo = elementTwoRef.current;
	    const elementThree = elementThreeRef.current;

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
	  }, []);

	return (
		<div className="character-card">
      <div className={`rarity-${build.rarity} build-header`}>
				{/*<img className="character-element" src={"./images/elements/" + build.element + ".webp"} alt={build.element}/>*/}

				<img className="character-element" src={"./images/elements/" + build.element + ".webp"} alt={build.element}/>

				<div className="character-banner-wrapper">
					<img className="character-banner" src={"./images/characters/" + build.character_name + " Banner.webp"} alt={build.element}/>
				</div>

        <img className="character-portrait" src={"./images/characters/" + build.character_name + ".webp"} alt={build.character_name}/>
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

				{/* BUILD ENTRY - ARTIFACT SET */}
      	<div className={build.artifact_set_2 && build.artifact_logic === 'OR' ? 'artifact-set multiple' : 'artifact-set'}>
					<div className="build-content-entry" ref={elementOneRef}>
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
		     </div>

				{/* BUILD ENTRY - ALTERNATIVE ARTIFACT SETS */}
		    {build.artifact_set_2 && build.artifact_logic === 'OR' &&
      	<div className="artifact-set-alternative">
					<div className="build-content-entry" ref={elementTwoRef}>
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


	      <div className="artifact-types">
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
	      </div>


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


      </div>
      <div className="clear"></div>
    </div>
	);
}