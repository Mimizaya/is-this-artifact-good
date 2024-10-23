export default function CharacterCards({query}) {
	return (
		<section>
			{query.map(character => (
				<>
					{/* CHARACTER NAME HEADER */}
					<h2>{character.name}</h2>

					{/* CHARACTER PRIMARY BUILD */}
					{character.build_primary.map(build => (
						<>
						<h3>{build.name}</h3>

						{/* Artifact set(s) */}
						<h4>Artifact set</h4>
						<ul>
							{build.artifact_set.map(set => (
								<>
									{/* Always display primary set */}
									<li>{set.primary}</li>

									{/* Display secondary set if not null */}
									{set.secondary !== null &&
									<li>{set.secondary}</li>}
								</>
							))}
						</ul>

						{/* Sands options */}
						<h4>Sands</h4>
						<ul>
							{build.sands.map(stat => (
								<>
									{/* Always display primary stat */}
									<li>{stat.primary}</li>

									{/* Display optional stat if not null */}
									{stat.secondary !== null &&
									<li>{stat.secondary}</li>}
								</>
							))}
						</ul>

						{/* Goblet options */}
						<h4>Sands</h4>
						<ul>
							{build.goblet.map(stat => (
								<>
									{/* Always display primary stat */}
									<li>{stat.primary}</li>

									{/* Display optional stat if not null */}
									{stat.secondary !== null &&
									<li>{stat.secondary}</li>}
								</>
							))}
						</ul>

						{/* Circlet options */}
						<h4>Sands</h4>
						<ul>
							{build.circlet.map(stat => (
								<>
									{/* Always display primary stat */}
									<li>{stat.primary}</li>

									{/* Display optional stat if not null */}
									{stat.secondary !== null &&
									<li>{stat.secondary}</li>}
								</>
							))}
						</ul>

						</>
					))}

					{/* CHARACTER SECONDARY BUILD */}
					{/* (if applicable) */}
					{character.build_secondary?.map(build => (
						<h3>{build.name}</h3>
					))}

					{/* CHARACTER TERTIARY BUILD */}
					{/* (if applicable) */}
					{character.build_tertiary?.map(build => (
						<h3>{build.name}</h3>
					))}
				</>
			))}
		</section>
	);
}