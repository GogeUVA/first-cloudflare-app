export async function createNote(db, userId, title, content) {
  const result = await db
    .prepare(
      `
      INSERT INTO notes (user_id, title, content)
      VALUES (?, ?, ?)
    `
    )
    .bind(userId, title, content)
    .run();

  return result;
}

export async function getNotes(db, userId) {
  const result = await db
    .prepare(
      `
      SELECT * FROM notes
      WHERE user_id = ?
      ORDER BY created_at DESC
    `
    )
    .bind(userId)
    .all();

  return result.results;
}

export async function updateNote(db, id, content) {
  const result = await db
    .prepare(
      `
      UPDATE notes
      SET content = ?
      WHERE id = ?
    `
    )
    .bind(content, id)
    .run();

  return result;
}

export async function deleteNote(db, id) {
  const result = await db
    .prepare(
      `
      DELETE FROM notes
      WHERE id = ?
    `
    )
    .bind(id)
    .run();

  return result;
}