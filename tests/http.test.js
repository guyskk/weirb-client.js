/* global WeirbClient */

const client = WeirbClient.create('http://127.0.0.1:43283/')

describe('weirb client', () => {

    it('call echo should success', () => {
        return client.call('/echo/call', {
            text: 'hello'
        }).then(result => {
            expect(result.text).toBe('hello')
        })
    })

    it('get echo should success', () => {
        return client.get('/echo/get', {
            params: {
                text: 'hello'
            }
        }).then(response => {
            expect(response.data.text).toBe('hello')
        })
    })

    it('post echo should success', () => {
        return client.post('/echo/post', {
            text: 'hello'
        }).then(response => {
            expect(response.data.text).toBe('hello')
        })
    })

    it('call error should throw ServiceError', (done) => {
        return client.call('/echo/call', {
            text: 'error'
        }).then(() => {
            done.failed()
        }).catch(error => {
            expect(error.code).toBe('Echo.Error')
            done()
        })
    })
})