import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from "react";
import { fetchAPI } from "../../lib/api"

const Posts = ({ data, numberOfPosts }) => {
  const [posts, setPosts] = useState(data);
  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetchAPI(
      `/discover-items?_start=${posts.length}&_limit=10`
    );
    const newPosts = await res.data;
    setPosts((posts) => [...posts, ...newPosts]);
  };

  useEffect(() => {
    setHasMore(numberOfPosts > posts.length ? true : false);
  }, [posts]);

  return (
    <div variant="container">

      <InfiniteScroll
        dataLength={posts.length}
        next={getMorePosts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {posts.map((post) => (
          <div>{post.attributes.title}</div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export async function getServerSideProps() {

  const data = await fetchAPI(`/discover-items?_limit=10`);

	const totalItems = 
    await fetchAPI( `/discover-items`
  );

  const numberOfPosts = totalItems.meta.pagination.total;

  return {
    props: {
      data: data.data,
      numberOfPosts: +numberOfPosts,
    },
  };
}

export default Posts;
