// src/pages/auth.js

// ログイン
export const POST = async ({ request, locals }) => {
    try {
      const { email } = await request.json();
      if (!email || !email.includes('@')) {
        return new Response(JSON.stringify({ error: '有効なメールアドレスを入力してください' }), { status: 400 });
      }
  
      // セッションにuser_idとして保存
      locals.session.set('user_id', email);
  
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  };
  
  // ログアウト
  export const DELETE = async ({ locals }) => {
    try {
      locals.session.delete('user_id');
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  };