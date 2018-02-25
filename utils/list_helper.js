const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  const likeList = blogs.map(blog => blog.likes)
  return likeList.reduce(reducer, 0)
}

const favorite = (blogs) => {
  blogs.sort(function (a, b) {
    return b.likes - a.likes
  })
  return blogs
}

const most = (blogs) => {
  const authors = blogs.map(blog => blog.author)
  var obj = {}
  var mostFreq = 0
  const result = {}

  authors.forEach(e => {
    if (!obj[e]) {
      obj[e] = 1
    } else {
      obj[e]++
    }
    if (obj[e] > mostFreq) {
      result.author = e
      result.blogs = obj[e]
    } else if (obj[e] === mostFreq) {
      result.author = e
      result.blogs = obj[e]
    }
  });
  return result
}

module.exports = {
  dummy, totalLikes, favorite, most
}