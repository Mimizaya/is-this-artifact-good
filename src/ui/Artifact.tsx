// Type definitions
import { FullBuild } from '../types/types';

// UI
import Tooltip from './Tooltip.tsx'

export default function Artifact({
	number, 
	build, 
	selectedArtifactSet,
} : {
	number: number;
	build: FullBuild;
	selectedArtifactSet: string[];
}) {

	// Artifact option label
	const artifactSet_label = build[`artifact_set_${number}_label` as keyof FullBuild];

	// Artifact 1 info
	const artifactSet_1 = build[`artifact_set_${number}` as keyof FullBuild];
	const artifactSet_1_two_piece = build[`artifact_set_${number}_two_piece` as keyof FullBuild];
	const artifactSet_1_four_piece = build[`artifact_set_${number}_four_piece` as keyof FullBuild];

	// Artifact 2 info
	const artifactSet_2 = build[`artifact_set_${number+1}` as keyof FullBuild];
	const artifactSet_2_two_piece = build[`artifact_set_${number+1}_two_piece` as keyof FullBuild];


	return (
		<div className={`artifact-set number-${number}`}>
			<div className="build-section tooltip-on-hover">

				{/* Artifact Set Single Image */}
				{artifactSet_1 && !artifactSet_2 &&
	  		<img className="artifact-icon" src={"./images/artifacts/flowers/" + artifactSet_1 +" Flower.webp"}/>}

	  		{/* Artifact Set Split Multi Image (double) */}
				{artifactSet_1 && artifactSet_2 &&
				<>
	  			<img className="artifact-icon-top" src={"./images/artifacts/flowers/" + artifactSet_1 +" Flower.webp"}/>
	  			<img className="artifact-icon-bottom" src={"./images/artifacts/flowers/" + artifactSet_2 +" Flower.webp"}/>
	  		</>}

	  		{/* Artifact Set Split Multi Image (split) */}
				{/*	{artifactSet_1 && build.artifact_logic === 'AND' &&
				<>
				<div className="clipping-mask-top">
	  			<img className="artifact-icon-split"  src={"./images/artifacts/flowers/" + artifactSet_1 +" Flower.webp"}/>
	  		</div>
	  		<div className="clipping-mask-bottom">
	  			<img className="artifact-icon-split"  src={"./images/artifacts/flowers/" + artifactSet_2 +" Flower.webp"}/>
	  		</div>
	  		</>}*/}

	      <div className="build-section-text">
		      <h4>{
		      	artifactSet_label ? artifactSet_label : 
		      	`${number < 3 ? 'Recommended Set' : 'Alternative Set'}${artifactSet_2 ? 's' : ''}`}
		      </h4>
	        <ul>
	        	{artifactSet_1 && 
	        	<li className={selectedArtifactSet.includes(artifactSet_1.toString()) ? 'highlighted' : ''}>
	        		{artifactSet_1}{artifactSet_2 && <span className="artifact-logic"> ×2</span>}
	        	</li>}
	        	{artifactSet_2 && artifactSet_2 &&
	        	<li className={selectedArtifactSet.includes(artifactSet_2.toString()) ? 'highlighted' : ''}>
	        		{artifactSet_2}<span className="artifact-logic"> ×2</span>
	        	</li>}
	        </ul>
	      </div>
	    </div>

	    <Tooltip 
	    	artifactSet_1={artifactSet_1}
	    	artifactSet_1_two_piece={artifactSet_1_two_piece}
	    	artifactSet_1_four_piece={artifactSet_1_four_piece}
	    	artifactSet_2={artifactSet_2}
	    	artifactSet_2_two_piece={artifactSet_2_two_piece}
	    />
		</div>
	);
}