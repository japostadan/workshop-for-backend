import { createApp } from '../server.js'
import { createStoreFromEnv } from '../db/quote-store-factory.js'

const store = createStoreFromEnv()
await store.initialize()

export default createApp(store, process.env.CORS_ORIGIN)
