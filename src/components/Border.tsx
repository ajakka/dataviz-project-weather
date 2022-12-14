import "./Border.css";
import React from "react";

function Border(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  return (
    <div
      className="border-comp"
      style={{
        ...props.style,
        borderStyle: "solid",
        borderColor: "#3D550C",
        borderWidth: 2,
        borderRadius: 8,
      }}
    >
      {props.children}
    </div>
  );
}

export default Border;
