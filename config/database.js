module.exports = {
    'connection' : {
        'socketPath' : `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
        'host' : process.env.DB_HOST,
        'user' : process.env.DB_USER,
        'password' : process.env.DB_PASS,
        'database' : process.env.DB_DATABASE
    }
}
