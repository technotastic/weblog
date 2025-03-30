// src/App.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { blogPosts as initialBlogPostsData } from './blogData'; // Using data from blogData.ts

// --- Hooks ---
function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        listener();
        if (media.addEventListener) media.addEventListener('change', listener);
        else media.addListener(listener); // Deprecated fallback
        return () => {
            if (media.removeEventListener) media.removeEventListener('change', listener);
            else media.removeListener(listener); // Deprecated fallback
        };
    }, [query]);
    return matches;
}

// --- Interfaces ---
interface BlogPost {
    id: string;
    title: string;
    date: string;
    content: string;
    tags: string[];
}

// --- Components ---
const VisitorCounter: React.FC = () => {
    const [count, setCount] = useState<string | null>(null);
    useEffect(() => {
        const fakeCount = Math.floor(Math.random() * 1000) + 123;
        setCount(fakeCount.toString().padStart(6, '0'));
    }, []);
    if (!count) return null;
    const counterStyle: React.CSSProperties = { border: '2px inset #888888', padding: '2px 5px', backgroundColor: '#000000', color: '#00FF00', fontFamily: '"Courier New", Courier, monospace', display: 'inline-block', letterSpacing: '2px', margin: '0 5px 0 0' };
    return <span style={counterStyle}>{count.split('').map((digit, index) => <span key={index}>{digit}</span>)}</span>;
};

