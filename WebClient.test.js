const { WebClient } = require("@slack/web-api");

jest.mock('@slack/web-api');

WebClient.mockImplementation(() => {
    return {
        auth: {
            test: () => { return { ok: true }; }
        },
        chat: {
            postMessage: () => { return { ok: false, error: "invalid_auth"}; }
        }
    }
});

test('mocking WebClient', async () => {
    const client = new WebClient({});

    const authTest = await client.auth.test({});
    expect(authTest.ok).toBe(true);

    const newMessage = await client.chat.postMessage({
        channel: 'C111',
        text: "Hi there!",
    });
    expect(newMessage.error).toBe("invalid_auth");
});
