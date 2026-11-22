"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { dataset, projectId } from "./sanity/env";

export default defineConfig({
  name: "dj-estre",
  title: "DJ ESTRE / Content Studio",
  basePath: "/studio",
  projectId: projectId || "missing-project-id",
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
