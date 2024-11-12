// Functions
import { parseText } from '../functions/utility'

export default function Tooltip({
	artifactSet_1, 
	artifactSet_1_two_piece,
	artifactSet_1_four_piece,
	artifactSet_2,
	artifactSet_2_two_piece,
	position,
} : {
	artifactSet_1: any;
	artifactSet_1_two_piece: any;
	artifactSet_1_four_piece: any;
	artifactSet_2: any;
	artifactSet_2_two_piece: any;
	position: any,
}) {
	return (
		<>
	    {/* Tooltip - Artifact Set 1 */}
	    {/* Single set */}
	    {!artifactSet_2 &&
		 		<div className="artifact-info tooltip" style={{top: position +'px'}}>
				<h4>2-Piece Bonus</h4>
				<div>{parseText(artifactSet_1_two_piece)}</div>
				<h4>4-Piece Bonus</h4>
				<div>{parseText(artifactSet_1_four_piece)}</div>
			</div>}

	    {/* Split set */}
	    {artifactSet_2 &&
		 		<div className="artifact-info tooltip" style={{top: position +'px'}}>
				<h4>{artifactSet_1}</h4>
				<div>{parseText(artifactSet_1_two_piece)}</div>
				<h4>{artifactSet_2}</h4>
				<div>{parseText(artifactSet_2_two_piece)}</div>
			</div>}
		</>
	)
}