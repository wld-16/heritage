import { query } from '../db/index.js'

interface user {
    id: number
    oid: string,
}

class UserService {
    // User
    existsUser(oid: string) {
        return query(`SELECT * FROM "user" WHERE oid=$1 LIMIT 1`, [oid]).then(data => {
            return data.rows.length > 0
        })
    }

    getUser(oid: string) {
        return query("SELECT * FROM user WHERE oid=$1 LIMIT 1", [oid]).then(data => {
            return {id: data.rows[0].id, oid: data.rows[0].oid}
        })
    }

    createOrUpdateUser(oid: string) {
        const insertQuery = `INSERT INTO "user"(id, oid) values (nextval('user_id_seq'), $1) returning *`;
        return query(insertQuery, [oid]).then(data => {
            return {
                id: data.rows[0].id,
                oid: data.rows[0].oid
            }
        })
    }
}

export {
    UserService
};