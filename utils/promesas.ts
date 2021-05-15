import connectionMySql from "../bin/connection_MySql"

const queryGenerica = (query: string, variables: Array<any> = []) => {
    return new Promise((resolve, reject) => {
        connectionMySql.query(query, variables, (error, result) => {
            if (error) {
                return reject(error)
            } else {
                return resolve(result)
            }
        })
    })
}

export default queryGenerica;