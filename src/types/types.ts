export interface Character {
	name: string;
	rarity: number;
	element: string;
}
export interface Build {
	ID: number;
	character_name: string;
	rarity: string;
	element: string;
	build_name: string;
	artifact_set: string;
	artifact_set_two_piece: string;
	artifact_set_four_piece: string;
	artifact_logic: string;
	artifact_set_2: string;
	artifact_set_2_two_piece: string;
	artifact_set_2_four_piece: string;
	artifact_logic_2: string;
	artifact_set_3: string;
	sands: string;
	sands_2: string;
	sands_3: string;
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
	two_piece: string;
	four_piece: string;
}
export interface ArtifactType {
	name: string;
	stats: string[];
}