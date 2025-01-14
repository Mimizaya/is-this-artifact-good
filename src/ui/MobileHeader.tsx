export default function MobileHeader({
	isMenuOpen, 
	toggleMenu,
} : {
	isMenuOpen: boolean; 
	toggleMenu: () => void;
}) {
	
	return (
    <div id="mobile-header">
      <button className='close-menu' onClick={() => toggleMenu()}>
        {isMenuOpen && <span>&#x2715;</span>}
        {!isMenuOpen && <span>☰</span>}
      </button>
    </div>
	);
}