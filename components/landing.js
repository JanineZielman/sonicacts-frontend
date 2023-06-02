
import ReactMarkdown from "react-markdown";
import Collapsible from 'react-collapsible';
import Image from "./image"

const Landing = ({page }) => {
  return (
   <div className="article">
		{page.attributes.content?.map((item, i) => {
			return(
				<>
					{item.image?.data &&
					<div>
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
						</div>
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
					{item.__component == 'basic.collapsible' &&
						<div className="collapsible about">
							<Collapsible trigger={item.title} open={item.open == true && item.open}>
								<div className={'text-block ' + item.text?.size} key={'textcol'+i}>
									<ReactMarkdown 
										children={item.text?.text_block} 
									/>
								</div>
							</Collapsible>
						</div>
					}
					{item.url &&
						<div className={`iframe-wrapper ${item.sound}`}  key={'url'+i}>
							<iframe className="iframe" src={item.url.match(/\bhttps?:\/\/\S+/gi)[0]} frameBorder="0"/>
						</div>
					}
				</>
			)
		})}
	 </div>
  )
}


export default Landing