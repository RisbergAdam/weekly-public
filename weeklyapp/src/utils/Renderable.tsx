import React from "react";

import { Text } from "../components";

export type Renderable = string | number | JSX.Element;

export const renderRenderable = (value: Renderable | undefined) => {
  if (typeof value === "number" || typeof value === "string") {
    return <Text>{value}</Text>;
  } else {
    return value;
  }
};
