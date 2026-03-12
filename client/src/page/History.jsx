import { useParams } from "react-router-dom";

export default function History() {
  const { batchId } = useParams();

  return (
    <div style={{color:"white"}}>
      <h1>Batch Analysis</h1>
      <p>Batch ID: {batchId}</p>
    </div>
  );
}