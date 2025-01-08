import { useState } from 'react';
import Legal from './Legal.tsx';
export default function Footer() {
	
	const [viewLegal, setViewLegal] = useState<boolean>(false);
	const toggleViewLegal = (bool: boolean) => {
		setViewLegal(bool);
	}

	return (
		<footer>
			<p className="link">For more build info, check out the guides at <a href="https://keqingmains.com" target="_new">keqingmains.com</a>.</p>
			<p>
				Is This Artifact Good? is not affiliated with HoYoverse.<br />
				Genshin Impact, game content and materials are trademarks and copyrights of HoYoverse.
			</p>


			{/*  
			<p onClick={() => toggleViewLegal(true)}>
				Privacy Policy
			</p>
			*/}


			{viewLegal &&
			<Legal 
				toggleViewLegal={toggleViewLegal}
			/>}
		</footer>
	);
}