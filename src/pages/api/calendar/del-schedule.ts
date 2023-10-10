// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const { Pool } = require('pg')

type Input = {
  id: string,
  schedule: string,
  memo: string,
  startDay: string,
  endDay: string
}
type Output = {
}

async function deleteSchedule(client: any, json: Input) {

  await client.query('BEGIN')

  try {
    const result = await client.query(`
            DELETE
            FROM
                calendar
            WHERE
                id=$1
        `, [json.id])

    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Output>
) {
  const json: Input = req.body
  // console.log(json);


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
    await deleteSchedule(client, json)

    res.status(200).json({
    })
  } finally {
    client.release()
  }
}