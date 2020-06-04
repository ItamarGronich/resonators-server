import express from '../express';
import routeHandler from '../routeHandler';
import renderClient from '../renderClient';

express.get("/privacy-policy", servePrivacyPolicy());
express.get("/terms-and-conditions", serveTermsAndConditions());
express.get(/^(?!\/api).*$/, serveClient());


function serveTermsAndConditions() {
    return routeHandler(async (request, response) => {
        response.render('../pages/termsAndConditions');
    }, {
        enforceLogin: false
    });
}
function servePrivacyPolicy() {
    return routeHandler(async (request, response) => {
        response.render('../pages/privacyPolicy');
    }, {
        enforceLogin: false
    });
}

function serveClient() {
    return routeHandler(async (request, response) => {
        await renderClient(request, response);
    }, {
        enforceLogin: false
    });
}
