import { createBrowserHistory } from "history";
const browserHistory = typeof window !== 'undefined' ? createBrowserHistory() : undefined
export default browserHistory
