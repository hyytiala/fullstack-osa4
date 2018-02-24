const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')

describe('initial saved blogs', async () => {
    beforeAll(async () => {
        await Blog.remove({})

        const blogObjects = initialBlogs.map(b => new Blog(b))
        await Promise.all(blogObjects.map(b => b.save()))
    })

    test('all blogs returned as JSON by GET', async () => {
        const blogsInDatabase = await blogsInDb()

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(blogsInDatabase.length)

        const returnedtitles = response.body.map(b => b.title)
        blogsInDatabase.forEach(blog => {
            expect(returnedtitles).toContain(blog.title)
        })
    })

    describe('new blog', async () => {

        test('POST new blog', async () => {
            const blogsBefore = await blogsInDb()

            const newBlog = {
                title: 'New blog',
                author: 'New Author',
                url: 'www.new.fi',
                likes: 1
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAfter = await blogsInDb()

            expect(blogsAfter.length).toBe(blogsBefore.length + 1)

            const titles = blogsAfter.map(b => b.title)
            expect(titles).toContain('New blog')
        })
    })

})

afterAll(() => {
    server.close()
})