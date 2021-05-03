/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const sendActionHistoryEmail = /* GraphQL */ `
  mutation SendActionHistoryEmail {
    sendActionHistoryEmail
  }
`;
export const sendEmailUploadedFile = /* GraphQL */ `
  mutation SendEmailUploadedFile($filename: String!) {
    sendEmailUploadedFile(filename: $filename)
  }
`;
export const createLog = /* GraphQL */ `
  mutation CreateLog(
    $input: CreateLogInput!
    $condition: ModelLogConditionInput
  ) {
    createLog(input: $input, condition: $condition) {
      id
      mensagem
      data
      owner
      createdAt
      updatedAt
    }
  }
`;
export const updateLog = /* GraphQL */ `
  mutation UpdateLog(
    $input: UpdateLogInput!
    $condition: ModelLogConditionInput
  ) {
    updateLog(input: $input, condition: $condition) {
      id
      mensagem
      data
      owner
      createdAt
      updatedAt
    }
  }
`;
export const deleteLog = /* GraphQL */ `
  mutation DeleteLog(
    $input: DeleteLogInput!
    $condition: ModelLogConditionInput
  ) {
    deleteLog(input: $input, condition: $condition) {
      id
      mensagem
      data
      owner
      createdAt
      updatedAt
    }
  }
`;
