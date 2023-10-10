
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const { Pool } = require('pg')

type Message = {
  schedule: string,
  memo: string,
  startDay: string,
  endDay: string
}

type Input = {
  searchText: string
}
type Output = {
  list: Array<Message>
}

async function searchSchedule(client: any, json: Input) {
  const result = await client.query(`
        SELECT
        Calendar.id AS "id",
        Calendar.schedule AS "schedule",
        Calendar.memo AS "memo",
        Calendar.startDay AS "startDay",
        Calendar.endDay AS "endDay",
        Calendar.version AS "version",
        Calendar.color AS "color"
        FROM
            Calendar
        WHERE
            schedule LIKE '%' || $1 || '%' OR
            memo LIKE '%' || $1 || '%'
        ORDER BY
            Calendar.creation DESC,
            Calendar.id DESC
    `, [json.searchText]);
  return result.rows

}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Output>
) {
  const json: Input = req.body

  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    max: 100,
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 2000,
  })

  const client = await pool.connect()
  try {
    const rows = await searchSchedule(client, json)

    res.status(200).json({
      list: rows
    })
  } finally {
    client.release()
  }
}