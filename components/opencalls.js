import React from "react"

import Image from "./image"
import Moment from 'moment';
import LazyLoad from 'react-lazyload';

const Opencalls = ({ page, opencalls }) => {
  var  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
		<>
			{opencalls.map((item, i) => {
				const current = [];
				current[i] = Moment(opencalls[i].attributes.date).format('M');
				const next = [];
				next[i] = Moment(opencalls[i+ 1]?.attributes.date).format('M');
				const previous = [];
				previous[i] = Moment(opencalls[i-1]?.attributes.date).format('M');
				const difference = [];
				difference[i] = next[i] - current[i];
				const differencePrev = [];
				differencePrev[i] = current[i] - previous[i];
				const number = [];
				for (let j = 0; j < difference[i] - 1; j++) { 
					number[j] += 1
				}
				const d = [];
				d[i] = number;
				return (
					<>
					{opencalls[i].attributes.date && 
						differencePrev[i] != 0
						&&
						<div className="timeline-item">
							<div className="line"></div>
								{Moment(opencalls[i].attributes.date).format('MMMM')}
							<div className="line"></div>
						</div>

					}
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
											{item.attributes.category?.data && 
												<div className="category">
													<a href={'/'+page?.attributes.slug+'/categories/'+item.attributes.category?.data?.attributes.slug} key={'discover'+i}>
														{item.attributes.category?.data.attributes.slug}
													</a>
												</div>
											}
											{item.attributes.date &&
												<span className="date" key={`date-${i}`}>
													{Moment(item.attributes.date).format('D MMM y')}
												</span>
											}
											{item.attributes.dates &&
												item.attributes.dates.map((date, i) => {
													return(
														<span className="date" key={`dates-${i}`}>
															{date.single_date &&
																<>
																, {Moment(date.single_date).format('D MMM y')}
																</>
															}
															{date.end_date &&
																<>
																&nbsp;- {Moment(date.end_date).format('D MMM y')}
																</>
															}
														</span>
													)
												})
											}
											<h3>{item.attributes.title}</h3>
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
										{item.attributes.deadline &&
											<div className="apply">→ Apply until {Moment(item.attributes.deadline).format('D MMM y')}</div>
										}
									</div>
								</div>
							</a>
						</LazyLoad>
					</div>
					
					{opencalls[i].attributes.date && difference[i] > 1 &&
					<>
					{d[i].map((item, index) => {
						const missingMonth = parseInt(current[i]) + index
						return(
							<div className="timeline-item missing">
								<div className="line"></div>
									{months[missingMonth]}
							</div>
						)
					})}
					</>
					}
					</>
				)
			})}
		</>
  )
}

export default Opencalls
