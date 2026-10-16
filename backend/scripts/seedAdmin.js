import argon2 from 'argon2'
import { z } from 'zod'
import { database } from '../src/config/database.js'

const adminSeedSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  displayName: z.string().trim().min(2).max(100),
  password: z.string().min(12).max(128)
})

const seedAdmin = async () => {
  const seedValues = adminSeedSchema.parse({
    email: process.env.ADMIN_EMAIL,
    displayName: process.env.ADMIN_NAME,
    password: process.env.ADMIN_PASSWORD
  })

  const passwordHash = await argon2.hash(seedValues.password, {
    type: argon2.argon2id
  })

  await database.execute(
    `INSERT INTO admins (email, password_hash, display_name, role)
     VALUES (?, ?, ?, 'owner')
     ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       display_name = VALUES(display_name),
       role = 'owner',
       is_active = TRUE`,
    [seedValues.email, passwordHash, seedValues.displayName]
  )

  console.log(`Admin account is ready for ${seedValues.email}.`)
}

try {
  await seedAdmin()
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('Admin seed values are invalid. Check ADMIN_EMAIL, ADMIN_NAME, and ADMIN_PASSWORD.')
  } else {
    console.error('Admin seed failed:', error.message)
  }

  process.exitCode = 1
} finally {
  await database.end()
}
