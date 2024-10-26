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

	return (
		<div className="character-card">
      <div className={`rarity-${build.rarity} build-header`}>
				<img className="character-element" src={"/images/elements/" + build.element + ".webp"} alt={build.element}/>
        <img className="character-portrait" src={"/images/characters/" + build.character_name + ".webp"} alt={build.character_name}/>
        <div className="character-title">
        	<h2 className={selectedCharacter.includes(build.character_name) ? 'highlighted' : ''}>{build.character_name}</h2>
        	<h3 className="build-name">{build.build_name}</h3>
        </div>
      </div>

      <div className="build-content">
      	<div className="constellation">
      		<img src={"/images/constellations/" + build.character_name +" Constellation.webp"}/>
      	</div>
	      <div className="artifact-set">
	      <p>Artifact Set{build.artifact_logic === 'AND' && 's'}</p>
	        <ul>
	          {build.artifact_set && 
	          <li className={selectedArtifactSet.includes(build.artifact_set) ? 'highlighted' : ''}>
	          	{build.artifact_set}{build.artifact_logic === 'AND' && <span className="artifact-logic-and"> x2</span>}
	          	{build.artifact_logic === 'OR' && <span className="artifact-logic-or"> or</span>}</li>}
	          {build.artifact_set_2 && 
	          <li className={selectedArtifactSet.includes(build.artifact_set_2) ? 'highlighted' : ''}>
	          	{build.artifact_set_2}{build.artifact_logic === 'AND' && <span className="artifact-logic-and"> x2</span>}</li>}
	        </ul>
	      </div>

	      <div className="artifact-types">
		      <div className="artifact-type">
		      <p>Sands</p>
		        <ul>
		          {build.sands && <li className={selectedSands.includes(build.sands) ? 'highlighted' : ''}>{build.sands}</li>}
		          {build.sands_2 && <li className={selectedSands.includes(build.sands_2) ? 'highlighted' : ''}>{build.sands_2}</li>}
		        </ul>
		      </div>

		      <div className="artifact-type">
		      <p>Goblet</p>
		        <ul>
		          {build.goblet && <li className={selectedGoblet.includes(build.goblet) ? 'highlighted' : ''}>{build.goblet}</li>}
		          {build.goblet_2 && <li className={selectedGoblet.includes(build.goblet_2) ? 'highlighted' : ''}>{build.goblet_2}</li>}
		        </ul>
		      </div>

		      <div className="artifact-type">
		      <p>Circlet</p>
		        <ul>
		          {build.circlet && <li className={selectedCirclet.includes(build.circlet) ? 'highlighted' : ''}>{build.circlet}</li>}
		          {build.circlet_2 && <li className={selectedCirclet.includes(build.circlet_2) ? 'highlighted' : ''}>{build.circlet_2}</li>}
		          {build.circlet_3 && <li className={selectedCirclet.includes(build.circlet_3) ? 'highlighted' : ''}>{build.circlet_3}</li>}
		        </ul>
		      </div>
	      </div>

	      <div className="substats">
	      <p>Substats Priority</p>
	        <ul>
	          {build.substats && <li className={selectedSubstats.includes(build.substats) ? 'highlighted' : ''}>{build.substats}</li>}
	          {build.substats_2 && <li className={selectedSubstats.includes(build.substats_2) ? 'highlighted' : ''}>{build.substats_2}</li>}
	          {build.substats_3 && <li className={selectedSubstats.includes(build.substats_3) ? 'highlighted' : ''}>{build.substats_3}</li>}
	          {build.substats_4 && <li className={selectedSubstats.includes(build.substats_4) ? 'highlighted' : ''}>{build.substats_4}</li>}
	          {build.substats_5 && <li className={selectedSubstats.includes(build.substats_5) ? 'highlighted' : ''}>{build.substats_5}</li>}
	          {build.substats_6 && <li className={selectedSubstats.includes(build.substats_6) ? 'highlighted' : ''}>{build.substats_6}</li>}
	        </ul>
	      </div>

	      <div className="er-requirements">
		      {build.er_min !== '' &&
		      <>
		      <p>ER Requirement</p>
		        <ul>
		          {build.er_min === 'n/a' && build.er_max === 'n/a' && <li>N/A</li>}
		          {build.er_min !== 'n/a' && build.er_max !== 'n/a' && <li>{build.er_min}&ndash;{build.er_max}%</li>}
		        </ul>
		       </>
		     	}
	      </div>
	      
	      {build.note &&
	      <div className="note">
	      <p>Note</p>
	        <ul>
	          <li>{build.note}</li>
	        </ul>
	      </div>
	      }
      </div>
    </div>
	);
}