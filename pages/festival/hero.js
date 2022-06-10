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
		lazyLoad: false,
  };

	const text = "Son ic Acts Festi- val 20 22"
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
											<span>Son</span><span>ic</span><span>Acts</span>
											<span>Festi-</span><span>val</span><span>20</span><span>22</span>
											{/* {(text).split("").map(function(char, index){
												return <span aria-hidden="true" key={index}>{char}</span>;
											})} */}
										</div>
										<div className={`layer2 layer2_${i}`}>
											{(text).split("").map(function(char, index){
												return <span aria-hidden="true" key={index}>{char}</span>;
											})}
										</div>
										<div className={`layer3 layer3_${i}`}>
											<span>Son</span><span>ic</span><span>Acts</span>
											<span>Festi-</span><span>val</span><span>20</span><span>22</span>
											{/* {(text).split("").map(function(char, index){
												return <span aria-hidden="true" key={index}>{char}</span>;
											})} */}
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
