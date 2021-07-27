import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  """
  Sort enum
  asc sort by ascending
  desc sort by descending
  """
  enum SORT {
    asc
    desc
  }
`;

export default typeDefs;
