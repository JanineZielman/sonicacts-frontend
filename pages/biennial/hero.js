import Moment from 'moment';
import Image from "../../components/image"

const Hero = ({slug, biennial, programmes }) => {
	const number = Math.floor(Math.random() * (biennial.community_items.data.length - 6));
  return (
		<>
			<div className="festival-hero landing-page">
				<div className='bg'></div>
				<div className='wrapper type'>
					<a href={`/biennial/${slug}/programme`}>
						<div className='info'>
							<div>
								<h1>Programme</h1>
								<div className='programme-preview preview'>
									{programmes.slice(0,4).map((item, i) => {
										return(
											<a href={`/biennial/${slug}/programme/${item.attributes.slug}`} className='image-text'>
												<div className='image'>
													<Image image={item.attributes.cover_image?.data?.attributes} />
													<div className="info-overlay">
														{item.attributes.locations.data[0] && 
															<>
																<div className="locations">
																	{item.attributes.locations.data.map((loc, j) => {
																		return(
																			<div className="location">
																				<span>{loc.attributes.title}</span>
																			</div>
																		)
																	})}
																</div>
															</>
														}
													</div>
												</div>
												{item.attributes.start_date && 
													<p className="when">
														{Moment(item.attributes.start_date).format('MMM') == Moment(item.attributes.end_date).format('MMM') ?
															<>
																{Moment(item.attributes.start_date).format('D')} {item.attributes.end_date && <>– {Moment(item.attributes.end_date).format('D MMM')}</>}
															</>
														: 
															<>
																{Moment(item.attributes.start_date).format('D MMM')} {item.attributes.end_date && <>– {Moment(item.attributes.end_date).format('D MMM')}</>}
															</>
														}
													</p>
                        }
												<p>{item.attributes.title}</p>
											</a>
										)
									})}
								</div>
							</div>
						</div>
					</a>
				</div>
				<div className='wrapper type'>
					<a href={`/biennial/${slug}/artists`}>
						<div className='info'>
							<div>
								<h1>Artists</h1>
								<div className='artists-preview preview'>
									{biennial.community_items.data.slice(number,number+6).map((item, i) => {
										return(
											<a href={`/biennial/${slug}/artists/${item.attributes.slug}`} className='image-text'>
												<div className='image'><Image image={item.attributes.cover_image?.data?.attributes} /></div>
												<p>{item.attributes.name}</p>
											</a>
										)
									})}
								</div>
							</div>
						</div>
					</a>
				</div>
				<div className='wrapper type'>
					<a href={`/biennial/${slug}/news`}>
						<div className='info'>
							<div>
								<h1>News</h1>
								<div className='news-preview preview'>
									{biennial.news_items.data.slice(0,4).map((item, i) => {
										return(
											<a href={`/news/${item.attributes.slug}`} className='image-text'>
												<div className='image'><Image image={item.attributes.cover_image?.data?.attributes} /></div>
												<p>{item.attributes.title}</p>
											</a>
										)
									})}
								</div>
							</div>
						</div>
					</a>
				</div>
			</div>
		</>
  )
}


export default Hero
