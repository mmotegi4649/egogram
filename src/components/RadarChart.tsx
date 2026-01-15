import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type Props = {
  scores: {
    CP: number;
    NP: number;
    A: number;
    FC: number;
    AC: number;
  };
};

export default function RadarChart({ scores }: Props) {
  const data = {
    labels: ["CP", "NP", "A", "FC", "AC"],
    datasets: [
      {
        label: "エゴグラム",
        data: [
          scores.CP,
          scores.NP,
          scores.A,
          scores.FC,
          scores.AC,
        ],
        fill: true,
      },
    ],
  };

  return <Radar data={data} />;
}
