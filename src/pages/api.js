// src/pages/api.js
export const POST = async ({ request }) => {
    try {
      const { text } = await request.json();
      const apiKey = import.meta.env.GEMINI_API_KEY;
  
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "APIキーが.envに設定されていません。" }), { status: 400 });
      }
  
      // 英語判定
      const isEnglish = /^[A-Za-z0-9\s,.-?!]+$/.test(text);
      const prompt = isEnglish 
        ? `ユーザーが「${text}」という英語を入力しました。以下の3点を【必ず指定のJSONフォーマットのみ】で返却してください。余計な解説文は一切含めないでください。\n{\n  "translation": "日本語の翻訳（簡潔に）",\n  "example": "この単語を使った日常会話で使える自然な短い英語の例文",\n  "meaning": "その例文の日本語訳"\n}`
        : `ユーザーが「${text}」という日本語を入力しました。以下の3点を【必ず指定のJSONフォーマットのみ】で返却してください。余計な解説文は一切含めないでください。\n{\n  "translation": "対応する英単語や英語フレーズ（簡潔に）",\n  "example": "その英単語やフレーズを使った日常会話で使える自然な短い英語の例文",\n  "meaning": "その例文の日本語訳"\n}`;
  
      // 💡 AQ.から始まる認証キーに対応するため、リクエストヘッダーに 'X-Goog-Api-Key' を明示的に指定します
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey // 認証用ヘッダーを追加
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return new Response(JSON.stringify({ error: errorData.error?.message || "Geminiの認証に失敗しました" }), { status: 500 });
      }
  
      const resJson = await response.json();
      const jsonText = resJson.candidates[0].content.parts[0].text; // 最新のデータ階層に修正
      const parsed = JSON.parse(jsonText);
  
      return new Response(JSON.stringify({ original: text, ...parsed }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
  
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  };
  