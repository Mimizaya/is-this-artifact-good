export default function Legal({
	toggleViewLegal,
}: {
	toggleViewLegal: (bool: boolean) => void;
}) {

	return (
		<section id="legal">
			<div id="legal-content">
			<button onClick={() => toggleViewLegal(false)}>X</button>
				<div id="privacy">
					<h2>Privacy Policy</h2>
					<p></p>
				</div>
				<div id="cookies">
					<h2>Cookie Policy</h2>
					<p></p>
				</div>
			</div>
		</section>
	);
}