import { createApp } from '../server.js'
import { createStoreFromEnv } from '../quote-store-factory.js'

export default createApp(createStoreFromEnv())
