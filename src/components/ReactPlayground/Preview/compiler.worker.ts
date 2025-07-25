import { compile } from "./compiler";

self.addEventListener("message", async ({ data }) => {
  console.log('compile-data', data)
  try {
    self.postMessage({
      type: "COMPILED_CODE",
      data: await compile(data),
    });
  } catch (e) {
    self.postMessage({
      type: "error",
      data: e,
    });
  }
});
