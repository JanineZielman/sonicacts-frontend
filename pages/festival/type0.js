const Type = () => {
	const text = "Sonic Acts Festival 2022 _ Sonic Acts Festival 2022"
	return(
		<section className="festival">
			<div className="festival-hero">
				<div className={`title title_0`}>
					<div className={`layer1 layer1_0`}>
						{(text).split("").map(function(char, index){
						return <span className={``} aria-hidden="true" key={index}>{char}</span>;
						})}
					</div>
					<div className={`layer2 layer2_0`}>
						{(text).split("").map(function(char, index){
						return <span className={`letter`} aria-hidden="true" key={index}>{char}</span>;
						})}
					</div>
					<div className={`layer3 layer3_0`}>
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