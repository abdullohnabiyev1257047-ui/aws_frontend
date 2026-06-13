import { useState, useEffect } from "react";

const API = "http://13.61.177.47:3005";

// ================= POST CARD (o'zgarmagan) =================
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

// ================= ADMIN PANEL =================
function AdminPanel() {
  const [isAuth, setIsAuth] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    author: "",
    category: "",
  });

  const login = (e) => {
    e.preventDefault();
    const pass = e.target.password.value;

    if (pass === "admin") {
      setIsAuth(true);
    } else {
      alert("Parol noto'g'ri!");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitPost = async (e) => {
    e.preventDefault();

    await fetch(`${API}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        date: new Date().toLocaleDateString(),
      }),
    });

    alert("Post qo'shildi!");
    setForm({
      title: "",
      description: "",
      image: "",
      author: "",
      category: "",
    });
  };

  if (!isAuth) {
    return (
      <div className="center">
        <form onSubmit={login} className="card" style={{ padding: 20 }}>
          <h2>Admin Login</h2>
          <input name="password" type="password" placeholder="Parol" />
          <button type="submit">Kirish</button>
        </form>
      </div>
    );
  }

  return (
    <div className="center">
      <form onSubmit={submitPost} className="card" style={{ padding: 20 }}>
        <h2>Post qo'shish</h2>

        <input name="title" placeholder="Title" onChange={handleChange} />
        <input name="description" placeholder="Description" onChange={handleChange} />
        <input name="image" placeholder="Image URL" onChange={handleChange} />
        <input name="author" placeholder="Author" onChange={handleChange} />
        <input name="category" placeholder="Category" onChange={handleChange} />

        <button type="submit">Saqlash</button>
      </form>
    </div>
  );
}

// ================= MAIN APP =================
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
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  // ===== ROUTE SIMULATION (/admin) =====
  const isAdminRoute = window.location.pathname === "/admin";

  if (isAdminRoute) {
    return <AdminPanel />;
  }

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
        {loading && <p>Yuklanmoqda...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <div className="grid">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>PostFeed — Node.js + React · AWS Demo</p>
      </footer>
    </div>
  );
}