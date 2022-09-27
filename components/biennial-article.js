import ReactMarkdown from "react-markdown";
import React, {useEffect} from "react"
import Moment from 'moment';
import Collapsible from 'react-collapsible';
import Image from "./image"
import LazyLoad from 'react-lazyload';

const Article = ({page, relations, params}) => {
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
			}
		}
  }, []);

	console.log(relations.attributes.WhenWhere)

  return (   
		<section className="article">
			<>
				{relations?.attributes?.authors?.data &&
					<div className="tags">
						{relations.attributes.authors.data.map((author, i) => {
							return(
								<a className="author" href={`/biennial/${params.slug}/artists/${author.attributes.slug}`}>
									{author.attributes.name}
								</a>
							)
						})}
					</div>
				}
				{page.attributes.title &&
					<div className="title">
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

					<div className="sidebar">

						{relations.attributes.WhenWhere?.[0] &&
							<>
								<span className="locations-sidebar">Location{relations.attributes.WhenWhere.length > 1 && 's'}</span>
								{relations.attributes.WhenWhere.map((item,i) => {
									return(
										<div className="sidebar-info">
											{item.locations?.data?.map((loc) => {
												return(
													<div className="date">
														<div className="location">
															<a href={`/biennial/${params.slug}/visit`}>
																{loc.attributes.title} {loc.attributes.subtitle && <> – {loc.attributes.subtitle} </>}
															</a>
															
														</div>
													</div>
												)
											})}
											{item.dates?.map((date) => {
												return(
													<div className="date">
														{Moment(date.start_date).format('D MMM')} {date.end_date && `– ${Moment(date.end_date).format('D MMM')}`}
													</div>
												)
											})}
											{item.times?.map((time) => {
												return(
													<div className="date">
														{time.start_time?.substring(0, 5)} {time.end_time && `– ${time.end_time?.substring(0, 5)}`}
													</div>
												)
											})}
											
										</div>
									)
								})}
							</>
						}


{/* 
						{relations.attributes.start_date &&
							<span>When</span>
						}
						{relations?.attributes?.start_date && relations?.attributes?.dates == 0 &&
							<>
							<div className="date">{Moment(relations.attributes.start_date).format('D MMM')} {relations.attributes.end_date && <>– {Moment(relations.attributes.end_date).format('D MMM')}</>}</div>
							</>
						}
						{relations?.attributes?.dates?.[0] &&
							<>
								{relations.attributes.start_date &&
									<div>
										– {Moment(relations.attributes.start_date).format('D MMM')}
									</div>
								}
								{relations?.attributes?.dates.map((date, i) => {
									return(
										<div className="date" key={`dates-${i}`}>
											{date.single_date &&
												<div>
												– {Moment(date.single_date).format('D MMM')}
												</div>
											}
											{date.end_date &&
												<>
												{relations?.attributes?.date &&
													Moment(relations?.attributes?.start_date).format('D MMM')
												}
												&nbsp;– {Moment(date.end_date).format('D MMM')}
												</>
											}
										</div>
									)
								})}
							</>
						}

						{relations.attributes.start_time &&
							<>
								<span>Time{relations.attributes?.times?.[0] && 's'}</span>
								<div className="date">
									<>
										{relations.attributes?.start_time?.substring(0, 5)} {relations.attributes.end_time && <>– {relations.attributes?.end_time?.substring(0, 5)}</>}
										{relations.attributes?.times?.map((time, i) => {
											return(
												<div>
													{time.start_time?.substring(0, 5)} {time.end_time && `– ${time.end_time?.substring(0, 5)}`}
												</div>
											)
										})}
									</>
								</div>
							</>
						}


						{relations.attributes.deadline &&
							<>
								<span>Deadline</span>
								<div className="date">{Moment(relations.attributes.deadline).format('D MMM y')}</div>
							</>
						}


						{relations?.attributes?.locations?.data[0] && 
							<div>
								<span>Location</span>
								<div className="date">
									{relations.attributes.locations?.data?.map((loc, j) => {
										return(
											<div className="location">
												<a href={`/biennial/${params.slug}/visit`}>
													{loc.attributes.title} {loc.attributes.subtitle && <> – {loc.attributes.subtitle} </>}
												</a>
												
											</div>
										)
									})}
								</div>
							</div>
						} */}

						{relations.attributes.price && relations.attributes.ticket_link &&
							<a href={relations.attributes.ticket_link} className="sidebar-tickets">
								<span>Tickets</span>
								<div>€ {relations.attributes.price}</div>
							</a>
						}
						
						{relations?.attributes?.community_items?.data[0] &&
							<div>
								<span>Artists</span>
								{relations?.attributes?.community_items?.data?.map((item, i) => {
									return (
										<a href={`/biennial/${params.slug}/artists/${item.attributes.slug}`} key={`com-link${i}`}>
											{item.attributes.name}
										</a>
									)
								})}
							</div>
						}

						{relations.attributes.main_programmes?.data[0] &&
							<div className="program-side-wrapper">
								<span>Programmes</span>
								{relations.attributes.main_programmes.data.map((programme, i) => {
									return(
										<div className="program-side">
											<h2>{programme.attributes.title}</h2>
											{programme.attributes.start_date &&
												<div className="date">{Moment(programme.attributes.start_date).format('D MMM')} {programme.attributes.end_date && <> – {Moment(programme.attributes.end_date).format('D MMM')} </>}</div>
											}
											{programme.attributes.start_time &&
												<div className="date">
													{programme.attributes.start_time?.substring(0, 5)} {programme.attributes.end_time && `– ${programme.attributes.end_time?.substring(0, 5)}`}
												</div>
											}
											<a className="view" href={`/biennial/${params.slug}/programme/${programme.attributes.slug}`}>View programme</a>
										</div>
									)
								})}
								
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
