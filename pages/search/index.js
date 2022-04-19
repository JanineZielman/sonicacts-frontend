import React, {useEffect, useState} from "react"
import Link from "next/link"
import Layout from "../../components/layout"
import Moment from 'moment';
import Seo from "../../components/seo"
import Image from "../../components/image"
import { fetchAPI } from "../../lib/api"


const Search = ({ menus, global}) => {
	const page = 'search'
  return (
	  <Layout page={page} menus={menus} global={global}>
      
    </Layout>
  )
}

export async function getServerSideProps({params}) {
  const [globalRes, menusRes] = await Promise.all([
    fetchAPI("/global", { populate: "*" }),
    fetchAPI("/menus", { populate: "*" }),
  ])

  return {
    props: {
      global: globalRes.data,
      menus: menusRes.data,
    },
  };
}

export default Search
