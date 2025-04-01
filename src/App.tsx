import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { blogPosts as initialBlogPostsData } from './blogData';
import './App.css'; // Import the CSS file

// --- Hooks ---
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    listener();
    // Use addEventListener/removeEventListener if available, otherwise fallback
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // Deprecated fallback for older browsers
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
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
  imageUrl?: string; 
}

// --- Components ---
const VisitorCounter: React.FC = () => {
  const [count, setCount] = useState<string | null>(null);
  useEffect(() => {
    // Simulate fetching or calculating a count
    const fakeCount = Math.floor(Math.random() * 1000) + 123;
    setCount(fakeCount.toString().padStart(6, '0'));
  }, []);

  if (!count) return null;

  return (
    <span className="visitor-counter">
      {count.split('').map((digit, index) => (
        <span key={index}>{digit}</span>
      ))}
    </span>
  );
};

// --- Main App Component ---
const BlogApp: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogPostsData);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [viewingPostId, setViewingPostId] = useState<string | null>(null);

  // Handle Hash Changes for Routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/post/')) {
        const postId = hash.substring('#/post/'.length);
        if (posts.some((p) => p.id === postId)) {
          setViewingPostId(postId);
          window.scrollTo(0, 0);
        } else {
          console.warn(`Post with ID "${postId}" not found.`);
          window.location.hash = ''; // Reset hash if post not found
        }
      } else {
        // Only reset viewingPostId if it was previously set
        if (viewingPostId !== null) {
          setViewingPostId(null);
        }
      }
    };
    handleHashChange(); // Initial check
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [posts, viewingPostId]); // viewingPostId added to deps

  // Memos and Callbacks
  const sortedPosts = useMemo<BlogPost[]>(
    () =>
      [...posts].sort(
        (a, b) => parseInt(b.id, 10) - parseInt(a.id, 10)
      ),
    [posts]
  );
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(sortedPosts);

  useEffect(() => {
    let tempPosts: BlogPost[] = sortedPosts;
    if (selectedTag) {
      tempPosts = tempPosts.filter((post) => post.tags.includes(selectedTag));
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tempPosts = tempPosts.filter(
        (post) =>
          post.title?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag?.toLowerCase().includes(query))
      );
    }
    setFilteredPosts(tempPosts);
  }, [selectedTag, searchQuery, sortedPosts]);

  const allTags = useMemo<string[]>(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts]
  );

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
    setSearchQuery('');
    window.location.hash = ''; // Clear hash when filtering by tag
  }, []);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      window.location.hash = ''; // Clear hash when searching
    },
    []
  );

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    e.preventDefault();

  const handleTagAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tag: string
  ) => {
    e.preventDefault();
    handleTagClick(tag);
    if (isMobile) setShowFilters(false); // Hide filters on mobile after selection
  };

  const handleShowAllClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSelectedTag(null);
    setSearchQuery('');
    if (isMobile) setShowFilters(false); // Hide filters on mobile
    window.location.hash = ''; // Clear hash when showing all
  };

  // Navigate to tag filter *from* a post or post list item
  const handleTagNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tag: string
  ) => {
    e.preventDefault();
    setSelectedTag(tag);
    setSearchQuery('');
    window.location.hash = ''; // Ensure we are back on the list view
    if (isMobile) setShowFilters(false); // Hide filters if mobile
  };

  const handleTitleClick = useCallback(() => {
    setSelectedTag(null);
    setSearchQuery('');
    window.location.hash = ''; // Ensure back on list view
    setShowFilters(false); // Reset filter visibility
    window.scrollTo(0, 0);
  }, []);

  // Reusable Render Functions
  const renderSidebarContent = () => (
    <>
      <h3 className="sidebar-title">TAGS:</h3>
      <a
        href="#"
        onClick={handleShowAllClick}
        className="tag-link tag-link--sidebar tag-link--show-all-top"
        title="Show all posts / Clear tag filter"
      >
        -- Show All --
      </a>
      {allTags.map((tag) => (
        <a
          key={tag}
          href="#"
          onClick={(e) => handleTagAnchorClick(e, tag)}
          className={`tag-link tag-link--sidebar ${
            selectedTag === tag ? 'tag-link--selected' : ''
          }`}
          title={`Filter by ${tag}`}
        >
          {tag}
        </a>
      ))}
      <hr className="sidebar-hr" />
      <a
        href="#"
        onClick={handleShowAllClick}
        className="tag-link tag-link--sidebar"
        title="Show all posts / Clear tag filter"
      >
        Show All
      </a>
    </>
  );

  // Reusable Render Functions
  const renderPostCards = () => (
    <>
      {filteredPosts.length === 0 && (searchQuery || selectedTag) && (
        <p className="no-posts-message">
          No posts found matching your criteria...
        </p>
      )}
      {posts.length === 0 && (
        <p className="no-posts-message">No posts available yet!</p>
      )}
      {filteredPosts.map((post) => (
        <div key={post.id} className="post-card">
          <h2 className="post-card-title">
            <a
              href={`#/post/${post.id}`}
              className="post-title-link"
              title={`View post: ${post.title}`}
            >
              {post.title}
            </a>
          </h2>
          <p className="post-card-date">Posted: {post.date}</p>

          {post.imageUrl && (
            <div className="post-card-image-container">
              <a href={`#/post/${post.id}`} title={`View post: ${post.title}`}> {/* Optional: Make image clickable */}
                <img
                  src={post.imageUrl}
                  alt={`Thumbnail for post: ${post.title}`}
                  className="post-card-image"
                  loading="lazy" // Good for lists
                />
              </a>
            </div>
          )}

          <div className="plain-text-content">
            {/* Keep the substring logic for the text preview */}
            {post.content.substring(0, 250)}
            {post.content.length > 250 ? '...' : ''}
          </div>
          <div className="tags-section">
            <b className="tags-section-title">Tags:</b>{' '}
            {post.tags.map((tag) => (
              <React.Fragment key={tag}>
                <a
                  href="#"
                  onClick={(e) => handleTagNavigation(e, tag)}
                  className="tag-link tag-link--post"
                  title={`Show all posts tagged '${tag}'`}
                >
                  [{tag}]
                </a>{' '}
              </React.Fragment>
            ))}
          </div>
          <div className="read-more-section">
            <a
              href={`#/post/${post.id}`}
              className="tag-link tag-link--post" // Reuse tag link style
            >
              Read More »
            </a>
          </div>
        </div>
      ))}
    </>
  );

  const renderSinglePost = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      return (
        <div className="single-post-container">
          <p>Post not found.</p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
            }}
            className="tag-link tag-link--post" // Reuse tag link style
          >
            « Back to Blog List
          </a>
        </div>
      );
    }
    return (
      <div className="single-post-container">
        <div className="single-post-back-link-section">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
            }}
            className="tag-link tag-link--post" // Reuse tag link style
          >
            « Back to Blog List
          </a>
        </div>
        <h1 className="single-post-title">{post.title}</h1>
        <p className="single-post-date">Posted: {post.date}</p>

        {/* --- START: Image Rendering --- */}
        {post.imageUrl && (
          <div className="single-post-image-container">
            <img
              src={post.imageUrl}
              alt={`Image for post: ${post.title}`} 
              className="single-post-image"
              loading="lazy" 
            />
          </div>
        )}
        {/* --- END: Image Rendering --- */}

        <div className="plain-text-content">{post.content}</div>
        <div className="tags-section">
          <b className="tags-section-title">Tags:</b>{' '}
          {post.tags.map((tag) => (
            <React.Fragment key={tag}>
              <a
                href="#"
                onClick={(e) => handleTagNavigation(e, tag)}
                className="tag-link tag-link--post"
                title={`Show all posts tagged '${tag}'`}
              >
                [{tag}]
              </a>{' '}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="app-container">
      {/* Header: Only show when not viewing a single post */}
      {!viewingPostId && (
        <div className="app-header">
          {!isMobile && (
            <marquee
              behavior="scroll"
              direction="left"
              scrollAmount="3"
              className="header-marquee"
            >
              <tt>***===*** CHECK OUT MY SUPER COOL WEB LOG! ***===***</tt>
            </marquee>
          )}
          <div className="header-left">
            <h1
              onClick={handleTitleClick}
              className="header-title"
              title="Back to Home / Reset Filters"
            >
              technotastic's web log
            </h1>
            <p className="header-subtitle">Est. 2025 - Welcome!</p>
          </div>
          <div className="header-right">
            <form onSubmit={handleFormSubmit} className="search-form">
              <input
                type="text"
                placeholder="Search this site..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="retro-input"
              />
            </form>
            {isMobile && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="retro-button"
              >
                {showFilters ? 'Hide Filters [-]' : 'Show Filters [+]'}
              </button>
            )}
            <div className="visitor-info">
              <span>Visitor Count: </span>
              <VisitorCounter />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area: Changes layout based on view */}
      <div
        className={`main-content ${
          !viewingPostId ? 'main-content--list-view' : ''
        }`}
      >
        {viewingPostId ? (
          // Single Post View
          renderSinglePost(viewingPostId)
        ) : isMobile ? (
          // Mobile List View
          <div>
            {showFilters && <div className="sidebar">{renderSidebarContent()}</div>}
            <div className="post-list-container">{renderPostCards()}</div>
          </div>
        ) : (
          // Desktop List View (Table Layout)
          <table className="desktop-layout-table">
            <tbody>
              <tr>
                <td className="sidebar">{renderSidebarContent()}</td>
                <td className="post-list-container">{renderPostCards()}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <table className="app-footer" cellSpacing="0">
        <tbody>
          <tr>
            <td className="footer-content">
              <p className="footer-text">
                © 2025 technotastic's web log... <br />
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BlogApp;