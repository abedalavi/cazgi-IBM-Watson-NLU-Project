const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    apikey = process.env.API_KEY;
    apiurl = process.env.API_URL;
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    return new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: apikey,
        }),
        serviceUrl: apiurl,
    });
}

function runAnalyze(analyzeParams) {
    const naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            return (JSON.stringify(analysisResults, null, 2));
        })
        .catch(err => {
            return ('error:', err);
        });
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {
    const params = {
        'url': req.query.url, 'features': {
            'emotion': {},
        }
    };
    const naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(params)
        .then(analysisResults => {
            return res.send(JSON.stringify(analysisResults.result.emotion.document.emotion, null, 2));
        })
        .catch(err => {
            return res.send('error:', err);
        });
});

app.get("/url/sentiment", (req, res) => {
    const params = {
        'url': req.query.url, 'features': {
            'sentiment': {},
        }
    };
    const naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(params)
        .then(analysisResults => {
            return res.send(JSON.stringify(analysisResults.result.sentiment.document, null, 2));
        })
        .catch(err => {
            return res.send('error:', err);
        });
});

app.get("/text/emotion", (req, res) => {
    const params = {
        'text': req.query.text, 'features': {
            'emotion': {},
        }
    };
    const naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(params)
        .then(analysisResults => {
            return res.send(JSON.stringify(analysisResults.result.emotion.document.emotion, null, 2));
        })
        .catch(err => {
            return res.send('error:', err);
        });

    // return res.send(runAnalyze(params));
});

app.get("/text/sentiment", (req, res) => {
    const params = {
        'text': req.query.text, 'features': {
            'sentiment': {},
        }
    };
    const naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(params)
        .then(analysisResults => {
            return res.send(JSON.stringify(analysisResults.result.sentiment.document, null, 2));
        })
        .catch(err => {
            return res.send('error:', err);
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