// --- Main App Component ---
const RetroBlogApp: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>(initialBlogPostsData);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [viewingPostId, setViewingPostId] = useState<string | null>(null);

    // --- Handle Hash Changes for Routing ---
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#/post/')) {
                const postId = hash.substring('#/post/'.length);
                if (posts.some(p => p.id === postId)) {
                    setViewingPostId(postId);
                    window.scrollTo(0, 0);
                } else {
                    console.warn(`Post with ID "${postId}" not found.`);
                    window.location.hash = '';
                }
            } else {
                 if (viewingPostId !== null) {
                    setViewingPostId(null);
                 }
            }
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [posts, viewingPostId]);

    // --- Memos and Callbacks ---
    const sortedPosts = useMemo<BlogPost[]>(() => [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [posts]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(sortedPosts);

    useEffect(() => {
        let tempPosts: BlogPost[] = sortedPosts;
        if (selectedTag) tempPosts = tempPosts.filter((post) => post.tags.includes(selectedTag));
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            tempPosts = tempPosts.filter(post =>
                (post.title?.toLowerCase().includes(query)) ||
                (post.content?.toLowerCase().includes(query)) ||
                (post.tags?.some(tag => tag?.toLowerCase().includes(query)))
            );
        }
        setFilteredPosts(tempPosts);
    }, [selectedTag, searchQuery, sortedPosts]);

    const allTags = useMemo<string[]>(() => Array.from(new Set(posts.flatMap(post => post.tags))).sort(), [posts]);
    const handleTagClick = useCallback((tag: string) => { setSelectedTag(prev => prev === tag ? null : tag); setSearchQuery(''); window.location.hash = ''; }, []);
    const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(event.target.value); window.location.hash = ''; }, []);
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();
    const handleTagAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, tag: string) => { e.preventDefault(); handleTagClick(tag); if (isMobile) setShowFilters(false); };
    const handleShowAllClick = (e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); setSelectedTag(null); setSearchQuery(''); if (isMobile) setShowFilters(false); window.location.hash = ''; };
    const handleTagNavigation = (e: React.MouseEvent<HTMLAnchorElement>, tag: string) => { e.preventDefault(); setSelectedTag(tag); setSearchQuery(''); window.location.hash = ''; if (isMobile) setShowFilters(false); };
    const handleTitleClick = useCallback(() => { setSelectedTag(null); setSearchQuery(''); window.location.hash = ''; setShowFilters(false); window.scrollTo(0, 0); }, []);

    // --- Styles ---
    const retroButtonStyle: React.CSSProperties = { borderWidth: '2px', borderStyle: 'outset', borderColor: '#E0E0E0 #808080 #808080 #E0E0E0', backgroundColor: '#C0C0C0', color: '#000000', padding: '3px 8px', margin: '5px 0', cursor: 'pointer', fontFamily: 'Arial, sans-serif', fontSize: '1em', borderRadius: '0', display: 'block', width: '100%' };
    const retroInputStyle: React.CSSProperties = { border: '2px inset #808080', backgroundColor: '#FFFFFF', color: '#000000', padding: '3px 5px', fontFamily: 'Arial, sans-serif', fontSize: '1em', borderRadius: '0', flexGrow: 1 };
    const tagStyleBase: React.CSSProperties = { color: '#0000FF', textDecoration: 'underline', cursor: 'pointer', marginRight: '10px', fontFamily: '"Courier New", Courier, monospace', fontSize: '0.9em', display: 'block', marginBottom: '3px' };
    const selectedTagStyle: React.CSSProperties = { ...tagStyleBase, backgroundColor: '#FFFF00', color: '#000000', textDecoration: 'none', padding: '1px 3px', border: '1px solid black', display: 'inline-block', marginBottom: '3px' };
    const sidebarStyleBase: React.CSSProperties = { verticalAlign: 'top', borderRight: isMobile ? 'none' : '2px inset #808080', backgroundColor: '#E0E0E0', padding: '10px', width: isMobile ? '100%' : '200px', minWidth: isMobile ? 'none' : '200px', minHeight: isMobile ? 'auto' : '65vh', borderBottom: isMobile ? '2px inset #808080' : 'none' };
    const postListContainerStyleBase: React.CSSProperties = { verticalAlign: 'top', padding: '10px', backgroundColor: '#FFFFFF', scrollbarWidth: 'thin', scrollbarColor: '#888888 #E0E0E0' };
    const postListContainerStyle: React.CSSProperties = isMobile ? { ...postListContainerStyleBase } : { ...postListContainerStyleBase, maxHeight: '75vh', minHeight: '65vh', height: '75vh', overflowY: 'auto' };
    const postCardStyle: React.CSSProperties = { border: '1px solid #B0B0B0', backgroundColor: '#FDFDFD', padding: '10px 15px', marginBottom: '15px', boxShadow: '2px 2px 0px 0px #A0A0A0' };
    const plainTextStyle: React.CSSProperties = { whiteSpace: 'pre-wrap', lineHeight: '1.4', fontSize: '1em', fontFamily: '"Courier New", Courier, monospace', backgroundColor: '#F8F8F8', padding: '8px', border: '1px solid #E0E0E0' };
    const tagsSectionStyle: React.CSSProperties = { marginTop: '10px', paddingTop: '8px', borderTop: '1px dotted #AAAAAA', paddingLeft: '0px' };
    const postTitleLinkStyle: React.CSSProperties = { textDecoration: 'none', color: '#000080', cursor: 'pointer' };
    const singlePostContainerStyle: React.CSSProperties = { padding: '15px', backgroundColor: '#FFFFFF', minHeight: isMobile? 'auto' : '65vh', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#888888 #E0E0E0' };

    // --- Reusable Render Functions ---
    const renderSidebarContent = () => (
        <>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1em', borderBottom: '1px solid #808080', paddingBottom: '3px' }}>TAGS:</h3>
            {/* "Show All" link added at the TOP */}
            <a
                href="#"
                onClick={handleShowAllClick}
                style={{...tagStyleBase, marginBottom: '10px'}} // Added margin below
                title="Show all posts / Clear tag filter"
            >
                -- Show All --
            </a>
            {/* End of top "Show All" link */}
            {allTags.map(tag => (
                <a key={tag} href="#" onClick={e => handleTagAnchorClick(e, tag)} style={selectedTag === tag ? selectedTagStyle : tagStyleBase} title={`Filter by ${tag}`}>
                    {tag}
                </a>
             ))}
            <hr style={{ border: 'none', borderTop: '1px dashed #808080', margin: '15px 0' }} />
             {/* Bottom "Show All" link */}
            <a href="#" onClick={handleShowAllClick} style={tagStyleBase} title="Show all posts / Clear tag filter">
                Show All
            </a>
        </>
    );

    const renderPostCards = () => (
        <>
            {filteredPosts.length === 0 && (searchQuery || selectedTag) && (<p style={{ padding: '10px' }}><i>No posts found matching your criteria...</i></p>)}
            {posts.length === 0 && (<p style={{ padding: '10px' }}><i>No posts available yet!</i></p>)}
            {filteredPosts.map(post => (
                <div key={post.id} style={postCardStyle}>
                    <h2 style={{ margin: '0 0 5px 0', fontSize: '1.5em' }}><a href={`#/post/${post.id}`} style={postTitleLinkStyle} title={`View post: ${post.title}`}>{post.title}</a></h2>
                    <p style={{ fontSize: '0.8em', margin: '0 0 15px 0', color: '#555555' }}>Posted: {post.date}</p>
                    <div style={plainTextStyle}>{post.content.substring(0, 250)}{post.content.length > 250 ? '...' : ''}</div>
                    <div style={tagsSectionStyle}>
                        <b style={{ fontSize: '0.9em' }}>Tags:</b>{' '}
                        {post.tags.map(tag => (<React.Fragment key={tag}><a href="#" onClick={e => handleTagNavigation(e, tag)} style={{ ...tagStyleBase, marginRight: '5px', display: 'inline-block', marginBottom: '0' }} title={`Show all posts tagged '${tag}'`}>[{tag}]</a></React.Fragment>))}
                    </div>
                    <div style={{ marginTop: '10px', textAlign: 'right' }}><a href={`#/post/${post.id}`} style={{...tagStyleBase, display: 'inline-block', marginBottom: '0'}}>Read More »</a></div>
                </div>
            ))}
        </>
    );

    const renderSinglePost = (postId: string) => {
        const post = posts.find(p => p.id === postId);
        if (!post) return (<div style={singlePostContainerStyle}><p>Post not found.</p><a href="#" onClick={e => {e.preventDefault(); window.location.hash='';}} style={{...tagStyleBase, display: 'inline-block', marginBottom: '0'}}>« Back to Blog List</a></div>);
        return (
            <div style={singlePostContainerStyle}>
                <div style={{ marginBottom: '15px', borderBottom: '1px dotted #AAAAAA', paddingBottom: '10px' }}><a href="#" onClick={e => {e.preventDefault(); window.location.hash='';}} style={{...tagStyleBase, display: 'inline-block', marginBottom: '0'}}>« Back to Blog List</a></div>
                <h1 style={{ margin: '0 0 10px 0', fontSize: '2em', color: '#000080', borderBottom: '2px solid #C0C0C0', paddingBottom: '5px' }}>{post.title}</h1>
                <p style={{ fontSize: '0.9em', margin: '0 0 20px 0', color: '#555555' }}>Posted: {post.date}</p>
                <div style={plainTextStyle}>{post.content}</div>
                <div style={tagsSectionStyle}>
                    <b style={{ fontSize: '0.9em' }}>Tags:</b>{' '}
                    {post.tags.map(tag => (<React.Fragment key={tag}><a href="#" onClick={e => handleTagNavigation(e, tag)} style={{ ...tagStyleBase, marginRight: '5px', display: 'inline-block', marginBottom: '0' }} title={`Show all posts tagged '${tag}'`}>[{tag}]</a></React.Fragment>))}
                </div>
            </div>
        );
    };

    // --- Main Render ---
    return (
        <div style={{ backgroundColor: '#C0C0C0', color: '#000000', fontFamily: '"Times New Roman", Times, serif', border: '3px outset #E0E0E0', padding: '0', margin: '10px auto', width: '95%', maxWidth: '1200px', minHeight: 'calc(100vh - 20px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            {!viewingPostId && (
                 <div style={{ borderBottom: '3px outset #E0E0E0', padding: '10px', display: isMobile ? 'block' : 'flex', flexWrap: 'wrap', alignItems: 'flex-start', flexShrink: 0 }}>
                    {!isMobile && (<marquee behavior="scroll" direction="left" scrollamount="3" style={{ backgroundColor: '#808080', color: '#FFFF00', padding: '2px', border: '1px solid black', marginBottom: '5px', width: '100%' }}><tt>===*** MY COOL RETRO BLOG ***===</tt></marquee>)}
                    <div style={{ flex: isMobile ? 'none' : '1 1 auto', minWidth: isMobile ? 'none' : '250px', paddingRight: isMobile ? '0' : '10px' }}>
                        <h1 onClick={handleTitleClick} style={{ margin: '0 0 2px 0', fontSize: '1.3em', lineHeight: '1.2', fontWeight: 'bold', color: '#000000', textAlign: isMobile ? 'center' : 'left', cursor: 'pointer', display: 'inline-block' }} title="Back to Home / Reset Filters">My Retro Blog</h1>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.85em', color: '#333333', textAlign: isMobile ? 'center' : 'left' }}>Est. 1993 - Welcome!</p>
                    </div>
                    <div style={{ flex: isMobile ? 'none' : '0 1 auto', textAlign: isMobile ? 'left' : 'right', width: isMobile ? '100%' : 'auto' }}>
                        <form onSubmit={handleFormSubmit} style={{ marginBottom: '8px', display: 'flex' }}><input type="text" placeholder="Search this site..." value={searchQuery} onChange={handleSearchChange} style={retroInputStyle} /></form>
                        {isMobile && (<button onClick={() => setShowFilters(!showFilters)} style={{...retroButtonStyle, width: '100%' }}>{showFilters ? 'Hide Filters [-]' : 'Show Filters [+]'}</button>)}
                        <div style={{marginTop: '8px', fontSize: '0.8em', textAlign: isMobile ? 'center' : 'right' }}><span>Visitor Count: </span><VisitorCounter /></div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div style={{ flexGrow: !viewingPostId ? 1 : 0 }}>
                {viewingPostId ? (
                    renderSinglePost(viewingPostId)
                ) : isMobile ? (
                    <div>
                        {showFilters && (<div style={sidebarStyleBase}>{renderSidebarContent()}</div>)}
                        <div style={postListContainerStyle}>{renderPostCards()}</div>
                    </div>
                ) : (
                    <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', height: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={sidebarStyleBase}>{renderSidebarContent()}</td>
                                <td style={postListContainerStyle}>{renderPostCards()}</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>

            {/* Footer */}
            <table style={{ width: '100%', borderTop: '3px outset #E0E0E0', backgroundColor: '#A0A0A0', flexShrink: 0 }} cellPadding="5" cellSpacing="0"><tbody><tr><td style={{ textAlign: 'center' }}><p style={{ fontSize: '0.8em', margin: '0', color: '#FFFFFF' }}>© 1993-1995 My Retro Blog... <br /></p></td></tr></tbody></table>
        </div>
    );
};

export default RetroBlogApp;