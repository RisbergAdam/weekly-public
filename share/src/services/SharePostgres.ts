import { DB, Op } from "sharedb";
import { Pool as PgPool } from "pg";
import { register } from "ts-node";

export class SharePostgres extends DB {
  pg: PgPool;

  constructor(options: Options) {
    super();
    this.pg = new PgPool(options);
    this.pg.connect();
  }

  close(callback: Callback) {
    this.pg.end();
    if (callback) {
      callback();
    }
  }

  async commit(
    collection: string,
    id: string,
    op: Op & { v: number },
    snapshot: Snapshot,
    options: any,
    callback: Callback
  ) {
    await this.pg.connect(async (err, client, done) => {
      try {
        await client.query("BEGIN");

        const versionResult = await client.query(
          "SELECT MAX(version) AS max_version FROM share_snapshot WHERE collection = $1 AND doc_id = $2",
          [collection, id]
        );

        var maxVersion = versionResult.rows[0].max_version || 0;

        if (snapshot.v !== maxVersion + 1) {
          client.query("COMMIT");
          callback(null, false);
          return;
        }

        await client.query(
          "INSERT INTO share_operation (collection, doc_id, version, operation) VALUES ($1, $2, $3, $4)",
          [collection, id, op.v, op]
        );

        if (snapshot.v === 1) {
          await client.query(
            "INSERT INTO share_snapshot (collection, doc_id, doc_type, version, data) VALUES ($1, $2, $3, $4, $5)",
            [collection, id, snapshot.type, snapshot.v, snapshot.data]
          );
        } else {
          await client.query(
            "UPDATE share_snapshot SET doc_type = $3, version = $4, data = $5 WHERE collection = $1 AND doc_id = $2 AND version = ($4 - 1)",
            [collection, id, snapshot.type, snapshot.v, snapshot.data]
          );
        }

        await client.query("COMMIT");
        callback(null, true);
        done();
      } catch (err) {
        await client.query("ABORT");
        callback(err, false);
        done();
      }
    });
  }

  async getSnapshot(
    collection: string,
    id: string,
    fields: any,
    options: any,
    callback: Callback
  ) {
    try {
      const snapshotResult = await this.pg.query(
        "SELECT version, data, doc_type FROM share_snapshot WHERE collection = $1 AND doc_id = $2 LIMIT 1",
        [collection, id]
      );

      let snapshot = { id, v: 0, type: null, data: undefined, m: undefined };

      if (snapshotResult.rows.length === 0) {
        return callback(null, snapshot);
      }

      const row = snapshotResult.rows[0];
      snapshot = {
        id,
        v: row.version,
        type: row.doc_type,
        data: row.data,
        m: undefined,
      };

      callback(null, snapshot);
    } catch (err) {
      console.error(err);
    }
  }

  async getOps(
    collection: string,
    id: string,
    from: number,
    to: number | undefined,
    options,
    callback: Callback
  ) {
    const opsResult = await this.pg.query(
      "SELECT version, operation FROM share_operation WHERE collection = $1 AND doc_id = $2 AND $3 <= version AND version < $4 ORDER BY version",
      [collection, id, from, to]
    );

    callback(
      null,
      opsResult.rows.map((row) => row.operation)
    );
  }
}

type Callback = (err?: any, success?: any) => any;

type Snapshot = { v: number; type: any; data: any };

type Options = {
  host: string;
  database: string;
  user: string;
  password: string;
};
