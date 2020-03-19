import microCors from 'micro-cors';
import { gql } from 'apollo-server-micro';
const cors = microCors();

function Status(request, response) {
    response.status(200);
    response.json({
        status: "ok",
        date: new Date(),
        environment: process.env.NODE_ENV,
        aws: {
            region: process.env.AWS_REGION || 'local',
            function_version: process.env.AWS_LAMBDA_FUNCTION_VERSION || 'local'
        }
    });
}

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

export const resolvers = {
    Query: {
        status: () => {
            return {
                status: 'ok',
                date: new Date(),
                environment: process.env.NODE_ENV,
                aws: {
                    region: process.env.AWS_REGION || 'local',
                    function_version:
                        process.env.AWS_LAMBDA_FUNCTION_VERSION || 'local'
                }
            };
        }
    }
};

export default cors(Status);
