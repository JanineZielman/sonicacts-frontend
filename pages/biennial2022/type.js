const Type = () => {
	const text = "Sonic Acts Biennial 2022 _ Sonic Acts Biennial 2022"
	return(
		<section className="festival">
			<div className="festival-hero-bg type">
				<div className={`title`}>
					<div className={`layer1`}>
						{(text).split("").map(function(char, index){
						return <span className={``} aria-hidden="true" key={index}>{char}</span>;
						})}
					</div>
					<div className={`layer2`}>
						{(text).split("").map(function(char, index){
						return <span className={`letter`} aria-hidden="true" key={index}>{char}</span>;
						})}
					</div>
					<div className={`layer3`}>
						{(text).split("").map(function(char, index){
						return <span className={``} aria-hidden="true" key={index}>{char}</span>;
						})}
					</div>
				</div>
			</div>
		</section>
	)
}

export default Type