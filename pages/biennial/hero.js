import Moment from 'moment';

const Hero = ({relations, slug }) => {
  return (
		<>
			<div className="festival-hero">
				<div className='bg'></div>
				{relations.attributes.programme?.map((item, i) => {
					return(
						<div className={`wrapper type ${item.programme.data.attributes.programme.toLowerCase().replace(' ', '')}`} >
							<a href={`${slug}/programme/${item.programme.data.attributes.slug}`}>
								<div className="info">
									<div>
										<h1>{item.programme.data.attributes.title}</h1>
										<div className="date">
											{item.programme.data.attributes.programme &&
												<>
													{item.programme.data.attributes.programme} <br/>
												</>
											}
											{Moment(item.programme.data.attributes.start_date).format('MMM') == Moment(item.programme.data.attributes.end_date).format('MMM') ?
												<>
													{Moment(item.programme.data.attributes.start_date).format('D')} — {Moment(item.programme.data.attributes.end_date).format('D MMM')}
												</>
											: 
												<>
													{Moment(item.programme.data.attributes.start_date).format('D MMM')} — {Moment(item.programme.data.attributes.end_date).format('D MMM')}
												</>
											}
											
										</div>
									</div>
									<div className="locations-wrapper">
										<div className={`locations l${item.locations?.data.length}`}>
											{item.locations?.data.map((item, i) => {
												return(
													<div className={`location o${item.attributes.orderTitle}`} style={{order: item.attributes.orderTitle}}>
														{item.attributes.title}
													</div>
												)
											})}	
										</div>
									</div>
								</div>
							</a>
						</div>
					)
				})}
			</div>
		</>
  )
}


export default Hero
