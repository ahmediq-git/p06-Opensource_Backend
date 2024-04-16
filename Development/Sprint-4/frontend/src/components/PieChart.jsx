import React, { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import bytes from "bytes";

const PieChartCard = ({ data, total }) => {
  return (
    <div className="max-w-sm mx-auto mt-8 bg-[#1a1a1a] rounded-xl overflow-hidden shadow-md">
      <div className="px-6 py-4">
        <div className="font-bold text-xl">Space Occupied</div>
        <div className="flex justify-center relative">
          <PieChart
            data={[...data]}
            label={({ dataEntry }) => {
              if (dataEntry.title === "Total") return "";
              return `${Math.round(dataEntry.percentage)}%`;
            }}
            labelStyle={(index) => ({
              fill: "#FFFFFF",
              fontSize: "0px",
              fontFamily: "sans-serif",
            })}
            radius={35}
            lineWidth={40}
            startAngle={-90}
            className="m-[-15px]"
            animate
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xl text-white font-semibold">
              {bytes(total)}
            </div>
          </div>
        </div>

        <div>
          {data.map((item, index) => (
            <div className="flex justify-between items-center" key={index}>
              <div className="flex flex-row items-center">
                <div
                  className="h-2 w-4 mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-white text-left justify-start">
                  {item.title}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-white mr-2">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartCard;
