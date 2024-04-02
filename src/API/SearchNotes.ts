import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()
const chrono = require('chrono-node')
const natural = require('natural')
const TfIdf = natural.TfIdf;
const tfidf = new TfIdf();

async function searchNotes(query: string): Promise<string> {    
    // Use natural language to pre-process the query
    // First, get the most important keywords in the query, while accounting for stop words
    tfidf.addDocument(query);
    let keywords: any = tfidf.listTerms(0 /* document index */).slice(0, 10);
    keywords = keywords.filter((keyword: any) => !natural.stopwords.includes(keyword.term)).map((keyword: any) => keyword.term);
    const keywordString = keywords.join(' ');
    let tsquery = keywords.map((keyword: any) => `'${keyword}'`).join(' OR ');


    let dates = chrono.parseDate(query);
    let data, error;

    if (dates) {
        dates = dates.toISOString();
        const { data, error } = await supabase
            .from('notes')
            .select("*")
            // .gte("created_at", dates);

    } else {
        const { data, error } = await supabase
            .from('notes')
            .select("*")
            // .textSearch("content", `"iot"`);
    }

    if (error) {
        console.error(error);
        return "";
    }
    return data

}

export default searchNotes;