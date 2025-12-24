declare module "assets/**/*" {
    interface ParserClass {
        prototype: ParserPrototype;
        parse(input: string, offset?: number, completionCallback?: (tokens: string[], currentRules: string[], followRules: string[]) => void): any;
    }

    interface ParserPrototype {
        parse(input: string, offset?: number, completionCallback?: (tokens: string[], currentRules: string[], followRules: string[]) => void): any;
    }

    interface ParserModule {
        Parser: ParserClass;
        parse(input: string, offset?: number, completionCallback?: (tokens: string[], currentRules: string[], followRules: string[]) => void): any;
    }

    const Parser: ParserModule;
    export default Parser;
    export function process(): void;
}

export {};