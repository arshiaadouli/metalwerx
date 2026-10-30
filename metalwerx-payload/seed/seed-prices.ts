// Gives every material an entry in the price collection, per tonne (as the yard
// quotes its prices) with no price yet, for the dollar values to be filled in
// from the admin. Running it again skips the materials that already have one.
//
//   npm run seed:prices
import { getPayload } from 'payload'

import config from '../src/payload.config'

const payload = await getPayload({ config })
// No revalidation calls to the website while seeding.
const context = { skipRevalidate: true }

const { docs: materials } = await payload.find({
  collection: 'materials',
  depth: 0,
  limit: 0,
  sort: 'title',
})
const { docs: prices } = await payload.find({ collection: 'price', depth: 0, limit: 0 })
const priced = new Set(prices.map((price) => price.material))

for (const material of materials) {
  if (priced.has(material.id)) continue
  await payload.create({ collection: 'price', context, data: { material: material.id, unit: 'tonne' } })
  console.log(`Added ${material.title}`)
}

process.exit(0)
