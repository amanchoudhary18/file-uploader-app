import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Storage = () => {
  const { userData } = useContext(UserContext);

  if (!userData) return <p>Loading...</p>;

  const remaining = userData.storageLimit - userData.totalUsed;

  const categoryColors = {
    document: "bg-blue-500",
    image: "bg-green-500",
    json: "bg-yellow-500",
    others: "bg-red-500",
    remaining: "bg-gray-200",
  };

  return (
    <div className="px-5 p-2">
      <div>
        <p className="text-slate-400 text-md">Total Storage</p>

        <div className="flex justify-between align-middle mt-1">
          <p className="text-slate-400">
            <span className="font-bold text-xl text-black">
              {(userData.totalUsed / (1024 * 1024)).toFixed(2)} MB
            </span>{" "}
            used
          </p>

          <p className="text-slate-400">
            From{" "}
            <span className="font-bold text-xl text-black">
              {(userData.storageLimit / (1024 * 1024)).toFixed(2)} MB
            </span>
          </p>
        </div>

        <div className="w-full h-2 mt-1 bg-gray-200 rounded-lg overflow-hidden">
          <div className="flex h-full">
            {Object.entries(userData.categories).map(([key, value]) => {
              const width = (value / userData.storageLimit) * 100;
              return (
                <div
                  key={key}
                  className={`${categoryColors[key]} h-full`}
                  style={{ width: `${width}%` }}
                  title={`${(value / (1024 * 1024)).toFixed(2)} MB`}
                ></div>
              );
            })}
            {remaining > 0 && (
              <div
                className={`${categoryColors.remaining} h-full`}
                style={{
                  width: `${(remaining / userData.storageLimit) * 100}%`,
                }}
                title={`Remaining: ${(remaining / (1024 * 1024)).toFixed(
                  2
                )} MB`}
              ></div>
            )}
          </div>
        </div>

        <div className="mt-2 flex gap-5 align-middle">
          {Object.keys(categoryColors)
            .filter((key) => key !== "remaining")
            .map((category) => (
              <div key={category} className="flex gap-1 align-middle">
                <div
                  className={`w-2 h-2 ${categoryColors[category]} rounded-full my-auto`}
                ></div>
                <p className="m-0 capitalize">{category}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Storage;
