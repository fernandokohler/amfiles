/* Amplify Params - DO NOT EDIT
	API_AMFILES_GRAPHQLAPIIDOUTPUT
	API_AMFILES_USERTABLE_ARN
	API_AMFILES_USERTABLE_NAME
	AUTH_AMFILESA7B0F2F2_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
var AWS = require("aws-sdk");
const { to } = require("await-to-js");
const { CognitoIdentity } = require("aws-sdk");
const identity = new CognitoIdentity();
var docClient = new AWS.DynamoDB.DocumentClient();

const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getId = async (jwtToken, issuer) => {
  const [error, result] = await to(
    identity
      .getId({
        IdentityPoolId: "us-east-1:2f9bb403-5424-4254-87fe-275b8223c320",
        Logins: { [issuer.replace("https://", "")]: jwtToken },
      })
      .promise()
  );
  if (error) {
    console.error(
      "Erro ao obter identityId do usuário:",
      JSON.stringify(error, null, 2)
    );
    return [error];
  }

  return [null, result.IdentityId];
};

const checkExistId = (ownerId) => {
  var params = {
    TableName: process.env.API_AMFILES_USERTABLE_NAME,
    IndexName: "user-owner-index",
    KeyConditionExpression: "#owner = :owner",
    ExpressionAttributeNames: {
      "#owner": "owner",
    },
    ExpressionAttributeValues: {
      ":owner": ownerId,
    },
  };

  return docClient
    .query(params, function (err, data) {
      if (err) {
        console.error("Erro ao obter usuário:", JSON.stringify(err, null, 2));
        return [];
      } else {
        return data;
      }
    })
    .promise();
};

const addUser = (owner, identityId) => {
  var params = {
    TableName: process.env.API_AMFILES_USERTABLE_NAME,
    Item: {
      owner: owner,
      identityId: identityId,
      id: uuidv4(),
    },
  };
  return docClient
    .put(params, function (err, data) {
      if (err) {
        console.error(
          "Erro ao adicionar usuário:",
          JSON.stringify(err, null, 2)
        );
      }
    })
    .promise();
};

exports.handler = async (event) => {
  console.log("ENV", JSON.stringify(process.env, null, 2));

  try {
    const checkUser = await checkExistId(event.identity.username);

    console.log("checkUser", JSON.stringify(checkUser, null, 2));

    if (checkUser.Count === 0) {
      const { issuer } = event.identity;
      const { jwt } = event.request.headers;
      const [error, identityId] = await getId(jwt, issuer);

      await addUser(event.identity.username, identityId);
    }

    return true;
  } catch (err) {
    console.log("Erro Fatal -> ", JSON.stringify(err.stack, null, 2));
    return false;
  }
};
