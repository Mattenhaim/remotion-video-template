/**
 * 文案解析：`*词*` 标记强调词；按空格拆词（拉丁文），无空格（中日韩）按字拆。
 * 纯标点 token 并入前一个 token，避免标点单独动画。
 * 拆词约定沿用底盘 Vincentwei1021/video-shotcraft template/src/aifl/Main.tsx 的
 * parseWords（`*word*` = accent），按需扩展了 CJK 按字拆分。
 */
export type Token = { text: string; accent?: boolean };

const PUNCT = /^[\s\p{P}\p{S}]+$/u;

export function tokenize(text: string): Token[] {
  const groups: Token[] = [];
  const re = /\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) groups.push({ text: text.slice(last, m.index) });
    groups.push({ text: m[1], accent: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) groups.push({ text: text.slice(last) });

  const out: Token[] = [];
  for (const seg of groups) {
    const units = seg.text.includes(' ')
      ? seg.text.split(/\s+/).filter(Boolean).map((t) => ({ text: t, accent: seg.accent }))
      : Array.from(seg.text).map((ch) => ({ text: ch, accent: seg.accent }));
    for (const u of units) {
      if (out.length > 0 && PUNCT.test(u.text) && u.text.trim() !== '') {
        out[out.length - 1].text += u.text;
      } else if (u.text.trim() !== '') {
        out.push(u);
      } else if (out.length > 0) {
        out[out.length - 1].text += u.text;
      }
    }
  }
  return out;
}

/** 去掉 * 号的纯文本（字幕条用） */
export function plainText(text: string): string {
  return text.replace(/\*/g, '');
}
