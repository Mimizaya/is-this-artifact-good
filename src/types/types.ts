export interface Character {
	name: string;
	rarity: number;
	element: string;
}
export interface Build {
	character_name: string;
	rarity: string;
	element: string;
	build_name: string;
	artifact_set: string;
	artifact_logic: string;
	artifact_set_2: string;
	sands: string;
	sands_2: string;
	goblet: string;
	goblet_2: string;
	circlet: string;
	circlet_2: string;
	circlet_3: string;
	substats: string;
	substats_2: string;
	substats_3: string;
	substats_4: string;
	substats_5: string;
	substats_6: string;
	er_min: string;
	er_max: string;
	note: string;
}
export interface ArtifactSet {
	name: string;
}
export interface ArtifactType {
	name: string;
	stats: string[];
}