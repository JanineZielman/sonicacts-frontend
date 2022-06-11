
const Type2 = () => {
	const text = "Sonic Acts Festival 2022 _ Sonic Acts Festival 2022"
	return(
		<section className="festival type">
			<div className="festival-hero">
				<div className='bg'>
					<img src="/fes-noise.svg" />
				</div>
				<div className={`title title_2`}>
					<div className={`layer1 layer1_2`}>
						{(text).split("").map(function(char, index){
						return <span className={``} aria-hidden="true" key={index}>{char}</span>;
						})}
					</div>
					<div className={`layer2 layer2_2`}>
						{(text).split("").map(function(char, index){
						return <span className={`letter`} aria-hidden="true" key={index}>{char}</span>;
						})}
					</div>
					<div className={`layer3 layer3_2`}>
						{(text).split("").map(function(char, index){
						return <span className={``} aria-hidden="true" key={index}>{char}</span>;
						})}
					</div>
				</div>
			</div>
		</section>
	)
}

export default Type2