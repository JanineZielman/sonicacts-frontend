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


  return (
		<>
			<div className="festival-hero-wrapper"></div>
			<div className="festival-hero">
				<Slider {...settings}>
					{relations.attributes.festival?.map((item, i) => {
						return(
							<div>
								<div className={`wrapper type`} >
									{/* <img src={`/type${i}.jpg`}/> */}
									<iframe src={`/festival/type${i}`} frameborder="0" allowFullScreen/>
									<div className='bg'>
										<img src="/fes-noise.svg" />
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
