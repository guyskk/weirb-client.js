const WeirbClient = require('../dist/WeirbClient');

const client = new WeirbClient.AxiosClient('http://127.0.0.1:8080/');

test('call echo should success', async () => {
    var prepared = client.call('Echo.echo', {
        text: 'hello'
    });
    var result = await prepared.result();
    expect(result.text).toBe('hello');
});