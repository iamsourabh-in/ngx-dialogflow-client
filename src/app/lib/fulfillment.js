"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion } = require("dialogflow-fulfillment");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });

    const maxDocListCount = 2;

    const somesuggests = [
      "Search Gyno",
      "Search Skin Doctor",
      "Search Doctors",
      "Search Physio",
      "Look for a Dentist",
      "Search Physician",
      "Search Dentist",
      "Search Cardiologist",
      "Search Neurologists",
      "Search Surgeons",
      "Search Physiotherapist"
    ];

    // console.log(
    //   "Dialogflow Request headers: " + JSON.stringify(request.headers)
    // );
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    function helpIntent(agent) {
      agent.add(
        `I can help you to search and book appointment for you. Try saying "Search Doctors"`
      );
      agent.add(new Suggestion(somesuggests[randomNumber()]));
      agent.add(new Suggestion(somesuggests[randomNumber()]));
      agent.add(new Suggestion(somesuggests[randomNumber()]));
      updateUserContext(agent);
    }

    function welcome(agent) {
      agent.add(
        `Welcome to your Health Assistant! What should I search for you?`
      );
      agent.add(new Suggestion(somesuggests[randomNumber()]));
      agent.add(new Suggestion(somesuggests[randomNumber()]));
      agent.add(new Suggestion(somesuggests[randomNumber()]));
      updateUserContext(agent);
    }

    function fallback(agent) {
      agent.add(`I'm sorry, can you try again?`);
      agent.add(new Suggestion(`Thanks`));
      agent.add(new Suggestion(`Hi`));
      agent.add(new Suggestion(somesuggests[randomNumber()]));
      agent.add(new Suggestion(somesuggests[randomNumber()]));
      agent.add(new Suggestion(somesuggests[randomNumber()]));
      updateUserContext(agent);
    }

    function AskDoctor(agent) {
      console.log("field", agent.parameters.SQH_DoctorField);
      if (
        agent.parameters.SQH_DoctorField !== null &&
        agent.parameters.SQH_DoctorField.indexOf("Doctor") < 0
      ) {
        const collection = "doctors";

        const dialogflowAgentDoc = db
          .collection(collection)
          .where("field", "==", agent.parameters.SQH_DoctorField)
          .orderBy("index");
        //.limit(maxDocListCount);

        // Get the value of 'entry' in the document and send it to the user
        return dialogflowAgentDoc
          .get()
          .then(docs => {
            console.log("Size" + docs.size);
            if (docs.size > 0) {
              agent.add(`Here are some ${agent.parameters.SQH_DoctorField}`);
              let currentCount = 0;
              docs.forEach(function(doc) {
                if (currentCount < maxDocListCount) {
                  currentCount++;
                  console.log(doc.id);
                  const data = doc.data();
                  console.log(data);
                  agent.add(data.index + " - " + data.name);
                  agent.add(new Suggestion(data.index.toString()));
                }
              });
              if (docs.size > maxDocListCount) {
                agent.add(
                  `We have more ${docs.size - currentCount}  ${
                    agent.parameters.SQH_DoctorField
                  }. Say "more".`
                );
                agent.add(new Suggestion("more"));
              }

              const context = {
                name: "lastdocid",
                lifespan: 5,
                parameters: { max: maxDocListCount }
              };
              agent.setContext(context);

              agent.add(
                "To proceed, reply with the number against the doctor."
              );
              agent.add(new Suggestion(`Cancel`));
            } else {
              agent.add(
                `Sorry, currently no ${
                  agent.parameters.SQH_DoctorField
                } are available.`
              );
            }
          })
          .catch(err => {
            console.log("Error while fetching data from: " + collection + err);
          });
      } else {
        agent.add(
          `Please provide the specialization are you looking for. Example Physio, Surgeon, Physician`
        );
        agent.add(new Suggestion(somesuggests[randomNumber()]));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
      }
    }

    function RequestMoreDoctor(agent) {
      console.log("context search");

      let lastContext = agent.getContext("lastdocid");
      let docCount = lastContext.parameters.max;
      let docField = lastContext.parameters.SQH_DoctorField;

      console.log("count", docCount);
      console.log("search", docField);

      const collection = "doctors";

      const dialogflowAgentDoc = db
        .collection(collection)
        .where("field", "==", docField)
        .offset(docCount);

      //.limit(maxDocListCount);
      updateUserContext(agent);
      // Get the value of 'entry' in the document and send it to the user
      return dialogflowAgentDoc
        .get()
        .then(docs => {
          console.log("Size" + docs.size);
          if (docs.size > 0) {
            let currentCount = 0;
            docs.forEach(function(doc) {
              if (currentCount < maxDocListCount) {
                currentCount++;
                console.log(doc.id);
                const data = doc.data();
                console.log(data);
                agent.add(data.index + " - " + data.name);
                agent.add(new Suggestion(data.index.toString()));
              }
            });
            if (docs.size > maxDocListCount) {
              agent.add(
                `We have more ${docs.size - docCount} ${docField}. Say "more"`
              );
              agent.add(new Suggestion("more"));
            }
            //updating context for next run

            let countGoing = docCount + maxDocListCount;
            let count_doc_Context = {
              name: "lastdocid",
              lifespan: 5,
              parameters: { max: countGoing }
            };
            agent.setContext(count_doc_Context);

            agent.add("To proceed, reply with the number against the doctor.");
            agent.add(new Suggestion(`Cancel`));
          } else {
            agent.add(`Sorry, currently no ${docField} are available.`);
          }
        })
        .catch(err => {
          console.log("Error while fetching data from: " + collection + err);
        });
    }

    function finalizeDoctor(agent) {
      console.log("doc", agent.parameters);
      if (agent.parameters.number !== null && agent.parameters.number !== 0) {
        const collection = "doctors";
        const dialogflowAgentDoc = db
          .collection(collection)
          .where("index", "==", agent.parameters.number);
        // Get the value of 'entry' in the document and send it to the user
        return dialogflowAgentDoc
          .get()
          .then(docs => {
            console.log(docs);
            if (docs.size > 0) {
              docs.forEach(function(doc) {
                const data = doc.data();
                agent.add(
                  `You have selected ` +
                    " - " +
                    data.name +
                    ". Would you like to proceed with it ?"
                );
                let selectedDoctor = data.name;
                let doc_Context = {
                  name: "doc_context",
                  lifespan: 3,
                  parameters: { docName: selectedDoctor }
                };
                agent.setContext(doc_Context);
              });
              agent.add(new Suggestion(`Yes`));
              agent.add(new Suggestion(`No`));
            } else {
              agent.add(`Sorry, currently the doctor is not available.`);
            }
          })
          .catch(err => {
            console.log("Error while fetching data from: " + collection + err);
          });
      } else {
        agent.add(
          `Please provide the specialization are you looking for. Example Physio, Surgeon, Physician`
        );
        agent.add(new Suggestion(somesuggests[randomNumber()]));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
        agent.add(new Suggestion(somesuggests[randomNumber()]));
      }
    }

    function finalizeSaveAppointments(agent) {
      // Get parameter from Dialogflow with the string to add to the database
      const date = agent.parameters.date;
      const time = agent.parameters.time;
      console.log("contexts" + JSON.stringify(agent.contexts));
      console.log("parameters" + JSON.stringify(agent.parameters));
      //Get Doctor context
      let docContext = agent.getContext("doc_context");
      let docName = docContext.parameters.docName;
      //Get User context
      let userContext = agent.getContext("user_context");
      let userName = userContext.parameters.user;

      const entry = { date, time, docName, userName };

      // Get the database collection 'dialogflow' and document 'agent' and store
      // the document  {entry: "<value of database entry>"} in the 'agent' document
      const dialogflowAgentRef = db
        .collection("appointments")
        .add(entry)
        .then(doc => {})
        .catch(err => {
          console.log(`Error writing to Firestore: ${err}`);
          agent.add(`Failed to write "${entry}" to the Firestore database.`);
        });
      const apptdate = new Date(date);
      agent.add(
        `You Appointment for ${"Date: " +
          new Date(apptdate).toDateString() +
          " - Time: " +
          time} has been scheduled`
      );
      agent.add(new Suggestion(`Thanks`));
      agent.add(new Suggestion(`Check Appointments`));
    }

    function checkAppointments(agent) {
      console.log("contexts" + JSON.stringify(agent.contexts));

      //Get User context
      let userContext = agent.getContext("user_context");
      let userName = userContext.parameters.user;

      const appointments = "appointments";
      // const dialogflowAgentDoc = db.collection(appointments);

      const dialogflowAgentDoc = db
        .collection(appointments)
        .where("userName", "==", userName);

      // Get the value of 'entry' in the document and send it to the user
      return dialogflowAgentDoc
        .get()
        .then(docs => {
          if (docs.size > 0) {
            agent.add(`Here are your appoitments.`);
            docs.forEach(function(doc) {
              const data = doc.data();
              agent.add(
                "Date: " +
                  new Date(data.date).toDateString() +
                  " - Time: " +
                  data.time +
                  " with " +
                  data.docName
              );
            });
            agent.add(new Suggestion(`Thanks`));
          } else {
            agent.add(`Sorry, currently no appointments are available.`);
            agent.add(new Suggestion(`Thanks`));
            agent.add(new Suggestion(`Schedule appointment`));
          }
          // return Promise.resolve('Read complete');
        })
        .catch(err => {
          console.log("Error while fetching data from: " + appointments + err);
        });
    }

    function writeToDb(agent) {
      // Get parameter from Dialogflow with the string to add to the database

      const date = agent.parameters.date;
      const time = agent.parameters.time;

      const entry = { date, time };

      // Get the database collection 'dialogflow' and document 'agent' and store
      // the document  {entry: "<value of database entry>"} in the 'agent' document
      const dialogflowAgentRef = db.collection("appointments");
      console.log("entry", entry);
      return db
        .runTransaction(t => {
          t.add(dialogflowAgentRef, { entry: entry });
          return Promise.resolve("Write complete");
        })
        .then(doc => {
          agent.add(`Wrote ${entry} to the Firestore database.`);
        })
        .catch(err => {
          console.log(`Error writing to Firestore: ${err}`);
          agent.add(`Failed to write ${entry} to the Firestore database.`);
        });
    }

    function randomNumber() {
      return Math.ceil(Math.random() * 10);
    }

    function RegisterUser(agent) {
      // Get parameter from Dialogflow with the string to add to the database
      const query = agent.query.split(" ");
      const user = query.slice(1).join(" ");

      let user_Context = {
        name: "user_context",
        lifespan: 10,
        parameters: { user: user }
      };

      agent.setContext(user_Context);
    }

    function updateUserContext(agent) {
      let userContext = agent.getContext("user_context");

      let user_Context = {
        name: "user_context",
        lifespan: 10,
        parameters: { user: userContext.parameters.user }
      };

      agent.setContext(user_Context);
    }

    function SayTime() {
      var d = new Date();
      agent.add(`The time is ${d.toTimeString()}`);
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    const intentMap = new Map();
    intentMap.set("Ask Time", SayTime);
    intentMap.set("Register User", RegisterUser);
    intentMap.set("Default Welcome Intent", welcome);
    intentMap.set("Default Fallback Intent", fallback);
    intentMap.set("Ask Doctor Intent", AskDoctor);
    intentMap.set("Ask Doctor Intent - next", RequestMoreDoctor);
    intentMap.set("Help Intent", helpIntent);
    intentMap.set(
      "Select Doctor Intent - yes - datetime",
      finalizeSaveAppointments
    );
    intentMap.set("check appointments", checkAppointments);
    intentMap.set("Select Doctor Intent", finalizeDoctor);

    agent.handleRequest(intentMap);
  }
);
