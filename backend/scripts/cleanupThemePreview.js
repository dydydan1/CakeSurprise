import { database } from '../src/config/database.js'

const previewEmail = 'codex-theme-preview@cake.local'

try {
  const [admins] = await database.execute(
    'SELECT id FROM admins WHERE email = ?',
    [previewEmail]
  )

  if (admins.length > 0) {
    const adminId = admins[0].id

    await database.execute(
      'DELETE FROM greetings WHERE created_by_admin_id = ?',
      [adminId]
    )
    await database.execute('DELETE FROM admin_sessions WHERE admin_id = ?', [adminId])
    await database.execute('DELETE FROM admins WHERE id = ?', [adminId])
  }

  console.log('Temporary theme preview data removed.')
} finally {
  await database.end()
}
