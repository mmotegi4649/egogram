import { useEffect, useRef } from "react";

type Props = {
  scores: Record<string, number>;
};

export default function LineChart({ scores }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scales = ["CP", "NP", "A", "FC", "AC"];
  const maxScore = 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const padding = 50;

    ctx.clearRect(0, 0, w, h);

    /* ===== 軸 ===== */
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.stroke();

    /* ===== Y軸ラベル（0 / 50） ===== */
    ctx.fillStyle = "#333";
    ctx.font = "14px sans-serif";

    // 100
    ctx.fillText(
      "100",
      padding - 30,
      padding + 5
    );

    // 0
    ctx.fillText(
      "0",
      padding - 20,
      h - padding + 5
    );

    /* ===== X軸ラベル ===== */
    scales.forEach((s, i) => {
      const x =
        padding +
        (i * (w - padding * 2)) / (scales.length - 1);
      ctx.fillText(s, x - 10, h - padding + 25);
    });

    /* ===== 折れ線 ===== */
    ctx.strokeStyle = "#4CAF50";
    ctx.lineWidth = 3;
    ctx.beginPath();

    scales.forEach((s, i) => {
      const x =
        padding +
        (i * (w - padding * 2)) / (scales.length - 1);
      const y =
        h -
        padding -
        (scores[s] / maxScore) * (h - padding * 2);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    /* ===== プロット & スコア表示 ===== */
    scales.forEach((s, i) => {
      const x =
        padding +
        (i * (w - padding * 2)) / (scales.length - 1);
      const y =
        h -
        padding -
        (scores[s] / maxScore) * (h - padding * 2);

      // 点
      ctx.fillStyle = "#4CAF50";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // 数値
      ctx.fillStyle = "#000";
      ctx.font = "13px sans-serif";
      ctx.fillText(
        String(scores[s]),
        x - 8,
        y - 10
      );
    });
  }, [scores]);

  return <canvas ref={canvasRef} width={520} height={320} />;
}
