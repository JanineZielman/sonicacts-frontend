const NewsRedirect = () => null

export const getServerSideProps = async () => ({
  redirect: {
    destination: "/#news",
    permanent: false,
  },
})

export default NewsRedirect
