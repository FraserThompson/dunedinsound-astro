import { cloud1, cloud2, cloud3, cloud4, cloud5, cloudBase, CloudsWrapper } from "./CloudBackground.css";

export default () => (
  <div className={`${CloudsWrapper}`}>
    <div className={`${cloud1}`}>
      <div className={`${cloudBase}`}></div>
    </div>

    <div className={`${cloud2}`}>
      <div className={`${cloudBase}`}></div>
    </div>

    <div className={`${cloud3}`}>
      <div className={`${cloudBase}`}></div>
    </div>

    <div className={`${cloud4}`}>
      <div className={`${cloudBase}`}></div>
    </div>

    <div className={`${cloud5}`}>
      <div className={`${cloudBase}`}></div>
    </div>
  </div>
)
