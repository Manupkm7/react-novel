"use client";

import React, { createContext } from "react";

export const NovelContext = createContext<{
  completionApi: string;
}>({
  completionApi: "/api/generate",
});
