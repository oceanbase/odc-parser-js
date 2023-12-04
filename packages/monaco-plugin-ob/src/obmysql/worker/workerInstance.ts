import * as Comlink from 'comlink';
import { CorsWorker as Worker } from '../../corsWorker';
import { IWorker } from './type';
    //@ts-ignore
const corsWorker = new Worker(new URL(/* webpackChunkName: 'obmysql.worker' */'../../../worker-dist/obmysql.js', import.meta.url));

const wrapWorker = Comlink.wrap<any>(

    corsWorker.getWorker()
)

export default wrapWorker;