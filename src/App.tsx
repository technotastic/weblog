// src/App.tsx

// ... (Imports, Interfaces, Data, Hooks remain the same) ...
import React, { useState, useEffect, useCallback, useMemo } from 'react';
function useMediaQuery(query: string): boolean { /* ... hook code ... */ const [matches, setMatches] = useState(false); useEffect(() => { if (typeof window === 'undefined') return; const media = window.matchMedia(query); const listener = () => setMatches(media.matches); listener(); if (media.addEventListener) media.addEventListener('change', listener); else media.addListener(listener); return () => { if (media.removeEventListener) media.removeEventListener('change', listener); else media.removeListener(listener); }; }, [query]); return matches; }
interface BlogPost { id: string; title: string; date: string; content: string; tags: string[]; }
const initialBlogPosts: BlogPost[] = [ /* ... Your plain text posts ... */ { id: '1', title: 'My First Webpage! WOW!', date: '1993-02-15', content: `Welcome...\n\n...\n\n(Imagine a dancing banana here!)`, tags: ['first post', 'html', 'web development', 'geocities'] }, { id: '2', title: 'The Wonders...', date: '1993-03-01', content: `I can't believe...\n\nName | Age | Fav\n...\nMe    | ??  | This Blog! :)`, tags: ['web', 'internet', 'search', 'yahoo', 'cool sites'] }, { id: '3', title: 'Learning JavaScript...', date: '1995-12-04', content: `Okay, this new...\n\n// My first script...\n...\n... gotta test that.`, tags: ['javascript', 'netscape', 'programming', 'newbie'] }, ];
const VisitorCounter: React.FC = () => { /* ... VisitorCounter code ... */ const [count, setCount] = useState<string | null>(null); useEffect(() => { const fakeCount = Math.floor(Math.random() * 1000) + 123; setCount(fakeCount.toString().padStart(6, '0')); }, []); if (!count) return null; const counterStyle: React.CSSProperties = { border: '2px inset #888888', padding: '2px 5px', backgroundColor: '#000000', color: '#00FF00', fontFamily: '"Courier New", Courier, monospace', display: 'inline-block', letterSpacing: '2px', margin: '0 5px 0 0' }; return <span style={counterStyle}>{count.split('').map((digit, index) => <span key={index}>{digit}</span>)}</span>; };

