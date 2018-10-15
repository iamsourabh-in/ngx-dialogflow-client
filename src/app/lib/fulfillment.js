'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });

    const somesuggests = ['Hi', 'Search Doctors',
        'Search', 'Search Physio', 'Look for a Dentist',
        'Search Physician', 'Search Dentist', 'Search Cardiologist',
        'Search Neurologists', 'Search Surgeons', 'Search Physiotherapist'];

    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function helpIntent(agent) {
        agent.add(`I can help you to search and book appointment for you. Try saying "Search Doctors"`);
        agent.add(new Suggestion(somesuggests[randomNumber()]));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
    }

    function welcome(agent) {
        agent.add(`Welcome to your Health App!`);
        agent.add(new Suggestion(`Hi`));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
    }

    function fallback(agent) {
        agent.add(`I'm sorry, can you try again?`);
        agent.add(new Suggestion(`Thanks`));
        agent.add(new Suggestion(`Hi`));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
    }

    function AskDoctor(agent) {
        console.log('field', agent.parameters.SQH_DoctorField);
        if (agent.parameters.SQH_DoctorField !== null && agent.parameters.SQH_DoctorField.indexOf('Doctor') < 0) {
            const collection = 'doctors';
            const dialogflowAgentDoc = db.collection(collection).where("field", "==", agent.parameters.SQH_DoctorField);
            // Get the value of 'entry' in the document and send it to the user
            return dialogflowAgentDoc
                .get()
                .then(docs => {
                    // console.log(docs.size);
                    if (docs.size > 0) {
                        agent.add(`Here are some ${agent.parameters.SQH_DoctorField}`);
                        docs.forEach(function (doc) {
                            const data = doc.data();
                            agent.add(data.index + ' - ' + data.name);

                            agent.add(new Suggestion(data.index.toString()));

                        });
                        agent.add('Reply with a number against the doctor.');
                        agent.add(new Suggestion(`Cancel`));

                    } else {
                        agent.add(`Sorry, currently no ${agent.parameters.SQH_DoctorField} are available.`);
                    }
                }).catch((err) => {
                    console.log('Error while fetching data from: ' + collection + err);
                });
        } else {
            agent.add(`Please provide the specialization are you looking for. Example Physio, Surgeon, Physician`);
            agent.add(new Suggestion(somesuggests[randomNumber()]));
            agent.add(new Suggestion(somesuggests[randomNumber()]));
            agent.add(new Suggestion(somesuggests[randomNumber()]));
        }
    }

    function finalizeSaveAppointments(agent) {

        // Get parameter from Dialogflow with the string to add to the database
        const date = agent.parameters.date;
        const time = agent.parameters.time;
        console.log('contexts' + JSON.stringify(agent.contexts));
        console.log('parameters' + JSON.stringify(agent.parameters));

        const entry = { date, time };

        // Get the database collection 'dialogflow' and document 'agent' and store
        // the document  {entry: "<value of database entry>"} in the 'agent' document
        const dialogflowAgentRef = db.collection('appointments').add(entry)
            .then(doc => {

            }).catch(err => {
                console.log(`Error writing to Firestore: ${err}`);
                agent.add(`Failed to write "${entry}" to the Firestore database.`);
            });
        const apptdate = new Date(date);
        agent.add(`You Appointment for ${'Date: ' + new Date(apptdate).toDateString() + ' - Time: ' + time} has been scheduled`);
        agent.add(new Suggestion(`Thanks`));
        agent.add(new Suggestion(`Check Appointments`));
    }

    function checkAppointments(agent) {
        const appointments = 'appointments';
        const dialogflowAgentDoc = db.collection(appointments);
        // Get the value of 'entry' in the document and send it to the user
        return dialogflowAgentDoc
            .get()
            .then(docs => {
                if (docs.size > 0) {
                    agent.add(`Here are your appoitments.`);
                    docs.forEach(function (doc) {
                        const data = doc.data();
                        agent.add('Date: ' + new Date(data.date).toDateString() + ' - Time: ' + data.time);
                    });
                    agent.add(new Suggestion(`Thanks`));
                } else {
                    agent.add(`Sorry, currently no appointments are available.`);
                    agent.add(new Suggestion(`Thanks`));
                    agent.add(new Suggestion(`Schedule appointment`));
                }
                // return Promise.resolve('Read complete');
            }).catch((err) => {
                console.log('Error while fetching data from: ' + appointments + err);
            });
    }

    function writeToDb(agent) {

        // Get parameter from Dialogflow with the string to add to the database

        const date = agent.parameters.date;
        const time = agent.parameters.time;

        const entry = { date, time };

        // Get the database collection 'dialogflow' and document 'agent' and store
        // the document  {entry: "<value of database entry>"} in the 'agent' document
        const dialogflowAgentRef = db.collection('appointments');
        console.log('entry', entry);
        return db.runTransaction(t => {
            t.add(dialogflowAgentRef, { entry: entry });
            return Promise.resolve('Write complete');
        }).then(doc => {
            agent.add(`Wrote ${entry} to the Firestore database.`);
        }).catch(err => {
            console.log(`Error writing to Firestore: ${err}`);
            agent.add(`Failed to write ${entry} to the Firestore database.`);
        });
    }

    function randomNumber() {
        return Math.ceil(Math.random() * 10);
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    const intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Ask Doctor Intent', AskDoctor);
    intentMap.set('Help Intent', helpIntent);
    intentMap.set('Select Doctor Intent - yes - datetime', finalizeSaveAppointments);
    intentMap.set('check appointments', checkAppointments);

    agent.handleRequest(intentMap);
});
