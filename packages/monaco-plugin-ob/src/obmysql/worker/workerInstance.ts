import * as Comlink from 'comlink';
import { CorsWorker as Worker } from '../../corsWorker';
import { IWorker } from './type';
    //@ts-ignore
const corsWorker = new Worker(window.obMonaco.getWorkerUrl('obmysql'));

const wrapWorker = Comlink.wrap<any>(

    corsWorker.getWorker()
)

export default wrapWorker;