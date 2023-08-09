import parser from "./parser";

export interface IWorker {
    parser: typeof parser
}