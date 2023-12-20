
exports.authorization = (request, response) => {

    if (request.headers.authorization !== process.env.DIALOGFLOW_AUTHORIZATION_KEY) {
        const unauthorizedResponse = {
            message: 'Unauthorized',
        };
           
        return response.status(401).json(unauthorizedResponse);
    }
};