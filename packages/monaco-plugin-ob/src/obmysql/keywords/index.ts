import reservedKeywords from './reserved';
import unreservedKeywords from './unreserved';
import { keywords as _PLKeywords } from './pl'

export const keywords = unreservedKeywords.concat(reservedKeywords);


export const PLKeywords = _PLKeywords;