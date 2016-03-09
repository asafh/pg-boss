const Db = require('./db');
const pkg = require('./package.json');

class Contractor {
  static checkEnvironment(config){
    let db = new Db(config);

    return createSchema()
        .then(createJobTable)
        .then(createVersionTable)
        .then(insertVersion);

      function createSchema() {
          const schemaCreateCommand =
              'CREATE SCHEMA IF NOT EXISTS pdq';

          return db.executeSql(schemaCreateCommand);
      }

      function createJobTable() {
          const jobTableCreateCommand = `
            CREATE TABLE IF NOT EXISTS pdq.job (
                id uuid primary key not null,
                name text not null,
                data jsonb,
                state text not null,
                retryLimit integer not null default(0),
                retryCount integer not null default(0),
                startAfter timestamp without time zone,
                expireAfter interval,
                startedOn timestamp without time zone,
                createdOn timestamp without time zone not null,
                completedOn timestamp without time zone
            )`;

          return db.executeSql(jobTableCreateCommand);
      }

      function createVersionTable() {
          const versionTableCreateCommand =
              'CREATE TABLE IF NOT EXISTS pdq.version (version text primary key)';

          return db.executeSql(versionTableCreateCommand);
      }

      function insertVersion() {
          const versionInsertCommand =
              `INSERT INTO pdq.version(version) VALUES ($1) ON CONFLICT DO NOTHING;`;

          return db.executeSql(versionInsertCommand, pkg.version);
      }

  }
}

module.exports = Contractor;