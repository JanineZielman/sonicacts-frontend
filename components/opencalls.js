import React from "react"

import Image from "./image"
import Moment from 'moment';
import LazyLoad from 'react-lazyload';

const Opencalls = ({ page, opencalls }) => {
  return (
		<>
			{opencalls.map((item, i) => {
				return (
					<div className="agenda-item">
						<LazyLoad height={600}>
							<a href={'/'+page?.attributes.slug+'/'+item.attributes.slug} key={'agenda'+i}>
								<div className="image">
									{item.attributes.cover_image.data &&
										<Image image={item.attributes.cover_image.data?.attributes} layout='fill' objectFit='cover' sizes="50vw"/>
									}
								</div>
								<div className="info">
									<div className="info-wrapper">
										<div>
										{item.attributes.date &&
												<>
													{item.attributes.dates?.[0] ?
														<span>
															{item.attributes.dates.map((date, i) => {
																return(
																	<span className={`date ${i}`} key={`dates-${i}`}>
																		{date.single_date &&
																			<>
																			{i == 0 && Moment(item.attributes.date).format('D MMM y')}
																			, {Moment(date.single_date).format('D MMM y')}
																			</>
																		}
																		{date.end_date &&
																			<>
																				{(Moment(item.attributes.date).format('y') == Moment(date.end_date).format('y')) ? 
																					<>
																						{(Moment(item.attributes.date).format('MMM y') == Moment(date.end_date).format('MMM y')) ?
																							<>
																								{Moment(item.attributes.date).format('D')}&nbsp;– {Moment(date.end_date).format('D MMM y')}
																							</>
																						:
																							<>
																								{Moment(item.attributes.date).format('D MMM')}&nbsp;– {Moment(date.end_date).format('D MMM y')}
																							</>
																						}
																					</>
																					:
																					<>
																						{Moment(item.attributes.date).format('D MMM y')}&nbsp;– {Moment(date.end_date).format('D MMM y')}
																					</>
																				}
																			</>
																		}
																	</span>
																)
															})}
														</span>
													: 
													<span>
														{Moment(item.attributes.date).format('D MMM y')}
													</span>
													}
												</>
											}


											
											<h3>{item.attributes.title}</h3>
											{item.attributes.category?.data && 
												<div className="category">
													<a href={'/search/'+item.attributes.category?.data?.attributes.slug} key={'discover'+i}>
														{item.attributes.category?.data.attributes.title}
													</a>
												</div>
											}
											{item.attributes.tags?.data && 
												<div className="tags">
													{item.attributes.tags.data.map((tag, i) => {
														return(
														<a href={'/search/'+tag.attributes.slug} key={'search'+i}>
															{tag.attributes.slug}
														</a>
														)
													})}
												</div>
											}
										</div>
										{/* {item.attributes.deadline &&
											<div className="apply"><img className="arrow" src="/arrow.svg"/> Apply until {Moment(item.attributes.deadline).format('D MMM y')}</div>
										} */}
									</div>
								</div>
							</a>
						</LazyLoad>
					</div>
				)
			})}
		</>
  )
}

export default Opencalls
