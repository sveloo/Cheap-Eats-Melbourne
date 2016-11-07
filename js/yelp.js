function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

var yelp_url = 'http://api.yelp.com/v2/search' + '?location=Melbourne, Australia&sort=2&limit=20&cc=AU&category_filter=restaurants';

var parameters = {
    oauth_consumer_key: 'khBkEOW5FohZSnMNSp9NlQ',
    oauth_token: 'sv3hcY_HyOH2WdjWuEjCHbDXhhLwnz_X',
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now()/1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version : '1.0',
    callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
};

var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, 'vPFLQCN_HH1v33bDuUTHv479WF8', 'xn8agIL0m-1MU_Aw3Ng8UbC9bL0');
parameters.oauth_signature = encodedSignature;

var settings = {
    url: yelp_url,
    data: parameters,
    cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
    dataType: 'jsonp',
    success: function(results) {
        // Do stuff with results
        console.log("Yelp! Success");
    },
    error: function() {
        // Do stuff on fail
        console.log("Yelp! Fail!";)
    }
};

// Send AJAX query via jQuery library.
$.ajax(settings);

