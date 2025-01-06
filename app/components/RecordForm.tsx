import Image from "next/image";
import React from "react";

// type Props = {}

const RecordForm = () => {
  const date = new Date().toISOString().split("T")[0];
  return (
    <form className="flex flex-col items-center gap-6">
      <input
        type="date"
        defaultValue={date}
        className="w-fit bg-transparent text-center text-lg font-bold"
        name="playedAt"
      />
      <div className="flex gap-2">
        <div className="flex flex-col items-center gap-2 border border-appleBlossom bg-white px-[6px] py-2">
          <label htmlFor="rate" className="text-xs">
            レート(P/千点)
          </label>
          <input type="number" name="rate" className="w-full" />
        </div>
        <div className="border-oldGold flex flex-col items-center gap-2 border bg-white px-[6px] py-2">
          <label htmlFor="fee" className="text-xs">
            ゲーム代(P/千点)
          </label>
          <input type="number" name="fee" className="w-full" />
        </div>
        <div className="flex flex-col items-center gap-2 border border-amazon bg-white px-[6px] py-2">
          <label htmlFor="chipRate" className="text-xs">
            チップ(P/千点)
          </label>
          <input type="number" name="chipRate" className="w-full" />
        </div>
      </div>
      <button
        type="submit"
        className="bg-oldGold self-end rounded-lg bg-opacity-50 px-5 py-2 text-xs"
      >
        編集完了
      </button>
      <table className="w-full bg-white border-collapse border-slate-400">
        <thead>
          <tr>
            <th className="border border-slate-400"></th>
            <th className="h-14 w-14 pt-2 bg-white border border-slate-400">
              <div className="flex flex-col items-center gap-1">
                <Image
                  src="/icon-sample-man.jpg"
                  alt="sample"
                  width={32}
                  height={32}
                  className="rounded-md object-cover aspect-square"
                />
                <span className="w-[50px] truncate text-xs font-normal">
                  Ben Ono
                </span>
              </div>
            </th>
            <th className="h-14 w-14 pt-2 border border-slate-400">
              <div className="flex flex-col items-center gap-1">
                <Image
                  src="/icon-sample-man.jpg"
                  alt="sample"
                  width={32}
                  height={32}
                  className="rounded-md object-cover aspect-square"
                />
                <span className="w-[50px] truncate text-xs font-normal">
                  Ben Ono
                </span>
              </div>
            </th>
            <th className="h-14 w-14 pt-2 border border-slate-400">
              <div className="flex flex-col items-center gap-1">
                <Image
                  src="/icon-sample-man.jpg"
                  alt="sample"
                  width={32}
                  height={32}
                  className="rounded-md object-cover aspect-square"
                />
                <span className="w-[50px] truncate text-xs font-normal">
                  Ben Ono
                </span>
              </div>
            </th>
            <th className="h-14 w-14 pt-2 border border-slate-400">
              <div className="flex flex-col items-center gap-1">
                <Image
                  src="/icon-sample-man.jpg"
                  alt="sample"
                  width={32}
                  height={32}
                  className="rounded-md object-cover aspect-square"
                />
                <span className="w-[50px] truncate text-xs font-normal">
                  Ben Ono
                </span>
              </div>
            </th>
            <th className="h-14 w-14 pt-2 border border-slate-400"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-slate-400 h-14 w-14 text-center bg-pineGlade bg-opacity-20">1</td>
            <td className="border border-slate-400 text-center">62</td>
            <td className="border border-slate-400 text-center">-61</td>
            <td className="border border-slate-400 text-center">-15</td>
            <td className="border border-slate-400 text-center">39</td>
            <td className="border border-slate-400 text-center text-center">x</td>
          </tr>

          {/* 合計 */}
          <tr>
            <td className="bg-oldGold h-14 w-14 bg-opacity-20 text-center text-xs border border-slate-400">
              計
            </td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
          </tr>

          <tr>
            <td className="bg-oldGold h-14 w-14 border border-slate-400 bg-opacity-20 text-center text-xs">
              チップ
              <br />
              (枚)
            </td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
            <td className="border border-slate-400"></td>
          </tr>

          <tr>
            <td className="bg-oldGold h-14 w-14 border border-slate-400 bg-opacity-20 text-center text-xs">
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
            <td className="bg-oldGold h-14 w-14 border border-slate-400 bg-opacity-20 text-center text-xs">
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
