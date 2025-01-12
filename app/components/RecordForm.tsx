"use client";

import Image from "next/image";
import { useState } from "react";

// type Props = {}

type PlayerScore = {
  userId: number;
  scoreChange: number;
  chips: number;
};

type RoundData = {
  id: number;
  roundNumber: number;
  scores: PlayerScore[];
};

type FormData = {
  playedAt: string;
  rate: number;
  fee: number;
  chipRate: number;
  rounds: RoundData[];
};

const mockData = {
  id: 1,
  gameType: "SET",
  numberOfPlayers: 4,
  playedAt: "2025-01-09",
  rate: 100,
  chipRate: 200,
  fee: 2500,
  createdBy: {
    userId: 1,
    name: "Rei",
  },
  chipResults: [
    {
      userId: 1,
      name: "Rei",
      chipChange: 25,
    },
  ],
  rounds: [
    {
      id: 1,
      roundNumber: 1,
      results: [
        {
          userId: 1,
          name: "Rei",
          scoreChange: 20,
          rank: 1,
          position: 1,
        },
      ],
    },
  ],
};

console.log(mockData);

const RecordForm = () => {
  const [scoreColor, setScoreColor] = useState<{[key: string]: string}>({})

  const [formData, setFormData] = useState<FormData>({
    playedAt: new Date().toISOString().split("T")[0],
    rate: 0,
    fee: 0,
    chipRate: 0,
    rounds: [
      {
        id: Date.now(),
        roundNumber: 1,
        scores: [
          { userId: 1, scoreChange: 0, chips: 0 },
          { userId: 2, scoreChange: 0, chips: 0 },
          { userId: 0, scoreChange: 0, chips: 0 },
          { userId: 0, scoreChange: 0, chips: 0 },
        ],
      },
    ],
  });

  const updateFormValue = (
    field: keyof Omit<FormData, "rounds">,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const saveRoundScore = (
    roundIndex: number,
    userId: number,
    field: keyof PlayerScore,
    value: number,
  ) => {
    setFormData((prev) => {
      const updatedRounds = prev.rounds.map((round, index) => {
        if (index === roundIndex) {
          return {
            ...round,
            scores: round.scores.map((score) =>
              score.userId === userId ? { ...score, [field]: value } : score,
            ),
          };
        }
        return round;
      });
      return { ...prev, rounds: updatedRounds };
    });
  };

  const addRound = () => {
    setFormData((prev) => {
      const lastRoundNumber =
        prev.rounds.length > 0
          ? prev.rounds[prev.rounds.length - 1].roundNumber
          : 0;

      return {
        ...prev,
        rounds: [
          ...prev.rounds,
          {
            id: Date.now(),
            roundNumber: lastRoundNumber + 1,
            scores: prev.rounds[0].scores.map(({ userId }) => ({
              userId,
              scoreChange: 0,
              chips: 0,
            })),
          },
        ],
      };
    });
  };

  const deleteRound = (roundId: number) => {
    setFormData((prev) => ({
      ...prev,
      rounds: prev.rounds.filter((round) => round.id !== roundId),
    }));
  };

  const handleScoreChange = (
    roundId: number,
    userId: number,
    value: number,
  ) => {
    saveRoundScore(roundId, userId, "scoreChange", value);

    setScoreColor(prev => ({
      ...prev,
      [`${roundId}-${userId}`]: value > 0 ? "text-appleBlossom" : value < 0 ? "text-denim" : "text-black"
    }))
  };

  return (
    <form className="flex flex-col items-center gap-6">
      <input
        type="date"
        defaultValue={formData.playedAt}
        className="w-fit bg-transparent text-center text-lg font-bold"
        name="playedAt"
        onChange={(e) => updateFormValue("playedAt", e.target.value)}
      />
      <div className="flex gap-2">
        <div className="flex flex-col items-center gap-2 border border-appleBlossom bg-white px-[6px] py-2">
          <label htmlFor="rate" className="text-xs">
            レート(P/千点)
          </label>
          <input
            type="number"
            name="rate"
            className="w-full text-center focus:outline-none"
            onChange={(e) => updateFormValue("rate", Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col items-center gap-2 border border-oldGold bg-white px-[6px] py-2">
          <label htmlFor="fee" className="text-xs">
            ゲーム代(P/千点)
          </label>
          <input
            type="number"
            name="fee"
            className="w-full text-center focus:outline-none"
            onChange={(e) => updateFormValue("fee", Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col items-center gap-2 border border-amazon bg-white px-[6px] py-2">
          <label htmlFor="chipRate" className="text-xs">
            チップ(P/千点)
          </label>
          <input
            type="number"
            name="chipRate"
            className="w-full text-center focus:outline-none"
            onChange={(e) =>
              updateFormValue("chipRate", Number(e.target.value))
            }
          />
        </div>
      </div>
      <button
        type="submit"
        className="self-end rounded-lg bg-oldGold bg-opacity-50 px-5 py-2 text-xs"
      >
        編集完了
      </button>
      <table className="w-full border-collapse border-slate-400 bg-white">
        <thead>
          <tr>
            <th className="border border-slate-400"></th>
            <th className="h-14 w-14 border border-slate-400 bg-white pt-2">
              <div className="flex flex-col items-center gap-1">
                <Image
                  src="/icon-sample-man.jpg"
                  alt="sample"
                  width={32}
                  height={32}
                  className="aspect-square rounded-md object-cover"
                />
                <span className="w-[50px] truncate text-xs font-normal">
                  Ben Ono
                </span>
              </div>
            </th>
            <th className="h-14 w-14 border border-slate-400 pt-2">
              <div className="flex flex-col items-center gap-1">
                <Image
                  src="/icon-sample-man.jpg"
                  alt="sample"
                  width={32}
                  height={32}
                  className="aspect-square rounded-md object-cover"
                />
                <span className="w-[50px] truncate text-xs font-normal">
                  Ben Ono
                </span>
              </div>
            </th>
            <th className="h-14 w-14 border border-slate-400 pt-2">
              <div className="flex flex-col items-center gap-1">
                <Image
                  src="/icon-sample-man.jpg"
                  alt="sample"
                  width={32}
                  height={32}
                  className="aspect-square rounded-md object-cover"
                />
                <span className="w-[50px] truncate text-xs font-normal">
                  Ben Ono
                </span>
              </div>
            </th>
            <th className="h-14 w-14 border border-slate-400 pt-2">
              <div className="flex flex-col items-center gap-1">
                <Image
                  src="/icon-sample-man.jpg"
                  alt="sample"
                  width={32}
                  height={32}
                  className="aspect-square rounded-md object-cover"
                />
                <span className="w-[50px] truncate text-xs font-normal">
                  Ben Ono
                </span>
              </div>
            </th>
            <th className="h-14 w-14 border border-slate-400 pt-2"></th>
          </tr>
        </thead>
        <tbody>
          {formData.rounds.map((round, index) => (
            <tr key={round.id}>
              <td className="h-14 w-14 border border-slate-400 bg-pineGlade bg-opacity-20 text-center">
                {index + 1}
              </td>
              {round.scores.map((score, scoreIndex) => (
                <td
                  key={scoreIndex}
                  className="border border-slate-400 text-center"
                >
                  <input
                    type="number"
                    className={`h-14 w-14 border-transparent p-1 text-center focus:outline-none ${scoreColor[`${round.id}-${score.userId}`] || "text-black"}`}
                    onChange={(e) =>
                      handleScoreChange(
                        round.id,
                        score.userId,
                        Number(e.target.value),
                      )
                    }
                  />
                </td>
              ))}
              <td
                className="border border-slate-400 bg-red-100 text-center text-xl"
                onClick={() => deleteRound(round.id)}
              >
                <button
                  onClick={() => deleteRound(round.id)}
                  disabled={formData.rounds.length === 1}
                >
                  x
                </button>
              </td>
            </tr>
          ))}

          <tr>
            <td colSpan={6} className="h-14 px-6">
              <button
                type="button"
                onClick={addRound}
                className="w-full bg-pineGlade py-2"
              >
                追加する
              </button>
            </td>
          </tr>

          {/* 合計 */}
          <tr className="border-t-2 border-slate-400">
            <td className="h-14 w-14 border border-slate-400 bg-oldGold bg-opacity-20 text-center text-xs">
              計
            </td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
          </tr>

          <tr>
            <td className="h-14 w-14 border border-slate-400 bg-oldGold bg-opacity-20 text-center text-xs">
              チップ
              <br />
              (枚)
            </td>
            <td className="border border-slate-400">
              <input
                type="number"
                className="h-14 w-14 border-transparent p-1 text-center focus:outline-none"
              />
            </td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
          </tr>

          <tr>
            <td className="h-14 w-14 border border-slate-400 bg-oldGold bg-opacity-20 text-center text-xs">
              収支
              <br />
              (P)
            </td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
          </tr>

          <tr>
            <td className="h-14 w-14 border border-slate-400 bg-oldGold bg-opacity-20 text-center text-xs">
              ゲーム代込
              <br />
              (P)
            </td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default RecordForm;
