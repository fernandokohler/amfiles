/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateLog = /* GraphQL */ `
  subscription OnCreateLog($owner: String!) {
    onCreateLog(owner: $owner) {
      id
      mensagem
      data
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateLog = /* GraphQL */ `
  subscription OnUpdateLog($owner: String!) {
    onUpdateLog(owner: $owner) {
      id
      mensagem
      data
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteLog = /* GraphQL */ `
  subscription OnDeleteLog($owner: String!) {
    onDeleteLog(owner: $owner) {
      id
      mensagem
      data
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String!) {
    onCreateUser(owner: $owner) {
      id
      identityId
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String!) {
    onUpdateUser(owner: $owner) {
      id
      identityId
      owner
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String!) {
    onDeleteUser(owner: $owner) {
      id
      identityId
      owner
      createdAt
      updatedAt
    }
  }
`;
