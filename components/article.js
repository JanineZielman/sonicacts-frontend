import ReactMarkdown from "react-markdown";
import Link from "next/link"
import Moment from 'moment';
import Image from "./image"

const Article = ({page, relations}) => {
	console.log(relations)
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
					<div className="wrapper">
						<>
						{page.attributes.content.map((item, i) => {
							return (
								<>
								{item.image &&
								<>
								{item.image_caption ?
									<div className="columns" key={'column'+i}>
										<div className="caption">
											<ReactMarkdown 
												children={item.image_caption} 
											/>
										</div>
										<div className="image">
											<Image image={item.image.data.attributes}/>
										</div>
									</div>
									:
									<div className="image">
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
								</>
							)
						})}
						{relations.attributes.footnotes &&
							<div className="footnotes" id="footnotes">
								<ReactMarkdown 
									children={relations.attributes.footnotes.footnotes} 
								/>
							</div>
						}
						</>
					</div>
					<div className="sidebar">
						{page.attributes.slug == 'news' &&
							<span>Posted on {Moment(page.attributes.publishedAt).format('D MMM y')}</span>
						}
					
						{page.attributes.slug == 'agenda' &&
							<>
									<span>When</span>
									<div>{Moment(page.attributes.date).format('D MMM y')}</div>
									<div>{page.attributes.time}</div>
								
									<span>Location</span>
									<div>{page.attributes.location}</div>

									<span>Tickets</span>
									<div>{page.attributes.price}</div>
							</>
						}
					
						

						
						{relations?.attributes?.community_items?.data[0] &&
							<div>
								<span>Community</span>
								{relations.attributes.community_items.data.map((item, i) => {
									return (
										<Link href={'/community/'+item.attributes.slug}>
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
		</section>
  )
}


export default Article
