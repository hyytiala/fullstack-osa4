const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs)=> {
  const reducer = (sum, item) => {
    return sum + item
  }

  const likeList = blogs.map(blog=>blog.likes)
  return likeList.reduce(reducer, 0)
}

module.exports = {
  dummy, totalLikes
}