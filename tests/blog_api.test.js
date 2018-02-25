const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { format, initialBlogs, nonExistingId, blogsInDb, usersInDb } = require('./test_helper')

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

    describe('Users tests', async () => {
        beforeAll(async () => {
            await User.remove({})
            const user = new User({ username: 'root', password: 'sekret' })
            await user.save()
        })

        test('POST user', async () => {
            const usersBefore = await usersInDb()

            const newUser = {
                username: 'tester',
                name: 'Testi Ukkeli',
                password: 'salainen'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const usersAfter = await usersInDb()
            expect(usersAfter.length).toBe(usersBefore.length + 1)
            const usernames = usersAfter.map(u => u.username)
            expect(usernames).toContain(newUser.username)
        })

        test('POST user fails with same username', async () => {
            const usersBefore = await usersInDb()

            const newUser = {
                username: 'root',
                name: 'Jo Kannassa',
                password: 'salainen'
            }

            const result = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(result.body).toEqual({ error: 'Username already taken' })
            const usersAfter = await usersInDb()
            expect(usersAfter.length).toBe(usersBefore.length)
        })

    })

})

afterAll(() => {
    server.close()
})