type Scores = {
  CP: number;
  NP: number;
  A: number;
  FC: number;
  AC: number;
};

const HIGH = 80;
const LOW = 50;

export function generateComment(scores: Scores): string[] {
  const comments: string[] = [];

  if (scores.NP >= HIGH && scores.AC <= LOW) {
    comments.push(
      "他者への配慮が高く、自分の判断で行動できる傾向があります。周囲を支えながら主体的に取り組める力が強みです。"
    );
  }

  if (scores.CP >= HIGH) {
    comments.push(
      "規律やルールを大切にする傾向があります。集団の秩序を守る役割を担いやすい一方、状況に応じた柔軟さも意識すると良いでしょう。"
    );
  }

  if (scores.FC >= HIGH) {
    comments.push(
      "自由な発想や感情表現が豊かです。創造的な活動や自己表現の場で力を発揮しやすいでしょう。"
    );
  }

  if (scores.A <= LOW) {
    comments.push(
      "感情や周囲の影響を受けやすい傾向が見られます。事実や情報を整理して考える時間を持つことが助けになります。"
    );
  }

  if (comments.length === 0) {
    comments.push(
      "各尺度のバランスが比較的取れています。状況に応じて多様な行動を選択できる柔軟性があります。"
    );
  }

  return comments;
}
