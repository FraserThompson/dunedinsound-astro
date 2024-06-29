import { LoadingSpinnerWrapper } from "./LoadingSpinner.css";

export default () => (
  <div className={LoadingSpinnerWrapper}>
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
)
