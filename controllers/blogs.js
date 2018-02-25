const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        if (body.title === undefined) {
            return response.status(400).json({ error: 'title missing' })
        }
        if (body.url === undefined) {
            return response.status(400).json({ error: 'url missing' })
        }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes === undefined ? 0 : body.likes
        })

        const savedBlog = await blog.save()
        response.status(201).json(Blog.format(blog))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)

        response.status(204).end()
    } catch (error) {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    try {
        const body = request.body

        const blog = {
            likes: body.likes
        }

        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        response.json(Blog.format(blog))
    } catch (error) {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = blogsRouter