import ReactMarkdown from "react-markdown";
import React, {useEffect} from "react"
import Moment from 'moment';
import Image from "./image"
import LazyLoad from 'react-lazyload';
import Collapsible from "./collapsible";

const Article = ({page, relations}) => {
	useEffect(() => {
    var text = document.getElementsByClassName('text-block');
		for (let i = 0; i < text.length; i++) { 
			var links = text[i].getElementsByTagName('a');
			for (let j = 0; j < links.length; j++) { 
				if (links[j].href.includes('#footnotes') != true) {
					links[j].setAttribute('target', '_blank');
				} else {
					links[j].classList.add('footnote')
				}
				if (links[j].href.includes('.pdf') == true) {
					links[j].href = 'https://cms.sonicacts.com/uploads/' + links[j].href.substring(links[j].href.lastIndexOf("/") + 1)
				}
			}
		}
  }, []);

  return (   
		<section className="article">
			<>
				{page.attributes.title &&
					<div className="title">
						{relations?.attributes?.category?.data &&
							<div className="category">
								<a href={'/'+page?.attributes.slug+'/filter/'+relations.attributes.category?.data?.attributes.slug}>
									{relations.attributes.category.data.attributes.title}
								</a>
								 {relations?.attributes?.author?.data && 
										<a className="author" href={'/community/'+relations.attributes.author?.data?.attributes.slug}>
											• {relations.attributes.author?.data?.attributes.name}
										</a>
									}
							</div>
						}
						<h1>{page.attributes.title} {page.attributes.additional_info && page.attributes.additional_info}</h1>
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
							return (
								<div key={`content${i}`} className={`${page.attributes.slug}-block`}>
									{item.image?.data &&
										<LazyLoad height={600}>
											{item.image_caption ?
												<div className="columns" key={'column'+i}>
													<div className="caption">
														<ReactMarkdown 
															children={item.image_caption} 
														/>
													</div>
													<div className={`image ${page.attributes.slug}`}>
														<Image image={item.image.data.attributes} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8VQ8AAnkBewKPWHQAAAAASUVORK5CYII="/>
													</div>
												</div>
												:
												<div className={`image ${item.size} ${page.attributes.slug}`}>
													<Image image={item.image.data.attributes} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8VQ8AAnkBewKPWHQAAAAASUVORK5CYII="/>
												</div>
											}
										</LazyLoad>
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
					<div className={`sidebar ${page.attributes.slug}`}>
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

						{page.attributes.slug == 'community' &&
							<span>Last updated on {Moment(page.attributes.updatedAt).format('D MMM y')}</span>
						}
					
						{page.attributes.slug != 'news' && page.attributes.slug != 'community' && page.attributes.slug != 'about' &&
							<>
									{relations?.attributes?.date &&
										<span>When</span>
									}
									{relations?.attributes?.dates?.[0] ?
										<div>
											{relations?.attributes.dates.map((date, i) => {
												return(
													<div className={`date ${i}`} key={`dates-${i}`}>
														{date.single_date &&
															<>
															{i == 0 && Moment(relations?.attributes?.date).format('D MMM y')}
															, {Moment(date.single_date).format('D MMM y')}
															</>
														}
														{date.end_date &&
															<>
																{(Moment(relations?.attributes.date).format('y') == Moment(date.end_date).format('y')) ? 
																	<>
																		{(Moment(relations?.attributes.date).format('MMM y') == Moment(date.end_date).format('MMM y')) ?
																			<>{Moment(relations?.attributes.date).format('D')} &nbsp;– {Moment(date.end_date).format('D MMM y')}</>
																		:
																			<>{Moment(relations?.attributes.date).format('D MMM')} &nbsp;– {Moment(date.end_date).format('D MMM y')}</>
																		}
																	</>
																	:
																	<>
																		{Moment(relations?.attributes.date).format('D MMM y')} &nbsp;– {Moment(date.end_date).format('D MMM y')}
																	</>
																}
															</>
														}
													</div>
												)
											})}
										</div>
										:
										Moment(relations?.attributes?.date).format('D MMM y')
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
										<span>{page.attributes.kind == 'opencall' ? 'Apply at' : 'Available at'}</span>
										<div className="available-links">
											<ReactMarkdown 
												children={page.attributes.available_at}
											/>
										</div>
										</>
									}
									{page.attributes.deadline &&
										<>
										<span>Deadline</span>
										<div>{Moment(page.attributes.deadline).format('D MMM y')}</div>
										</>
									}
							</>
						}

						{relations?.attributes?.authors?.data[0] &&
							<div>
								{relations?.attributes.authors.data.length == 1 ?
									<span>Author</span>
								: <span>Authors</span>
								}
								{relations?.attributes?.authors.data.map((item, i) => {
									return (
										<a href={'/community/'+item.attributes.slug} key={`com-link${i}`}>
											{item.attributes.name}
										</a>
									)
								})}
							</div>
						}
						
						{relations?.attributes?.community_items?.data[0] &&
							<div>
								<span>Community</span>
								{relations?.attributes?.community_items.data.map((item, i) => {
									return (
										<a href={'/community/'+item.attributes.slug} key={`com-link${i}`}>
											{item.attributes.name}
										</a>
									)
								})}
							</div>
						}
						

						{ (page.attributes.links || relations?.attributes?.discover_items) &&
							<div className="links">
								{page.attributes.links &&
									<>
									<span>Links</span>
									<ReactMarkdown 
										children={page.attributes.links} 
									/>
									</>
								}
								{relations.attributes.discover_items.data[0] &&
									<>
									<span>Related</span>
									{relations?.attributes?.discover_items?.data.map((item, i ) => {

										return(
											<p>
												<a href={'/discover/'+item.attributes.slug} key={`dis-link${i}`}>
													<img className="arrow" src="/arrow.svg"/> {item.attributes.title}
												</a>
											</p>
										)
									})}
									</>
								}
							</div>
						}
						
					</div>
				</div>
			</>
			{page.attributes.content?.map((item, i) => {
				return(
					item.__component == 'basic.collapsible' &&
					<div className="collapsible about">
						<Collapsible trigger={item.title} open={item.open == true && item.open}>
							<div className={'text-block ' + item.text?.size} key={'textcol'+i}>
								<ReactMarkdown 
									children={item.text?.text_block} 
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
