// Type definitions
import { FullBuild, ArtifactSet} from '../types/types';

// UI
import Tooltip from './Tooltip.tsx'

export default function Artifact({
	number, 
	build, 
	selectedArtifactSet,
	numberOfArtifactOptions,
	minimal,
	matchingSets,
} : {
	number: number;
	build: FullBuild;
	selectedArtifactSet: string[];
	numberOfArtifactOptions: number;
	minimal: boolean,
	matchingSets: string[];
}) {

	// Convert numbers for artifact set numbers class 
		let newNumber;

		if(number === 1) {
			newNumber = 1;
		} 
		else if(number === 3) {
			newNumber = 2;
		} 
		else if(number === 5) {
			newNumber = 3;
		}
		else if(number === 7) {
			newNumber = 4;
		}		
		else if(number === 9) {
			newNumber = 5;
		}

	// Determine tooltip alignment
		const determineTooltipAlignment = () => {
			if(numberOfArtifactOptions === 1 && number === 1) {
				return 'left'
			}
			if(numberOfArtifactOptions === 2) {
				if(number === 1) {
					return 'left'
				}
				else if(number === 3) {
					return 'right'
				}
			}
			if(numberOfArtifactOptions === 3) {
				if(number === 1) {
					return 'left'
				}
				else if(number === 3) {
					return 'left'
				}
				else if(number === 5) {
					return 'right'
				}
			}
			if(numberOfArtifactOptions === 4) {
				if(number === 1) {
					return 'left'
				}
				else if(number === 3) {
					return 'right'
				}
				else if(number === 5) {
					return 'left'
				}
				else if(number === 7) {
					return 'right'
				}
			}
			if(numberOfArtifactOptions === 5) {
				if(number === 1) {
					return 'left'
				}
				else if(number === 3) {
					return 'left'
				}
				else if(number === 5) {
					return 'right'
				}
				else if(number === 7) {
					return 'left'
				}
				else if(number === 9) {
					return 'right'
				}
			}
			return '';
		}
		const toolTipAlignment = determineTooltipAlignment()

	// Artifact option label 
		const artifactSet_label = build[`artifact_set_${number}_label` as keyof FullBuild];

	// Artifact set 1 info 
		// 1. Artifact name
			const artifactSet_1: ArtifactSet["name"] = String(build[`artifact_set_${number}` as keyof FullBuild] ?? '');
		// 2. Artifact 2-piece bonus description
			const artifactSet_1_two_piece: ArtifactSet["two_piece"] = String(build[`artifact_set_${number}_two_piece` as keyof FullBuild] ?? '');
		// 3. Artifact 4-piece bonus description
			const artifactSet_1_four_piece: ArtifactSet["four_piece"] = String(build[`artifact_set_${number}_four_piece` as keyof FullBuild] ?? '');

	// Artifact set 2 info 
		// 1. Artifact name
			const artifactSet_2: ArtifactSet["name"] = String(build[`artifact_set_${number+1}` as keyof FullBuild] ?? '');
		// 2. Artifact 2-piece bonus description
			const artifactSet_2_two_piece: ArtifactSet["two_piece"] = String(build[`artifact_set_${number+1}_two_piece` as keyof FullBuild] ?? '');

	return (
		<>
		{/* Artifact Alternative Option 1 - Minimal */}
		{minimal &&
		<div className={`artifact-option-${newNumber}`}>

			{/* Artifact Set Image */}
			{artifactSet_1 && !artifactSet_2 &&
    	<img className="artifact-alternative-icon tooltip-on-hover" src={"./images/artifacts/flowers/" + artifactSet_1 +" Flower.webp"}/>}
	    
			{/* Artifact Set Split Image */}
			{artifactSet_1 && artifactSet_2 &&
			<>
			<div className="artifact-alternative-split tooltip-on-hover">
				<div className="clipping-mask-top">
	    		<img className="artifact-alternative-icon" src={"./images/artifacts/flowers/" + artifactSet_1 +" Flower.webp"}/>
		    </div>
		    <div className="clipping-mask-bottom">
		    	<img className="artifact-alternative-icon" src={"./images/artifacts/flowers/" + artifactSet_2 +" Flower.webp"}/>
		  	</div>
	  	</div>
	  	</>}

	    <Tooltip 
	    	toolTipAlignment={toolTipAlignment}
	    	artifactSet_1={artifactSet_1}
	    	artifactSet_1_two_piece={artifactSet_1_two_piece}
	    	artifactSet_1_four_piece={artifactSet_1_four_piece}
	    	artifactSet_2={artifactSet_2}
	    	artifactSet_2_two_piece={artifactSet_2_two_piece}
	    />
    </div>}

		{!minimal &&
		<div className={`artifact-set option-${newNumber}`}>
			<div className="build-section tooltip-on-hover">

				{/* Artifact Set Single Image */}
				{artifactSet_1 && !artifactSet_2 &&
	  		<img className="artifact-icon" src={"./images/artifacts/flowers/" + artifactSet_1 +" Flower.webp"}/>}

	  		{/* Artifact Set Split Multi Image (diagonal) */}
				{artifactSet_1 && artifactSet_2 &&
				<div className="artifact-icons-double">
	  			<img className="artifact-icon-top" src={"./images/artifacts/flowers/" + artifactSet_1 +" Flower.webp"}/>
	  			<img className="artifact-icon-bottom" src={"./images/artifacts/flowers/" + artifactSet_2 +" Flower.webp"}/>
	  		</div>}

	  		{/* Artifact Set Text */}
	      <div className="build-section-text">
		      <h4>{
		      	artifactSet_label ? artifactSet_label : 
		      	`${number < 3 ? 'Recommended Set' : 'Alternative Set'}${artifactSet_2 ? 's' : ''}`}
		      </h4>
	        <ul>
	        	{artifactSet_1 && 
	        	<li className={
	        		selectedArtifactSet.includes(artifactSet_1.toString()) ? 'highlighted' : 
	        		matchingSets?.includes(artifactSet_1.toString()) && artifactSet_2 ? 'highlighted partial' : 
	        		''}>
	        		{artifactSet_1}{artifactSet_2 && <span className="artifact-logic">&nbsp;×2</span>}
	        	</li>}
	        	{artifactSet_2 && artifactSet_2 &&
	        	<li className={selectedArtifactSet.includes(artifactSet_2.toString()) ? 'highlighted' : 
	        		matchingSets?.includes(artifactSet_2.toString()) ? 'highlighted partial' :
	        		''}>
	        		{artifactSet_2}<span className="artifact-logic">&nbsp;×2</span>
	        	</li>}
	        </ul>
	      </div>
	    </div>

	    <Tooltip 
	    	toolTipAlignment={toolTipAlignment}
	    	artifactSet_1={artifactSet_1}
	    	artifactSet_1_two_piece={artifactSet_1_two_piece}
	    	artifactSet_1_four_piece={artifactSet_1_four_piece}
	    	artifactSet_2={artifactSet_2}
	    	artifactSet_2_two_piece={artifactSet_2_two_piece}
	    />
		</div>}
		</>
	);
}