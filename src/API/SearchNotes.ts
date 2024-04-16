import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

async function searchNotes(query: string): Promise<any> {    
    const currUser = (await supabase.auth.getSession()).data.session?.user;
    const currUserID = currUser?.id;

    // Get the user's notes first
    const { data: notes, error } = await supabase
    .from('notes').
    select()
    .eq('user_id', currUserID);

    // For the query
    const formattedQuery = query.split(' ').map(word => `'${word}'`).join(' | ');

    // For each note, select the note's ID and then query the sections table where the parent
    // note ID is the note ID and then do a full text search for the query in the sections' content
    const searchResults = [];
    if (notes) {
        for (const note of notes) {
            const { data: sections, error: sectionsError } = await supabase
                .from('sections')
                .select('section_content, section_title')
                .eq('parent_note_id', note.id)
                .textSearch('section_content', formattedQuery);
            
            if (sections?.length !== 0) {
                searchResults.push(sections);
            }
    

            if (sectionsError) {
                console.error(sectionsError);
                continue;
            }

        }
    }
    console.log(currUser)
    return searchResults[0]
}

export default searchNotes;