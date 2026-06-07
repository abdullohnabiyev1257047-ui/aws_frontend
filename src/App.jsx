import { useState, useEffect } from "react";

const API = "http://localhost:3005";

function PostCard({ post, index }) {
  return (
    <article className="card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="card-img-wrap">
        <img src={post.image} alt={post.title} className="card-img" />
        <span className="card-category">{post.category}</span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className="card-author">{post.author}</span>
          <span className="card-date">{post.date}</span>
        </div>
        <h2 className="card-title">{post.title}</h2>
        <p className="card-desc">{post.description}</p>
      </div>
    </article>
  );
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/posts`)
      .then((r) => {
        if (!r.ok) throw new Error("Server xatosi");
        return r.json();
      })
      .then((data) => { setPosts(data); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-dot" />
            <span className="logo-text">PostFeed</span>
          </div>
          <p className="header-sub">Dunyodan eng so'nggi maqolalar</p>
        </div>
        <div className="header-bg" />
      </header>

      <main className="main">
        {loading && (
          <div className="center">
            <div className="loader">
              <span /><span /><span />
            </div>
            <p>Yuklanmoqda...</p>
          </div>
        )}
        {error && (
          <div className="center error-box">
            <div className="error-icon">!</div>
            <p>{error}</p>
            <small>Backend ishlaётganини tekshiring: <code>npm run dev</code></small>
          </div>
        )}
        {!loading && !error && (
          <>
            <div className="section-label">
              <span>{posts.length} ta post</span>
            </div>
            <div className="grid">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p>PostFeed — Node.js + React · AWS Demo</p>
      </footer>
    </div>
  );
}
