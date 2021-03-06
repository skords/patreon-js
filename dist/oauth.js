'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _formUrlencoded = require('form-urlencoded');

var _formUrlencoded2 = _interopRequireDefault(_formUrlencoded);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function errMap(err, params) {
    if (err === 'invalid_grant') {
        return 'Invalid grant_type: ' + params.grant_type;
    } else if (err === 'invalid_client') {
        return 'Invalid client_id: ' + params.client_id;
    } else {
        return 'Unknown error: ' + err;
    }
}

function updateToken(params) {
    var url = (0, _utils.buildUrl)('/api/oauth2/token');
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': (0, _utils.userAgentString)()
        },
        body: (0, _formUrlencoded2.default)(params),
        params: params,
        credentials: 'include',
        compress: false
    };

    return (0, _isomorphicFetch2.default)(url, options).then(_utils.checkStatus).then(_utils.getJson).then(function (json) {
        return json.error ? Promise.reject({
            message: errMap(json.error, params),
            body: json,
            params: params
        }) : Promise.resolve(json);
    }).catch(function (err) {
        return Promise.reject(err);
    });
}

function oauth(clientId, clientSecret) {
    var baseParams = {
        client_id: clientId,
        client_secret: clientSecret
    };

    return {
        getTokens: function getTokens(code, redirectUri) {
            return updateToken(_extends({}, baseParams, {
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            }));
        },
        refreshToken: function refreshToken(token) {
            return updateToken(_extends({}, baseParams, {
                refresh_token: token,
                grant_type: 'refresh_token'
            }));
        }
    };
}

exports.default = oauth;