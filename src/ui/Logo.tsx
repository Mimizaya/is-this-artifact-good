export default function Logo({
	resetFilters
} : {
	resetFilters: (filter: string | null) => void;
}) {
	return (
		<div id="logo" onClick={() => resetFilters(null)}>
			<img src='./images/artifacts/flowers/Crimson Witch of Flames Flower.webp'/>
			<h1>
				<span className="crimson">Crimson</span>
				<span className="witch">Witch</span>
			</h1>
		</div>
	);
}