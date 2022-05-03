import ReactMarkdown from "react-markdown";
import Link from "next/link"
import Moment from 'moment';
import Collapsible from 'react-collapsible';
import Image from "./image"
import image from "next/image";

const Article = ({page, relations}) => {

  return (   
		<section className="article">
			<>
				{page.attributes.title &&
					<div className="title">
						{relations?.attributes?.category?.data &&
							<div className="category">{relations.attributes.category.data.attributes.title}</div>
						}
						<h1>{page.attributes.title}</h1>
					</div>
				}
				{page.attributes.name &&
					<div className="title">
						<h1>{page.attributes.name}</h1>
						<div className="subtitle">{page.attributes.job_description}</div>
					</div>
				}
				<div className="content">
					<div className={`wrapper ${page.attributes.slug}`}>
						<>
						{page.attributes.content?.map((item, i) => {
							{item.url &&
								console.log(item.url.match(/\bhttps?:\/\/\S+/gi)[0]);
							}
							
							return (
								<div key={`content${i}`} className={`${page.attributes.slug}-block`}>
									{item.image?.data &&
										<>
											{item.image_caption ?
												<div className="columns" key={'column'+i}>
													<div className="caption">
														<ReactMarkdown 
															children={item.image_caption} 
														/>
													</div>
													<div className={`image ${page.attributes.slug}`}>
														<Image image={item.image.data.attributes}/>
													</div>
												</div>
												:
												<div className={`image ${item.size} ${page.attributes.slug}`}>
													<Image image={item.image.data.attributes}/>
												</div>
											}
										</>
									}
									{item.sidenote && 
										<div className={'sidenote ' + item.size}>
											<ReactMarkdown 
												children={item.sidenote} 
											/>
										</div>
									}
									{item.text_block &&
										<div className={'text-block ' + item.size} key={'text'+i}>
										
											<ReactMarkdown 
												children={item.text_block} 
											/>
										</div>
									}
									{item.url &&
										<div className={`iframe-wrapper ${item.sound}`}  key={'url'+i}>
											<iframe className="iframe" src={item.url.match(/\bhttps?:\/\/\S+/gi)[0]} frameBorder="0"/>
										</div>
									}
								</div>
							)
						})}
						{relations?.attributes?.footnotes &&
							<div className="footnotes" id="footnotes">
								<ReactMarkdown 
									children={relations?.attributes?.footnotes?.footnotes} 
								/>
							</div>
						}
						</>
					</div>
					<div className="sidebar">
						{page.attributes.slug == 'news' &&
							<>
							{page.attributes.date ?
								<span>Posted on {Moment(page.attributes.date).format('D MMM y')}</span>
							: <span>Posted on {Moment(page.attributes.publishedAt).format('D MMM y')}</span>
							}
							</>
						}

						{page.attributes.slug == 'about' &&
							<div className="contact">
								<h2>{page.attributes.contact_adres}</h2>
								<p>{page.attributes.contact_info}</p>
								<ReactMarkdown 
									children={page.attributes.contact_links} 
								/>
							</div>
						}
					
						{page.attributes.slug == 'agenda' &&
							<>
									<span>When</span>
									{relations?.attributes?.date && relations?.attributes?.dates == 0 &&
										Moment(relations?.attributes?.date).format('D MMM y')
									}
									{relations?.attributes?.dates &&
										relations?.attributes?.dates.map((date, i) => {
											return(
												<div className="date" key={`dates-${i}`}>
													{date.single_date &&
														<>
														{relations?.attributes?.date && 
															<div>
															- {Moment(relations?.attributes?.date).format('D MMM y')}
															</div>
														}
														<div>
														- {Moment(date.single_date).format('D MMM y')}
														</div>
														</>
													}
													{date.end_date &&
														<>
														{relations?.attributes?.date &&
															Moment(relations?.attributes?.date).format('D MMM')
														}
														&nbsp;- {Moment(date.end_date).format('D MMM y')}
														</>
													}
												</div>
											)
										})
									}
									{page.attributes.time &&
										<>
										<span>Time</span>
										<div>{page.attributes.time}</div>
										</>
									}
									{page.attributes.location &&
										<>
										<span>Location</span>
										<div>{page.attributes.location}</div>
										</>
									}
									{page.attributes.price &&
										<>
										<span>Tickets</span>
										<div>{page.attributes.price}</div>
										</>
									}
									{page.attributes.available_at &&
										<>
										<span>Available at</span>
										<div className="available-links">
											<ReactMarkdown 
												children={page.attributes.available_at}
											/>
										</div>
										</>
									}
							</>
						}
						
						{relations?.attributes?.community_items?.data[0] &&
							<div>
								<span>Community</span>
								{relations?.attributes?.community_items.data.map((item, i) => {
									return (
										<Link href={'/community/'+item.attributes.slug} key={`com-link${i}`}>
											<a>
											{item.attributes.name}
											</a>
										</Link>
									)
								})}
							</div>
						}

						{page.attributes.links &&
							<div className="links">
								<span>Links</span>
								<ReactMarkdown 
									children={page.attributes.links} 
								/>
							</div>
						}
						
					</div>
				</div>
			</>
			{page.attributes.content?.map((item, i) => {
				return(
					item.__component == 'basic.collapsible' &&
					<div className="collapsible about">
						<Collapsible trigger={item.title}>
							<div className={'text-block ' + item.text.size} key={'textcol'+i}>
								<ReactMarkdown 
									children={item.text.text_block} 
								/>
							</div>
						</Collapsible>
					</div>
					
				)
			})}
		</section>
  )
}


export default Article
