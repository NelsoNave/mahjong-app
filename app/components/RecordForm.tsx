"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type PlayerScore = {
  userId: number;
  userName: string;
  scoreChange: number;
  chips: number;
};

type RoundData = {
  id: number;
  roundNumber: number;
  results: PlayerScore[];
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
  const [scoreColor, setScoreColor] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<FormData>({
    playedAt: new Date().toISOString().split("T")[0],
    rate: 0,
    fee: 0,
    chipRate: 0,
    rounds: [
      {
        id: Date.now(),
        roundNumber: 1,
        results: [
          { userId: 1, userName: "", scoreChange: 0, chips: 0 },
          { userId: 2, userName: "", scoreChange: 0, chips: 0 },
          { userId: 3, userName: "", scoreChange: 0, chips: 0 },
          { userId: 4, userName: "", scoreChange: 0, chips: 0 },
        ],
      },
    ],
  });

  const updateFormValue = useCallback(
    (field: keyof Omit<FormData, "rounds">, value: string | number) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const calculateScoreColor = (score: number): string => {
    if (score > 0) return "text-appleBlossom";
    if (score < 0) return "text-denim";
    return "text-black";
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
            results: prev.rounds[0].results.map(({ userId }) => ({
              userId,
              userName: "",
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
    setFormData((prev) => {
      const updatedRound: RoundData[] = prev.rounds.map((round) => {
        if (round.id !== roundId) return round;

        const updatedScores = round.results.map((result) => {
          if (result.userId === userId) {
            return {
              ...result,
              scoreChange: value,
            };
          }
          return result;
        });

        const filledScores = updatedScores.filter(
          (result) =>
            result.scoreChange !== null &&
            result.scoreChange !== undefined &&
            result.scoreChange !== 0,
        );

        if (filledScores.length === updatedScores.length - 1) {
          const filledSum = updatedScores.reduce(
            (sum, result) => sum + (result.scoreChange || 0),
            0,
          );

          const updatedWithRemainingScore = updatedScores.map((result) => {
            if (
              result.scoreChange === null ||
              result.scoreChange === undefined ||
              result.scoreChange === 0
            ) {
              return { ...result, scoreChange: -filledSum };
            }
            return result;
          });

          const updatedScoreColors = updatedWithRemainingScore.reduce(
            (colors, result) => ({
              ...colors,
              [`${round.id}-${result.userId}`]: calculateScoreColor(
                result.scoreChange || 0,
              ),
            }),
            {},
          );

          setScoreColor((prev) => ({ ...prev, ...updatedScoreColors }));

          return { ...round, results: updatedWithRemainingScore };
        }
        return { ...round, results: updatedScores };
      });
      return { ...prev, rounds: updatedRound };
    });

    setScoreColor((prev) => ({
      ...prev,
      [`${roundId}-${userId}`]: calculateScoreColor(value),
    }));
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
            id="rate"
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
            id="fee"
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
            id="chipRate"
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
              {round.results.map((result, resultIndex) => (
                <td
                  key={resultIndex}
                  className="border border-slate-400 text-center"
                >
                  <input
                    type="number"
                    className={`h-14 w-14 border-transparent p-1 text-center focus:outline-none ${scoreColor[`${round.id}-${result.userId}`] || "text-black"}`}
                    value={result.scoreChange || ""}
                    onChange={(e) =>
                      handleScoreChange(
                        round.id,
                        result.userId,
                        Number(e.target.value) || 0,
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
            <td className="border border-slate-400">
              <input
                type="number"
                className="h-14 w-14 border-transparent p-1 text-center focus:outline-none"
              />
            </td>
            <td className="border border-slate-400">
              <input
                type="number"
                className="h-14 w-14 border-transparent p-1 text-center focus:outline-none"
              />
            </td>
            <td className="border border-slate-400">
              <input
                type="number"
                className="h-14 w-14 border-transparent p-1 text-center focus:outline-none"
              />
            </td>
            <td className="border border-slate-400">
              <input
                type="number"
                className="h-14 w-14 border-transparent p-1 text-center focus:outline-none"
              />
            </td>
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
