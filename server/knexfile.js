// Update with your config settings.

module.exports = {
  client: 'sqlite3',
    connection: {
      filename: './src/database/db.db'
    },
    useNullAsDefault: true,
    migrations:{
      directory: "./src/database/migrations"
    }
};
