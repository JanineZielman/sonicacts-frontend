import ReactMarkdown from "react-markdown";
import React, {useEffect} from "react"
import Moment from 'moment';
import Collapsible from 'react-collapsible';
import Slider from "react-slick";
import Image from "./image"
import LazyLoad from 'react-lazyload';

const CollapsibleSlider = ({page, items}) => {
	const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    // slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    adaptiveHeight: true,
    // autoplay: true,
    autoplaySpeed: 4000
  };
  return (   
		<div className={`collapsible ${page}`}>
			<Collapsible trigger={page} open={true}>
				<LazyLoad height={600}>
					<Slider {...settings}>
						{items.slice(0, 3).map((item, i) => {
							return(
								<a href={'/' + page + '/'+ item.attributes.slug} className="slider-item" draggable="false">
									{item.attributes.cover_image?.data &&
										<div className="image">
											<Image image={item.attributes.cover_image?.data?.attributes} objectFit='cover'/>
										</div>
									}
									<div className="text">
										{item.attributes.title &&
											<div>
												{item.attributes.start_date && 
													<div className="when">
														{Moment(item.attributes.start_date).format('MMM') == Moment(item.attributes.end_date).format('MMM') ?
															<>
																{Moment(item.attributes.start_date).format('D')} {item.attributes.end_date && <>– {Moment(item.attributes.end_date).format('D MMM')}</>}
															</>
														: 
															<>
																{Moment(item.attributes.start_date).format('D MMM')} {item.attributes.end_date && <>– {Moment(item.attributes.end_date).format('D MMM')}</>}
															</>
														}
													</div>
												}
												{item.attributes.title &&
													<h2>{item.attributes.title}</h2>
												}
											</div>
										}
										{item.attributes.name &&
										<h2>{item.attributes.name}</h2>
										}
									</div>
								</a>       
							)
						})}
						<div className="slider-item">
							<p className="show-more">
								<a href={'/' + page}>
									{page}
								</a>
							</p>
						</div>
					</Slider>
				</LazyLoad>
			</Collapsible>
		</div>
  )
}


export default CollapsibleSlider
