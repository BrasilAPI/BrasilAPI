import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  extend type Query {
    status: Status
  }

  type Status {
    status: String
    date: String
    environment: String
    aws: AwsStatus
  }

  type AwsStatus {
    region: String
    function_version: String
  }
`;

export default typeDefs;
