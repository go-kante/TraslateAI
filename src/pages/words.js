// src/pages/words.js
import { env } from 'cloudflare:workers';

function getUserId(request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/user_id=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const GET = async ({ request }) => {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: '未ログイン' }), { status: 401 });
    }

    const { results } = await env.DB.prepare(
      'SELECT * FROM words WHERE user_id = ? ORDER BY created_at DESC'
    ).bind(userId).all();

    return new Response(JSON.stringify({ words: results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const POST = async ({ request }) => {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: '未ログイン' }), { status: 401 });
    }

    const { original, translation, example, meaning } = await request.json();

    await env.DB.prepare(
      "INSERT INTO words (user_id, original, translation, example, meaning, created_at, status) VALUES (?, ?, ?, ?, ?, ?, 'learning')"
    ).bind(userId, original, translation, example, meaning, Date.now()).run();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

// 単語の状態を更新（learning ⇄ mastered）
export const PATCH = async ({ request }) => {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: '未ログイン' }), { status: 401 });
    }

    const { id, status } = await request.json();
    if (!['learning', 'mastered'].includes(status)) {
      return new Response(JSON.stringify({ error: '不正なstatus' }), { status: 400 });
    }

    await env.DB.prepare(
      'UPDATE words SET status = ? WHERE id = ? AND user_id = ?'
    ).bind(status, id, userId).run();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const DELETE = async ({ request }) => {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return new Response(JSON.stringify({ error: '未ログイン' }), { status: 401 });
    }

    const { id } = await request.json();

    await env.DB.prepare(
      'DELETE FROM words WHERE id = ? AND user_id = ?'
    ).bind(id, userId).run();

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};