import url from 'url';

export default cfg => ({
    google: {
        oauthRedirectUrl: url.resolve(cfg.host, '/api/confirmGoogleAuth'),
        loginRedirectUrl: url.resolve(cfg.host, '/api/completeGoogleLogin')
    }
});
