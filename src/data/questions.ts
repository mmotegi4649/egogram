export type Question = {
  id: number;
  text: string;
  scale: "CP" | "NP" | "A" | "FC" | "AC";
};

export const questions: Question[] = [
  // CP（批判的な親）
  { id: 1, text: "ルールや決まりは守るべきだと思う", scale: "CP" },
  { id: 2, text: "責任の所在をはっきりさせたい", scale: "CP" },
  { id: 3, text: "間違いは指摘する必要があると思う", scale: "CP" },
  { id: 4, text: "物事には正解・不正解があると感じる", scale: "CP" },
  { id: 5, text: "自分にも他人にも厳しい方だ", scale: "CP" },
  { id: 6, text: "規律が乱れるのが気になる", scale: "CP" },
  { id: 7, text: "筋の通らないことが苦手だ", scale: "CP" },
  { id: 8, text: "役割はきちんと果たすべきだ", scale: "CP" },
  { id: 9, text: "注意や指導をする立場になりやすい", scale: "CP" },
  { id: 10, text: "甘さより厳しさが必要だと思う", scale: "CP" },

  // NP（養育的な親）
  { id: 11, text: "困っている人を見ると助けたくなる", scale: "NP" },
  { id: 12, text: "相手の気持ちを考えて行動する", scale: "NP" },
  { id: 13, text: "人を励ますことが多い", scale: "NP" },
  { id: 14, text: "相手を受け入れる姿勢を大切にしている", scale: "NP" },
  { id: 15, text: "思いやりが大切だと思う", scale: "NP" },
  { id: 16, text: "相手の立場に立って考える", scale: "NP" },
  { id: 17, text: "相談されることが多い", scale: "NP" },
  { id: 18, text: "人の成長を支えたいと思う", scale: "NP" },
  { id: 19, text: "感謝やねぎらいを伝える", scale: "NP" },
  { id: 20, text: "安心できる雰囲気を作ろうとする", scale: "NP" },

  // A（大人）
  { id: 21, text: "感情より事実を重視する", scale: "A" },
  { id: 22, text: "情報を整理して考える", scale: "A" },
  { id: 23, text: "冷静に判断しようとする", scale: "A" },
  { id: 24, text: "データや根拠を大切にする", scale: "A" },
  { id: 25, text: "客観的に物事を見る", scale: "A" },
  { id: 26, text: "状況を分析して行動する", scale: "A" },
  { id: 27, text: "感情に流されにくい", scale: "A" },
  { id: 28, text: "効率を考える", scale: "A" },
  { id: 29, text: "事実と意見を分けて考える", scale: "A" },
  { id: 30, text: "合理的な判断を好む", scale: "A" },

  // FC（自由な子ども）
  { id: 31, text: "楽しいことを優先したい", scale: "FC" },
  { id: 32, text: "感情を素直に表現する", scale: "FC" },
  { id: 33, text: "ひらめきで行動することがある", scale: "FC" },
  { id: 34, text: "新しいことにワクワクする", scale: "FC" },
  { id: 35, text: "自分らしさを大切にしている", scale: "FC" },
  { id: 36, text: "遊び心がある", scale: "FC" },
  { id: 37, text: "感覚で決めることがある", scale: "FC" },
  { id: 38, text: "自由に表現したい", scale: "FC" },
  { id: 39, text: "気分に正直だ", scale: "FC" },
  { id: 40, text: "創造的な活動が好きだ", scale: "FC" },

  // AC（順応した子ども）
  { id: 41, text: "周囲に合わせて行動する", scale: "AC" },
  { id: 42, text: "空気を読むことが多い", scale: "AC" },
  { id: 43, text: "期待に応えようとする", scale: "AC" },
  { id: 44, text: "指示に従う方が安心する", scale: "AC" },
  { id: 45, text: "衝突を避けたい", scale: "AC" },
  { id: 46, text: "控えめに振る舞うことがある", scale: "AC" },
  { id: 47, text: "相手を優先する", scale: "AC" },
  { id: 48, text: "注意されないよう気をつける", scale: "AC" },
  { id: 49, text: "自分を抑えることがある", scale: "AC" },
  { id: 50, text: "周囲の評価が気になる", scale: "AC" },
];
