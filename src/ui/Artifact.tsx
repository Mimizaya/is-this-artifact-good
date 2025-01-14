import { useState, useEffect, useRef } from 'react';

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
	isMobile,
	tooltipOpen,
	toggleTooltipOpen,
} : {
	number: number;
	build: FullBuild;
	selectedArtifactSet: string[];
	numberOfArtifactOptions: number;
	minimal: boolean;
	matchingSets: string[];
	isMobile: boolean;
	tooltipOpen: boolean;
	toggleTooltipOpen: any;
}) {

	// ARTIFACT OPTION NUMBER CONVERSION 
	// ——————————————————————————————————————————————————————————————————————————————————————————
	// #1 Declare newNumber var 
		let newNumber;
	// #2 Assign number to newNumber var based on artifact_set_# (number prop) 
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


	// TOOLTIP ALIGNMENT
	// ——————————————————————————————————————————————————————————————————————————————————————————	
	// #1 Function to determine alignment based on number of sets 
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
	// #2 Set alignment to variable 
		const toolTipAlignment = determineTooltipAlignment()


	// ARTIFACT LABEL
	// ——————————————————————————————————————————————————————————————————————————————————————————
	// #1 Assign label to variable 
		const artifactSet_label = build[`artifact_set_${number}_label` as keyof FullBuild];


	// ARTIFACT SET 1 INFO
	// ——————————————————————————————————————————————————————————————————————————————————————————
	// #1 Artifact name 
		const artifactSet_1: ArtifactSet["name"] = String(build[`artifact_set_${number}` as keyof FullBuild] ?? '');
	// #2 Artifact 2-piece bonus description 
		const artifactSet_1_two_piece: ArtifactSet["two_piece"] = String(build[`artifact_set_${number}_two_piece` as keyof FullBuild] ?? '');
	// #3 Artifact 4-piece bonus description 
		const artifactSet_1_four_piece: ArtifactSet["four_piece"] = String(build[`artifact_set_${number}_four_piece` as keyof FullBuild] ?? '');


	// ARTIFACT SET 2 INFO (if applicable)
	// ——————————————————————————————————————————————————————————————————————————————————————————
	// #1 Artifact name 
		const artifactSet_2: ArtifactSet["name"] = String(build[`artifact_set_${number+1}` as keyof FullBuild] ?? '');
	// #2 Artifact 2-piece bonus description 
		const artifactSet_2_two_piece: ArtifactSet["two_piece"] = String(build[`artifact_set_${number+1}_two_piece` as keyof FullBuild] ?? '');


	// ARTIFACT TOOLTIP (Mobile specific)
	// ——————————————————————————————————————————————————————————————————————————————————————————
  // 1# Function to toggle visibility based on mobile 
  	const [active, setActive] = useState(true);
	  const toggleVisible = () => {
	    if (isMobile) {
	    	if(tooltipOpen) {
		      setActive(false);
		      toggleTooltipOpen()
	    	}
		    
	    	if(!tooltipOpen) {
		      setActive(true);
		      toggleTooltipOpen()
	    	}
		  }
	  };
  // 2# Close the tooltip when clicking outside the tooltip element 
	  const tooltipRef = useRef<HTMLDivElement | null>(null);
	  useEffect(() => {
	    const handleClickOutside = (event: any) => {
	      // Check if the clicked target is outside the tooltipRef
	      if (isMobile && tooltipRef.current && !tooltipRef.current.contains(event.target)) {
	        setActive(false); // Close the tooltip
	      }
	    };

	    // Attach the event listener
	    document.addEventListener('click', handleClickOutside);

	    // Cleanup the event listener on component unmount
	    return () => {
	      document.removeEventListener('click', handleClickOutside);
	    };
	  }, []); // Empty dependency array, so this effect runs once after the initial render

	  // Effect for setting active to false on mobile
	  useEffect(() => {
	    if (isMobile) {
	      setActive(false);
	    }
	  }, [isMobile]); // Only run when `isMobile` changes

	return (
		<>
		{/* Artifact Alternative Option 1 - Minimal */}
		{minimal &&
		<div 
			ref={tooltipRef}
			onClick={() => toggleVisible()}
			className={`artifact-option-${newNumber}`}>

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
	    	active={active}
	    	toolTipAlignment={toolTipAlignment}
	    	artifactSet_1={artifactSet_1}
	    	artifactSet_1_two_piece={artifactSet_1_two_piece}
	    	artifactSet_1_four_piece={artifactSet_1_four_piece}
	    	artifactSet_2={artifactSet_2}
	    	artifactSet_2_two_piece={artifactSet_2_two_piece}
	    />
    </div>}

		{!minimal &&
		<div 
			ref={tooltipRef}
			onClick={() => toggleVisible()}
			className={`artifact-set option-${newNumber}`}>

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
	    	active={active}
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