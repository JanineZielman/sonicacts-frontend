import Moment from 'moment';
import Slider from "react-slick";

const Hero = ({relations }) => {
	const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
		autoplaySpeed: 6000,
		// lazyLoad: true,
  };
  return (
		<>
			<div className="festival-hero-wrapper"></div>
			<div className="festival-hero">
				<Slider {...settings}>
					{relations.attributes.festival?.map((item, i) => {
						console.log(item.title.split(' ')[0])
						return(
							<div>
								<div className="wrapper">
									<div className="title">
										<div className={`layer1 layer1_${i}`}>
											{(item.title.split(' ')[1]).split("").map(function(char, index){
												return <span aria-hidden="true" key={index} style={{'--delay': (Math.floor(Math.random() * 10) * 0.5) + 's', '--random': (Math.floor(Math.random() * 50) + 50)}}>{char}</span>;
											})}
										</div>
										<div className={`layer2 layer2_${i}`}>
											{(item.title.split(' ')[1]).split("").map(function(char, index){
												return <span aria-hidden="true" key={index} style={{'--delay': (Math.floor(Math.random() * 10) * 0.5) + 's', '--random': (Math.floor(Math.random() * 50) + 50)}}>{char}</span>;
											})}
										</div>
										<div className={`layer3 layer3_${i}`}>
											{(item.title.split(' ')[1]).split("").map(function(char, index){
												return <span aria-hidden="true" key={index} style={{'--delay': (Math.floor(Math.random() * 10) * 0.5) + 's', '--random': (Math.floor(Math.random() * 50) + 50)}}>{char}</span>;
											})}
										</div>
									</div>
									<div className='bg'>
										<img src="/fes-noise.svg"/>
									</div>
									<div className="info">
										<div>
											<h1>{item.title}</h1>
											<div className="date">
												{Moment(item.start_date).format('D.M.Y')} — {Moment(item.end_date).format('D.M.Y')}
											</div>
										</div>
										<div className="locations-wrapper">
											<div>Locations</div>
											<div className='locations'>
												{item.locations?.map((item, i) => {
													console.log(item.location)
													return(
														<div className="location">
															{item.location.split('\n').map(str => <div>{str}</div>)}
														</div>
													)
												})}	
											</div>
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</Slider>
			</div>
		</>
  )
}


export default Hero
