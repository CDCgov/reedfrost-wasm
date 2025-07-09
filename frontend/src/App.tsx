import { run } from "@wasm/reedfrost";
import { useEffect, useState } from "react";

export function App() {
  let [result, setResult] = useState<number | null>(null);
  useEffect(() => {
    const result = run();
    setResult(result);
  }, []);
  return <div>{result === null ? <>Loading...</> : <>Result: {result}</>}</div>;
}
