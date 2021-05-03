/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLog = /* GraphQL */ `
  query GetLog($id: ID!) {
    getLog(id: $id) {
      id
      mensagem
      data
      owner
      createdAt
      updatedAt
    }
  }
`;
export const listLogs = /* GraphQL */ `
  query ListLogs(
    $filter: ModelLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        mensagem
        data
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const logsByOwner = /* GraphQL */ `
  query LogsByOwner(
    $owner: ID
    $sortDirection: ModelSortDirection
    $filter: ModelLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    logsByOwner(
      owner: $owner
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        mensagem
        data
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
