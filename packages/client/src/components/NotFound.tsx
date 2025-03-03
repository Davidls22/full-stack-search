import { NotFoundProps } from "../types/props";

const NotFound = ({ type }: NotFoundProps) => (
  <div className="card result-section">
    <div className="card-header gradient-background text-white text-center">
      No {type} Matched
    </div>
  </div>
);

export default NotFound;
