// eslint-disable-next-line
exports.handler = function (event, context, teste) {
  console.log("teste:", JSON.stringify(teste, null, 2));
  console.log("context:", JSON.stringify(context, null, 2));
  console.log("Received S3 event:", JSON.stringify(event, null, 2));

  context.done(null, "Successfully processed S3 event"); // SUCCESS with message
};
