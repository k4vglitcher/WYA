const auth = require("../dist/auth")

test('Null return if options is of wrong size when generating facebook auth url', () => {
    var options = {
        client_id: "client-id",
        scopes: ["default"],
        redirect_uri: "redirect-url",
    }
    var url = auth.generateFacebookAuthURL(options);
    expect(url).toBe(null);
});