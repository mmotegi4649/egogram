import { useState, useEffect } from "react";
import { questions } from "./data/questions";
import LineChart from "./components/LineChart";
import { generateComment } from "./utils/diagnosis";

type Step = "start" | "question" | "confirm" | "result";

export default function App() {
  const [step, setStep] = useState<Step>("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 初期値はnull（未選択）。5と6の間にフォーカスがある状態
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  
  // 質問ID → 回答値 (1-10)
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const currentQuestion = questions[currentIndex];

  // 回答処理
  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].id]: value,
    }));
    
    // アクティブな要素（今押したボタン）からフォーカスを外す
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (currentIndex === questions.length - 1) {
      setStep("confirm");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // 次の質問では未選択状態にする
      setSelectedValue(null);
    }
  };

  // キーボードイベント制御
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (step === "start") {
        if (e.key === "Enter") {
          setStep("question");
          setCurrentIndex(0);
        }
      } else if (step === "question") {
        if (e.key === "ArrowLeft") {
          // 左キー：未選択なら5へ、選択済なら1減らす
          setSelectedValue((v) => (v === null ? 5 : Math.max(1, v - 1)));
        } else if (e.key === "ArrowRight") {
          // 右キー：未選択なら6へ、選択済なら1増やす
          setSelectedValue((v) => (v === null ? 6 : Math.min(10, v + 1)));
        } else if (e.key === "Enter") {
          if (selectedValue !== null) {
            handleAnswer(selectedValue);
          }
        } else if (e.key === "Backspace") {
          goBack();
        }
      } else if (step === "confirm") {
        if (e.key === "Enter") setStep("result");
        if (e.key === "ArrowLeft") setStep("question");
      } else if (step === "result") {
        if (e.key === "Escape") {
          setStep("start");
          setAnswers({});
          setCurrentIndex(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, selectedValue, currentIndex, answers]);

  // 質問が変わるたびに、過去の回答があればセット、なければnull
  useEffect(() => {
    if (currentQuestion) {
      setSelectedValue(answers[currentQuestion.id] ?? null);
    }
  }, [currentIndex, currentQuestion, answers]);
  
  // ② 質問が変わったときに強制的にどこにもフォーカスさせない
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    // 保存された回答がある場合はセット、なければnull
    setSelectedValue(answers[questions[currentIndex].id] ?? null);
  }, [currentIndex]);

  // スコア計算
  const scores = { CP: 0, NP: 0, A: 0, FC: 0, AC: 0 };
  questions.forEach((q) => {
    scores[q.scale] += answers[q.id] || 0;
  });

  const comments = generateComment(scores);

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 800, textAlign: "center", background: "white", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <h1>
          <img src="./egogram_illustrations_brain.png" alt="brain" style={{ width: 50, marginRight: 20 }} />
          エゴグラム診断
          <img src="./egogram_illustrations_5types.png" alt="5types" style={{ width: 200, marginLeft: 20 }} />
        </h1>
        {step === "start" && (
          <>
            <p style={{ fontSize: 18, marginBottom: "30px" }}>
              これから質問が{questions.length}つ表示されます。<br />
              <strong>左右の矢印キー</strong>で直感に近い方を選び、<br />
              <strong>Enterキー</strong>で決定してください。
            </p>
            <button
              onClick={() => setStep("question")}
              style={{ fontSize: 24, padding: "15px 40px", background: "#4CAF50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
            >
              診断スタート
            </button>
          </>
        )}

        {step === "question" && currentQuestion && (
          <>
            <div style={{ fontSize: 18, marginBottom: 10 }}>
              <img src="./egogram_illustrations_list.png" alt="list" style={{ width: 30, verticalAlign: "middle", marginRight: 8 }} />
              質問 {currentIndex + 1} / {questions.length}
            </div>

            {/* プログレスバー */}
            <div style={{ background: "#eee", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 40 }}>
              <div
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                  height: "100%",
                  background: "#4CAF50",
                  transition: "width 0.3s ease"
                }}
              />
            </div>

            <div style={{ fontSize: 28, fontWeight: "bold", margin: "40px 0" }}>
              {currentQuestion.text}
            </div>

            {/* 10段階グラデーション選択エリア */}
            <div style={{ margin: "20px auto", maxWidth: "600px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontWeight: "bold" }}>
                <span>あてはまらない</span>
                <span>あてはまる</span>
              </div>
              
              <div style={{ 
                display: "flex", 
                background: "linear-gradient(to right, #a1c4fd 0%, #fecfef 50%, #ff9a9e 100% )", 
                padding: "8px", 
                borderRadius: "10px",
                position: "relative"
              }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => {
                  const isSelected = selectedValue === v;
                  return (
                    <button
                      key={v}
                      onClick={() => {
                        setSelectedValue(v);
                        handleAnswer(v); // タップで即回答する場合
                      }}
                      style={{
                        flex: 1,
                        height: "70px",
                        margin: "0 2px",
                        /* ① 緑の枠を削除し、フォーカス時の黒枠を活かす設定 */
                        border: "1px solid rgba(255,255,255,0.3)",
                        background: isSelected ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)",
                        color: "#333",
                        fontSize: "18px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        borderRadius: "4px",
                        transition: "all 0.1s",
                        position: "relative",
                        outlineColor: "black", // フォーカス時の枠線を黒に明示
                      }}
                    >
                      {" "}
                    </button>
                  );
                })}
              </div>
              <p style={{ marginTop: "20px", color: "#888" }}>
                {selectedValue === null ? "タップまたは左右キーで選択してください" : `選択：レベル ${selectedValue}`}
              </p>
            </div>

            <div style={{ marginTop: "40px" }}>
              <button
                onClick={goBack}
                disabled={currentIndex === 0}
                style={{ padding: "10px 20px", fontSize: 16, cursor: currentIndex === 0 ? "not-allowed" : "pointer" }}
              >
                ← 前の質問へ
              </button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <button onClick={() => setStep("question")} style={{ marginRight: "10px", padding: "10px 20px" }}>修正する</button>
            <button 
              onClick={() => setStep("result")} 
              style={{ padding: "10px 20px", background: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}
            >
              診断結果を見る
            </button>
          </>
        )}

        {step === "result" && (
          <div>
            <div className="print-area">
              <p style={{ textAlign: "right" }}>
                （　　）年（　　）組　氏名（　　　　　　　　）
              </p>
              <h3>
              <img src="./egogram_illustrations_notice.png" alt="notice" style={{ width: 50, marginRight: 20 }} />
                エゴグラム診断 結果レポート（学習用）
              </h3>
              <ul style={{ textAlign: "left" }}>
                <li>このレポートは、あなたの考え方や行動の<strong>傾向</strong>を知るためのものです。<br /></li>
                <li>成績や評価を目的としたものではありません。</li>
              </ul>
              <LineChart scores={scores} />
              
              <div style={{ textAlign: "left", marginTop: "20px" }}>
                <h4>診断コメント</h4>
                <ul>
                  {comments.map((c, i) => <li key={i}>{c}</li>)}
                  <li>※各項目の詳細な解説は次のページに書いてあります</li>
                </ul>

                <h3>振り返り</h3>
                <p style={{ textAlign: "left" }}>
                  裏面の解説を読み、振り返りをしてみよう<br />
                  気づいたこと：<br /><br />
                  意外だったこと：<br /><br />
                  これから意識したいこと：
                </p>

                {/* 改ページ（PDFで2枚目にしたい場合） */}
                <div className="page-break" />

                {/* ===== 印刷用エゴグラム解説（A4・1ページ対応）===== */}
                <style>{`
                @media print {
                  @page { size: A4; margin: 10mm; }
                  body { margin: 0; }
                  table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 11px; line-height: 1.2; }
                  th, td { border: 1px solid #333; padding: 6px 8px; vertical-align: top; }
                  th { width: 22%; background: #f2f2f2; text-align: left; white-space: nowrap; }
                  h3 { font-size: 15px; margin: 14px 0 6px; text-align: left; }
                  li { font-size: 11px;}
                  .print-area { page-break-inside: avoid; }
                  .no-print { display: none !important; }
                }
                `}</style>

                <div className="print-scale">
                  <h4>５つの自我状態</h4>
                {[
                  {
                    t: "Critical Parent（批判的な親）",
                    m: "規範・ルール・正義感・責任感\n「～すべき」「正しくあれ」",
                    h: "規律を守る／判断が早い／責任感が強い",
                    l: "柔軟／他者に寛容／縛られにくい",
                    c: "高すぎると → 厳しさ・批判的",
                    i: "CP",
                  },
                  {
                    t: "Nurturing Parent（養育的な親）",
                    m: "思いやり・共感・支援\n「大丈夫」「助け合おう」",
                    h: "優しい／支える／面倒見がよい",
                    l: "自立的／感情に流されにくい",
                    c: "高すぎると → 甘やかし・自己犠牲",
                    i: "NP",
                  },
                  {
                    t: "Adult（大人）",
                    m: "論理的・客観的判断\n「事実は？」",
                    h: "冷静／問題解決が得意",
                    l: "感情や価値観に左右されやすい",
                    c: "低い＝ダメではない",
                    i: "A",
                  },
                  {
                    t: "Free Child（自由な子ども）",
                    m: "創造性・表現・楽しさ\n「やりたい！」",
                    h: "発想力／明るさ／表現力",
                    l: "落ち着き／自制心",
                    c: "高すぎると → 衝動的",
                    i: "FC",
                  },
                  {
                    t: "Adapted Child（順応した子ども）",
                    m: "協調・我慢・適応\n「合わせる」",
                    h: "協調性／集団適応力",
                    l: "自己主張／独立心",
                    c: "高すぎると → ストレス",
                    i: "AC",
                  },
                ].map(({ t, m, h, l, c, i }) => (
                  <div key={t}>
                    <h3>{t}</h3>
                    {/* 横並びにするためのコンテナ */}
                    <div style={{ display: "flex", gap: "20px", alignItems: "start" }}>
                      
                      {/* 左側：テーブル（70%） */}
                      <div style={{ flex: "0 0 70%" }}>
                    
                        <table>
                          <tbody>
                            <tr><th>意味</th><td>{m}</td></tr>
                            <tr><th>高い場合</th><td>{h}</td></tr>
                            <tr><th>低い場合</th><td>{l}</td></tr>
                            <tr><th>注意</th><td>{c}</td></tr>
                          </tbody>
                        </table>

                      </div>

                      {/* 右側：画像（30%） */}
                      <div style={{ flex: "0 0 30%", textAlign: "center" }}>
                        <img 
                          src={`./egogram_illustrations_type_${i}.png`} 
                          alt={t}
                          style={{ alignItems: "center", width: "40%", height: "auto", borderRadius: "8px" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                </div>

                {/* 横並びにするためのコンテナ */}
                <div style={{ display: "flex", gap: "20px", alignItems: "start" }}>
                  
                  {/* 左側 */}
                  <div style={{ flex: "0 0 50%" }}>
                    <h3>この結果の活かし方</h3>
                    <ul style={{ textAlign: "left" }}>
                      <li>自分の得意なところに気づく</li>
                      <li>苦手に感じる場面を理解する</li>
                      <li>行動の選択肢を増やすヒントにする</li>
                    </ul>
                  </div>
                
                  {/* 右側 */}
                  <div style={{ flex: "0 0 50%" }}>
                    <h3>注意点</h3>
                    <ul style={{ textAlign: "left" }}>
                      <li>この結果で人を比べたり評価したりしません。</li>
                      <li>結果は成長や経験によって変化します。</li>
                      <li>他人の結果を無理に共有する必要はありません。</li>
                    </ul>
                  </div>
                </div>
              </div>
              
            </div>
            <button onClick={() => window.print()} style={{ marginTop: "20px", padding: "10px 20px", background: "#333", color: "white" }}>
              印刷 / PDF保存
            </button>
            <button onClick={() => setStep("start")} style={{ marginLeft: "10px" }}>トップに戻る</button>
            <p style={{ fontSize: 10, color: "#555" }} className="no-print">
              ※ 印刷の際は「両面印刷（長辺とじ）」を選択してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}