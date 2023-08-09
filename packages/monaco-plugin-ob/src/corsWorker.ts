export class CorsWorker {
    private readonly worker: Worker;

    constructor(url: string | URL) {
        //@ts-ignore
        if (process.env.NODE_ENV==='development') {
            this.worker = new Worker(url.toString());
        } else {
            const objectURL = URL.createObjectURL(
                new Blob([`importScripts(${JSON.stringify(url.toString())});`], {
                    type: 'application/javascript'
                })
            );
            this.worker = new Worker(objectURL);
            URL.revokeObjectURL(objectURL);
        }
    }

    getWorker() {
        return this.worker;
    }
}