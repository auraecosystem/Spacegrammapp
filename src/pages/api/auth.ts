export const config = {
  runtime: "edge",
};

import type { APIRoute } from "astro";
import { db } from "../../lib/db";
import { createToken } from "../../lib/auth";
import { z } from "zod";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// =========================
// REGISTER
// =========================
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(4),
  });

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return json({ success: false, error: "Invalid input" }, 400);
  }

  const { name, email, password } = parsed.data;

  const existing = await db.execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [email],
  });

  if (existing.rows.length > 0) {
    return json({ success: false, error: "User exists" }, 409);
  }

  const result = await db.execute({
    sql: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    args: [name, email, password],
  });

  const token = await createToken({
    id: result.lastInsertRowid,
    email,
  });

  return json({
    success: true,
    token,
  });
};
