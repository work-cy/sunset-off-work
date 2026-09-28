import React from "react";
import { TITLE } from "./config.js";

// 中文字体必须排在栈的最前。若让无中文字形的字体先被查询再回退，
// 浏览器可能带出异常的字形背景，且文字辉光会明显变弱。
const CJK_STACK =
  '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", "Source Han Sans SC", "Hiragino Sans GB", sans-serif';
const MONO_STACK = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export const Title = ({ opacity, height }) => {
  if (opacity <= 0.002) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${TITLE.y * 100}%`,
        transform: "translateY(-50%)",
        textAlign: "center",
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: CJK_STACK,
          fontSize: height * 0.053,
          fontWeight: 700,
          // 字间距会在末字后多留一份，靠左内边距补回来才真居中
          letterSpacing: "0.2em",
          paddingLeft: "0.2em",
          color: "#F7E9D6",
          textShadow: `0 0 ${height * 0.028}px rgba(255, 196, 128, 0.42)`,
        }}
      >
        {TITLE.main}
      </div>
      <div
        style={{
          fontFamily: MONO_STACK,
          fontSize: height * 0.0135,
          fontWeight: 500,
          letterSpacing: "0.44em",
          paddingLeft: "0.44em",
          marginTop: height * 0.014,
          color: "#F3D9B4",
          opacity: 0.7,
        }}
      >
        {TITLE.sub}
      </div>
    </div>
  );
};
