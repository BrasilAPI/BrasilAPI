import microCors from 'micro-cors';
const cors = microCors();

function Status(request, response) {
    response.status(200);
    response.json({
        status: "ok",
        environment: process.env.NODE_ENV,
        date: new Date().toString()
    });
}

export default cors(Status)