import React, {useEffect, useState} from "react"
import Layout from "../../../components/layout"
import { fetchAPI } from "../../../lib/api"

const DiscoverFiltered = ({ menus, global, page, categories}) => {
  let filter = "media"


  useEffect(() => {
    setTimeout(() => {
      
      var loader=new function(){this.rC=-1,this.r=[],this.add=function(t){this.r.push(t)},this.addTag=function(t,e){var i=document.getElementsByTagName("head")[0],s=t.indexOf(".js")>0?"script":"link",n=document.createElement(s);i.appendChild(n),n.onload=e,n.charset="UTF-8","script"===s?(n.type="text/javascript",n.src=t):"link"===s&&(n.rel="stylesheet",n.href=t)},this.loadNext=function(){if(this.rC++,this.rC>=this.r.length)this.done();else{var t=this.r[this.rC];this.addTag(t,this.loadNext.bind(this))}},this.done=function(){this.onResourcesLoaded(window.Curator)},this.load=function(t){this.onResourcesLoaded=t,this.loadNext()}};

      // Config
      var config = {"post":{"template":"post-grid","imageHeight":"100%","minWidth":250,"showTitles":true,"showShare":true,"showComments":false,"showLikes":false,"autoPlayVideos":false,"clickAction":"open-popup","clickReadMoreAction":"open-popup","maxLines":0},"widget":{"animate":false,"continuousScroll":false,"continuousScrollOffset":50,"rows":2,"template":"widget-grid","showLoadMore":true,"loadMoreRows":1,"verticalSpacing":0,"horizontalSpacing":0,"autoLoadNew":false,"lazyLoadType":"whole_widget","gridMobile":false},"responsive":{"480":{"widget":{"loadMoreRows":4}},"768":{"widget":{"loadMoreRows":2}}},"lang":"en","container":"#curator-feed-default-feed-layout","debug":0,"hidePoweredBy":false,"embedSource":"","forceHttps":false,"feed":{"id":"5e5a781d-0dba-4966-823a-29c0591ac51e","apiEndpoint":"https:\/\/api.curator.io","postsPerPage":12,"params":{},"limit":25},"popup":{"template":"popup","templateWrapper":"popup-wrapper","autoPlayVideos":false,"deepLink":false},"filter":{"template":"filter","showNetworks":false,"showSources":false,"showAll":false,"default":"all","limitPosts":false,"limitPostNumber":0,"period":""},"type":"Grid","theme":"sydney"};
      var colours = {"widgetBgColor":"transparent","bgColor":"#ffffff","borderColor":"#cccccc","iconColor":"#222222","textColor":"#222222","linkColor":"#999999","dateColor":"#000000","footerColor":"#ffffff","tabIndexColor":"#cccccc"};
      var styles = {};
  
      // Bootstrap
      function loaderCallback () {
          window.Curator?.loadWidget(config, colours, styles);
      }
  
      // Run Loader
      loader.add('//cdn.curator.io/3.1/css/curator.csss');
      loader.add('https://cdn.curator.io/published-css/5e5a781d-0dba-4966-823a-29c0591ac51e.css');
  
      loader.add('//cdn.curator.io/3.1/js/curator.js');
  
      
  
      loader.load(loaderCallback);
    }, 1000);

  })

  return (
    <Layout page={page} menus={menus} global={global}>
      <div className="discover">
        <div className="filter">
          <div><span>Filter by category</span></div>
						<a key={'category-all'} href={`/archive`}>All</a>
						{categories?.map((category, i) => {
							return (
								<a key={'category'+i} href={`/archive/filter/${category?.attributes.slug}`}
									className={category?.attributes.slug == filter && 'active'}
								>
									{category?.attributes.title}
								</a>
							)
						})}
        </div>
        <div className="discover-container">
          <div id="curator-feed-default-feed-layout">
          </div>
        </div>
      </div>
      
    </Layout>
  )
}

export async function getServerSideProps() {
  const [pageRes, categoryRes, globalRes, menusRes] = await Promise.all([
    fetchAPI("/discover-overview", { populate: "*" }),
    fetchAPI("/categories?sort[0]=order&filters[$or][0][sub_category][$null]=true&filters[$or][1][sub_category][$eq]=false&populate=*"),
    fetchAPI("/global?populate[prefooter][populate]=*&populate[socials][populate]=*&populate[image][populate]=*&populate[footer_links][populate]=*&populate[favicon][populate]=*", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      page: pageRes.data,
      categories: categoryRes.data,
      global: globalRes.data,
      menus: menusRes.data,
    },
  };
}

export default DiscoverFiltered
