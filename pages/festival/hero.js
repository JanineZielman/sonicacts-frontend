
import ReactMarkdown from "react-markdown";
import Moment from 'moment';
import Collapsible from 'react-collapsible';
import Image from "../../components/image"
import LazyLoad from 'react-lazyload';
import Slider from "react-slick";

const Hero = ({relations }) => {
	const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    autoplaySpeed: 4000
  };
	console.log(relations)
  return (
		<>
			<div className="festival-hero-wrapper"></div>
			<div className="festival-hero">
				<Slider {...settings}>
					{relations.attributes.festival?.map((item, i) => {
						return(
							<div>
								<div className="wrapper">
									<div className="title">
										<div className="layer1">
											{(item.title).split("").map(function(char, index){
												return <span aria-hidden="true" key={index} style={{'--delay': (Math.floor(Math.random() * 10) * 0.5) + 's', '--random': (Math.floor(Math.random() * 50) + 50)}}>{char}</span>;
											})}
										</div>
										<div className="layer2">
											{(item.title).split("").map(function(char, index){
												return <span aria-hidden="true" key={index} style={{'--delay': (Math.floor(Math.random() * 10) * 0.5) + 's', '--random': (Math.floor(Math.random() * 50) + 50)}}>{char}</span>;
											})}
										</div>
										<div className="layer3">
											{(item.title).split("").map(function(char, index){
												return <span aria-hidden="true" key={index} style={{'--delay': (Math.floor(Math.random() * 10) * 0.5) + 's', '--random': (Math.floor(Math.random() * 50) + 50)}}>{char}</span>;
											})}
										</div>
									</div>
									<div className="info">
										<h1>{item.title}</h1>
										{/* <h1>{item.programme}</h1> */}
										<div className="date">
											{Moment(item.start_date).format('D-M-Y')} — {Moment(item.end_date).format('D-M-Y')}
										</div>
										<div className="locations">
											{item.locations?.length} Locations
											{/* {item.locations?.map((item, i) => {
												return(
													<div className="location">
														{item.location}
													</div>
												)
											})}	 */}
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
