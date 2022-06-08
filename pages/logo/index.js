 const LogoPage = () => {
 return (
	<section className="container big-animation">
		<div className="image logo">
			<div className="s1">
				<span  data-text="S" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>S</span>
				<span  data-text="o" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>o</span>
				<span  data-text="n" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>n</span>
				<span  data-text="i" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>i</span>
				<span  data-text="c" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
			</div>
			<div className="s2">
				<span  data-text="A" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>A</span>
				<span  data-text="c" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>c</span>
				<span  data-text="t" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>t</span>
				<span  data-text="s" className="glitch" style={{'--delay': (Math.floor(Math.random() * 10) * 0.8) + 's' }}>s</span>
			</div>
		</div>
	</section>
 )
}

export default LogoPage