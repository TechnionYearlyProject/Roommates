const { User } = require('./models/user');

const io = require('socket.io')();

let clients = {};
io.on('connection', client => {
    client.on('join', token => {

        User.findByToken(token)
            .then((user) => {
                if (!user) {
                    return client.disconnect();
                }

                if (Date.now() > user.getTicket(token).expiration) {
                    return user.removeExpiredTokens()
                        .then(() => client.disconnect());
                }

                client.name = `${user.firstName} ${user.lastName}`;

                if (!clients[client.name]) {
                    clients[client.name] = [];

                    for (let clientName of Object.keys(clients).filter(name => name !== client.name)) {
                        for (let c of clients[clientName]) {
                            c.emit('contactAdd', client.name);
                        }
                    }
                }

                clients[client.name].push(client);

                client.emit('welcome', Object.keys(clients).filter(name => name !== client.name));
            })
            .catch(err => client.disconnect());
    });

    client.on('message', message => {
        if (clients[message.to]) {
            for (let client of clients[message.to]) {
                client.emit('message', {
                    from: client.name,
                    content: message.content
                });
            }
        }
    });

    client.on('disconnect', () => {
        if (clients[client.name].length === 1) {
            delete clients[client.name];

            for (let clientArr of Object.values(clients)) {
                for (let c of clientArr) {
                    c.emit('contactRemove', client.name);
                }
            }

            return;
        }

        clients[client.name] = clients[client.name].filter(c => c !== client);
    })
});

io.listen(2000);