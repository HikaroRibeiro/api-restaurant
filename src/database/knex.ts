import { knex as knexConfig } from 'knex'

import config from '@/database/knexfile'

export const knex = knexConfig(config)
