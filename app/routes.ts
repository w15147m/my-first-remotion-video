import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./pages/home.tsx"),
  route("/test", "./pages/test.tsx"),
  route("/api/lambda/progress", "./api/progress.tsx"),
  route("/api/lambda/render", "./api/render.tsx"),
] satisfies RouteConfig;
