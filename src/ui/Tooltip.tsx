
// Functions
import { parseText } from '../utility/functions';

// Type definitions
import { ArtifactSet } from '../types/types';

export default function Tooltip({
	active,
	toolTipAlignment,
	artifactSet_1, 
	artifactSet_1_two_piece,
	artifactSet_1_four_piece,
	artifactSet_2,
	artifactSet_2_two_piece,
} : {
	active: boolean;
	toolTipAlignment: string;
	artifactSet_1: ArtifactSet["name"];
	artifactSet_1_two_piece: ArtifactSet["two_piece"];
	artifactSet_1_four_piece: ArtifactSet["four_piece"];
	artifactSet_2: ArtifactSet["name"];
	artifactSet_2_two_piece: ArtifactSet["two_piece"];
}) {

	return (
		<>
	    {/* Single set */}
		 	{active &&
		 	<>
	    {!artifactSet_2 &&
		 	<div className={`artifact-info tooltip-${toolTipAlignment}`}>
		 		<div className="tooltip-part">
			 		<img 
			 			src={'./images/artifacts/flowers/' + artifactSet_1 + ' Flower.webp'}
			 		/>
			 		<div className="tooltip-text">
			 			<h3>{artifactSet_1}</h3>
						<h4>2-Piece Bonus</h4>
						<p>{parseText(artifactSet_1_two_piece)}</p>
						<h4>4-Piece Bonus</h4>
						<p>{parseText(artifactSet_1_four_piece)}</p>
			 		</div>
			 	</div>
			</div>}


	    {/* Split set */}
	    {artifactSet_2 &&
		 	<div className={`artifact-info tooltip-${toolTipAlignment}`}>
		 		<div className="tooltip-part">
			 		<img 
			 			src={'./images/artifacts/flowers/' + artifactSet_1 + ' Flower.webp'}
			 		/>
			 		<div className="tooltip-text">
			 			<h3>{artifactSet_1}</h3>
						<h4>2-Piece Bonus</h4>
						<p>{parseText(artifactSet_1_two_piece)}</p>
			 		</div>
			 	</div>

		 		<div className="tooltip-part">
			 		<img
			 			src={'./images/artifacts/flowers/' + artifactSet_2 + ' Flower.webp'}
			 		/>
			 		<div className="tooltip-text">
			 			<h3>{artifactSet_2}</h3>
						<h4>2-Piece Bonus</h4>
						<p>{parseText(artifactSet_2_two_piece)}</p>
			 		</div>
			 	</div>
			</div>}
			
			</>}
		</>
	)
}