import Moment from 'moment';
import Slider from "react-slick";
import React, {useEffect} from 'react';

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

	useEffect(() => {
		let letters = document.getElementsByClassName('letter');
		// let random1 = Math.floor(Math.random() * letters.length);
		let random1 = Math.floor(Math.random() * 50) + 20;

		for (let i = 0; i < letters.length; i = i + random1) {
			letters[i].classList.add('animation');
		}
    // setTimeout(function() {
    //    setLoading(false)
    // }, 100);
  }, []);

	const text = "SonicActsFestival2022_SonicActsFestival2022"
  return (
		<>
			<div className="festival-hero-wrapper"></div>
			<div className="festival-hero">
				<Slider {...settings}>
					{relations.attributes.festival?.map((item, i) => {
						return(
							<div>
								<div className="wrapper">
									<div className={`title title_${i}`}>
										<div className={`layer1 layer1_${i}`}>
											{(text).split("").map(function(char, index){
												return <span className={`letter`} aria-hidden="true" key={index}>{char}</span>;
											})}
										</div>
										<div className={`layer2 layer2_${i}`}>
											{(text).split("").map(function(char, index){
												return <span className={`letter`} aria-hidden="true" key={index}>{char}</span>;
											})}
										</div>
										<div className={`layer3 layer3_${i}`}>
											{(text).split("").map(function(char, index){
												return <span className={`letter`} aria-hidden="true" key={index}>{char}</span>;
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
											<div className='title-text'>Locations</div>
											<div className='locations'>
												{item.locations?.map((item, i) => {
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
