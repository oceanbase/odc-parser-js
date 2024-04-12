import * as Comlink from 'comlink';
import { CorsWorker as Worker } from '../../corsWorker';
    //@ts-ignore
const corsWorker = new Worker(window.obMonaco.getWorkerUrl('oboracle'));

const wrapWorker = Comlink.wrap<any>(

    corsWorker.getWorker()
)

export default wrapWorker;