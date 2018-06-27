const WeirbClient = require('../dist/WeirbClient');

const client = new WeirbClient.AxiosClient('http://127.0.0.1:8080/');

test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
});