const RetroBlogApp: React.FC = () => {
    // ... (State, Hooks, Callbacks remain the same) ...
    const [posts] = useState<BlogPost[]>(initialBlogPosts);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    // showFilters state is now primarily for mobile
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const sortedPosts = useMemo<BlogPost[]>(() => { return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); }, [posts]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(sortedPosts);
    useEffect(() => { let tempPosts: BlogPost[] = sortedPosts; if (selectedTag) { tempPosts = tempPosts.filter((post) => post.tags.includes(selectedTag)); } if (searchQuery) { const query = searchQuery.toLowerCase(); tempPosts = tempPosts.filter((post) => (post.title && post.title.toLowerCase().includes(query)) || (post.content && post.content.toLowerCase().includes(query)) || (post.tags && post.tags.some((tag) => tag && tag.toLowerCase().includes(query)))); } setFilteredPosts(tempPosts); }, [selectedTag, searchQuery, sortedPosts]);
    const allTags = useMemo<string[]>(() => { return Array.from(new Set(posts.flatMap((post) => post.tags))).sort(); }, [posts]);
    const handleTagClick = useCallback((tag: string) => { setSelectedTag((prevTag) => (prevTag === tag ? null : tag)); }, []);
    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(event.target.value); }, []);
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); };
    // No need to hide filters on desktop tag click
    const handleTagAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, tag: string) => { e.preventDefault(); handleTagClick(tag); if (isMobile) setShowFilters(false); };
    const handleShowAllClick = (e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); setSelectedTag(null); if (isMobile) setShowFilters(false); };
    // No need to show filters on desktop post tag click
    const handlePostTagClick = (e: React.MouseEvent<HTMLAnchorElement>, tag: string) => { e.preventDefault(); handleTagClick(tag); /* Removed setShowFilters(true) */ };

    // --- Styles (Unchanged) ---
    const retroButtonStyle: React.CSSProperties = { borderWidth: '2px', borderStyle: 'outset', borderColor: '#E0E0E0 #808080 #808080 #E0E0E0', backgroundColor: '#C0C0C0', color: '#000000', padding: '3px 8px', margin: '5px 0', cursor: 'pointer', fontFamily: 'Arial, sans-serif', fontSize: '1em', borderRadius: '0', display: 'block', width: '100%' };
    const retroInputStyle: React.CSSProperties = { border: '2px inset #808080', backgroundColor: '#FFFFFF', color: '#000000', padding: '3px 5px', fontFamily: 'Arial, sans-serif', fontSize: '1em', borderRadius: '0', flexGrow: 1 };
    const tagStyleBase: React.CSSProperties = { color: '#0000FF', textDecoration: 'underline', cursor: 'pointer', marginRight: '10px', fontFamily: '"Courier New", Courier, monospace', fontSize: '0.9em', display: 'block', marginBottom: '3px' };
    const selectedTagStyle: React.CSSProperties = { ...tagStyleBase, backgroundColor: '#FFFF00', color: '#000000', textDecoration: 'none', padding: '1px 3px', border: '1px solid black', display: 'inline-block', marginBottom: '3px' };
    const sidebarStyleBase: React.CSSProperties = { verticalAlign: 'top', borderRight: isMobile ? 'none' : '2px inset #808080', backgroundColor: '#E0E0E0', padding: '10px', width: isMobile ? '100%' : '200px', minWidth: isMobile ? 'none' : '200px', minHeight: isMobile ? 'auto' : '65vh', borderBottom: isMobile ? '2px inset #808080' : 'none' };
    // sidebarContentStyle is no longer needed for desktop logic
    // const sidebarContentStyle: React.CSSProperties = { display: showFilters ? 'block' : 'none' };
    const postListContainerStyle: React.CSSProperties = { verticalAlign: 'top', padding: '10px', backgroundColor: '#FFFFFF', maxHeight: '75vh', minHeight: isMobile? '50vh' : '65vh', height: isMobile ? 'auto' : '75vh', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#888888 #E0E0E0' };
    const postCardStyle: React.CSSProperties = { border: '1px solid #B0B0B0', backgroundColor: '#FDFDFD', padding: '10px 15px', marginBottom: '15px', boxShadow: '2px 2px 0px 0px #A0A0A0' };
    const plainTextStyle: React.CSSProperties = { whiteSpace: 'pre-wrap', lineHeight: '1.4', fontSize: '1em', fontFamily: '"Courier New", Courier, monospace', backgroundColor: '#F8F8F8', padding: '8px', border: '1px solid #E0E0E0' };
    const tagsSectionStyle: React.CSSProperties = { marginTop: '10px', paddingTop: '8px', borderTop: '1px dotted #AAAAAA', paddingLeft: '0px' };

    // --- Reusable Render Functions (Unchanged) ---
    const renderSidebarContent = () => ( <> <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1em', borderBottom: '1px solid #808080', paddingBottom: '3px' }}>TAGS:</h3> {allTags.map((tag) => ( <a key={tag} href="#" onClick={(e) => handleTagAnchorClick(e, tag)} style={selectedTag === tag ? selectedTagStyle : tagStyleBase} title={`Filter by ${tag}`}>{tag}</a> ))} <hr style={{border: 'none', borderTop: '1px dashed #808080', margin: '15px 0'}}/> <a href="#" onClick={handleShowAllClick} style={tagStyleBase}>Show All</a> </> );
    const renderPostCards = () => ( <> {filteredPosts.length === 0 && (searchQuery || selectedTag) && (<p style={{padding: '10px'}}><i>No posts found matching your criteria...</i></p>)} {posts.length === 0 && (<p style={{padding: '10px'}}><i>No posts available yet!</i></p>)} {filteredPosts.map((post) => ( <div key={post.id} style={postCardStyle}> <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5em', color: '#000080' }}>{post.title}</h2> <p style={{ fontSize: '0.8em', margin: '0 0 15px 0', color: '#555555' }}>Posted: {post.date}</p> <div style={plainTextStyle}>{post.content}</div> <div style={tagsSectionStyle}> <b style={{ fontSize: '0.9em' }}>Tags:</b>{' '} {post.tags.map((tag) => ( <React.Fragment key={tag}><a href="#" onClick={(e) => handlePostTagClick(e, tag)} style={{ ...tagStyleBase, marginRight: '5px', display: 'inline-block', marginBottom: '0' }} title={`Filter by ${tag}`}>[{tag}]</a></React.Fragment> ))} </div> </div> ))} </> );

     // --- Main Render ---
     return (
         <div style={{ backgroundColor: '#C0C0C0', color: '#000000', fontFamily: '"Times New Roman", Times, serif', border: '3px outset #E0E0E0', padding: '0', margin: '10px auto', width: '95%', maxWidth: '1200px', minHeight: 'calc(100vh - 20px)' }}>
             {/* Header */}
             <div style={{ borderBottom: '3px outset #E0E0E0', padding: '10px', display: isMobile ? 'block' : 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                 {/* Marquee (Desktop only) */}
                 {!isMobile && ( <marquee behavior="scroll" direction="left" scrollamount="3" style={{ backgroundColor: '#808080', color: '#FFFF00', padding: '2px', border: '1px solid black', marginBottom: '5px', width: '100%' }}><tt>===*** MY COOL RETRO BLOG ***===</tt></marquee> )}

                 {/* Left Side (Desktop) / Top Part (Mobile) */}
                 <div style={{ flex: isMobile ? 'none' : '1 1 auto', minWidth: isMobile ? 'none' : '250px', paddingRight: isMobile ? '0' : '10px' }}>
                     <h1 style={{ margin: '0 0 2px 0', fontSize: '1.3em', lineHeight: '1.2', fontWeight: 'bold', color: '#000000', textAlign: isMobile ? 'center' : 'left' }}>My Retro Blog</h1>
                     <p style={{ margin: '0 0 10px 0', fontSize: '0.85em', color: '#333333', textAlign: isMobile ? 'center' : 'left' }}>Est. 1993 - Welcome!</p>
                 </div>

                 {/* Right Side (Desktop) / Bottom Part (Mobile Controls) */}
                 <div style={{ flex: isMobile ? 'none' : '0 1 auto', textAlign: isMobile ? 'left' : 'right', width: isMobile ? '100%' : 'auto' }}>
                      <form onSubmit={handleFormSubmit} style={{ marginBottom: '8px', display: 'flex' }}>
                         <input type="text" placeholder="Search this site..." value={searchQuery} onChange={handleSearchChange} style={retroInputStyle} />
                      </form>

                      {/* *** RENDER BUTTON ONLY ON MOBILE *** */}
                      {isMobile && (
                          <button onClick={() => setShowFilters(!showFilters)} style={{...retroButtonStyle, width: '100%' }}>
                              {showFilters ? 'Hide Filters [-]' : 'Show Filters [+]'}
                          </button>
                      )}

                      <div style={{marginTop: '8px', fontSize: '0.8em', textAlign: isMobile ? 'center' : 'right' }}>
                          <span>Visitor Count: </span>
                          <VisitorCounter />
                      </div>
                 </div>
             </div>


             {/* Conditional Content Layout */}
             {isMobile ? ( /* Mobile: Stacked Content */
                 <div>
                     {/* Filters appear here when toggled based on state */}
                     {showFilters && (
                        <div style={sidebarStyleBase}>
                            {renderSidebarContent()}
                        </div>
                     )}
                     <div style={postListContainerStyle}>
                        {renderPostCards()}
                     </div>
                 </div>
             ) : ( /* Desktop: Table */
                 <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                     <tbody>
                         <tr>
                             <td style={sidebarStyleBase}>
                                {/* *** ALWAYS RENDER SIDEBAR CONTENT ON DESKTOP *** */}
                                {renderSidebarContent()}
                             </td>
                             <td style={postListContainerStyle}>
                                {renderPostCards()}
                             </td>
                         </tr>
                     </tbody>
                 </table>
             )}

             {/* Footer */}
             <table style={{ width: '100%', borderTop: '3px outset #E0E0E0', backgroundColor: '#A0A0A0' }} cellPadding="5" cellSpacing="0"><tbody><tr> <td style={{ textAlign: 'center' }}> <p style={{ fontSize: '0.8em', margin: '0', color: '#FFFFFF' }}>© 1993-1995 My Retro Blog... <br/> {/* Badges */}</p> </td> </tr></tbody></table>
         </div>
     );
 };

 export default RetroBlogApp;