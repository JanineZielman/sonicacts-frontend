const Poster = () => {
	const text = "Sonic  Acts Bien–nial 20 22  Son ic"
	return(
		<section className="festival biennial-poster">
			<div className="festival-hero-bg type">
				<div className={`title`}>
					<div className={`layer1`}>
						{(text).split("").map(function(char, index){
						return <span className={`letter`} aria-hidden="true" key={index} style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>{char}</span>;
						})}
					</div>
					<div className={`layer2`}>
						{(text).split("").map(function(char, index){
						return <span className={`letter`} aria-hidden="true" key={index} style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>{char}</span>;
						})}
					</div>
					<div className={`layer3`}>
						{(text).split("").map(function(char, index){
						return <span className={`letter`} aria-hidden="true" key={index} style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>{char}</span>;
						})}
					</div>
				</div>
			</div>
		</section>
	)
}

export default Poster