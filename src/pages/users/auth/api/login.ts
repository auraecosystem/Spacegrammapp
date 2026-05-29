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

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return json({ success: false, error: "Invalid input" }, 400);
  }

  const { email, password } = parsed.data;

  const result = await db.execute({
    sql: "SELECT * FROM users WHERE email = ? AND password = ?",
    args: [email, password],
  });

  const user = result.rows[0];

  if (!user) {
    return json({ success: false, error: "Invalid credentials" }, 401);
  }

  const token = await createToken({
    id: user.id,
    email: user.email,
  });

  return json({
    success: true,
    token,
  });
};
