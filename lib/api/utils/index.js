export default [
    {
        method: ['get', 'post'],
        url: '/api/transit',
        handler: async (request, reply) => {
            let { url } = (request.method === 'POST' ? request.body : request.query);
            url = decodeURIComponent(url);
            const response = await fetch(url, {
                method: request.method,
                body: request.body ? JSON.stringify(request.body) : undefined
            });
            if (!response.ok) {
                return reply.status(response.status).send(response.statusText);
            }
            return Buffer.from(await response.arrayBuffer());
        }
    }
];
