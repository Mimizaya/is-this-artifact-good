export interface Character {
	name: string;
	alias: string | null;
	rarity: number;
	element: string;
}
export interface RawBuild {
	// Basic info
	ID: number;
	character_name: string;
	build_name: string;

	// Artifact option 1
	artifact_set_1_label: string;
	artifact_set_1: string;
	artifact_set_2: string;

	// Artifact option 2
	artifact_set_3_label: string;
	artifact_set_3: string;
	artifact_set_4: string;

	// Artifact option 3
	artifact_set_5_label: string;
	artifact_set_5: string;
	artifact_set_6: string;

	// Artifact option 4
	artifact_set_7_label: string;
	artifact_set_7: string;
	artifact_set_8: string;

	// Artifact option 5
	artifact_set_9_label: string;
	artifact_set_9: string;
	artifact_set_10: string;

	// Sands options
	sands_1: string;
	sands_2: string;
	sands_3: string;

	// Goblet options
	goblet_1: string;
	goblet_2: string;

	// Circlet options
	circlet_1: string;
	circlet_2: string;
	circlet_3: string;

	// Sands options
	substats_1: string;
	substats_2: string;
	substats_3: string;
	substats_4: string;
	substats_5: string;
	flatstats_1: string;
	flatstats_2: string;

	// Energy Recharge
	er_min: number | 'n/a' | '';
	er_max: number | 'n/a' | '';

	// About
	note: string;

}

export interface FullBuild extends RawBuild {
	rarity: number;
	element: string;
	banner_offset: number | undefined;
	artifact_set_1_two_piece: string;
	artifact_set_1_four_piece: string;
	artifact_set_2_two_piece: string | null;
	artifact_set_3_two_piece: string | null;
	artifact_set_3_four_piece: string | null;
	artifact_set_4_two_piece: string | null;
	artifact_set_5_two_piece: string | null;
	artifact_set_5_four_piece: string | null;
	artifact_set_6_two_piece: string | null;
	artifact_set_7_two_piece: string | null;
	artifact_set_7_four_piece: string | null;
	artifact_set_8_two_piece: string | null;
	artifact_set_9_two_piece: string | null;
	artifact_set_9_four_piece: string | null;
	artifact_set_10_two_piece: string | null;
}

export interface ArtifactSet {
	name: string;
	alias: string | null;
	two_piece: string;
	four_piece: string;
	domain: string | null;
}
export interface SelectedFilters {
  selectedCharacter: string[];
  selectedArtifactSet: string[];
  selectedSands: string[];
  selectedGoblet: string[];
  selectedCirclet: string[];
  selectedSubstats: string[];
  selectedElements: string[];
};

export interface FilterTab {
  id: number;
  default_name: string;
  name: string[] | null;
};

export interface SavedFilters {
  [key: number]: {
    selectedCharacter: string[];
    selectedArtifactSet: string[];
    selectedSands: string[];
    selectedGoblet: string[];
    selectedCirclet: string[];
    selectedSubstats: string[];
    selectedElements: string[];
  };
}