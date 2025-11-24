import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash, FaPenNib } from 'react-icons/fa';

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    axios.get('http://localhost:3001/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!title || !desc || !author) return alert("Please fill all fields");

    axios.post('http://localhost:3001/create', { title, description: desc, author })
      .then(() => {
        setTitle(''); setDesc(''); setAuthor('');
        fetchPosts();
      })
      .catch(err => console.log(err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
      .then(() => fetchPosts())
      .catch(err => console.log(err));
  };

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      
      <nav className="navbar navbar-dark bg-dark shadow mb-4">
        <div className="container">
          <span className="navbar-brand fw-bold fs-3">
            <FaPenNib className="me-2"/> DevBlog
          </span>
        </div>
      </nav>

      <div className="container">
        <div className="row">
          
          <div className="col-md-4">
            <div className="card shadow-sm border-0 p-3 mb-4">
              <h4 className="text-primary mb-3">Write a Blog</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Blog Title" 
                    value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Author Name" 
                    value={author} onChange={e => setAuthor(e.target.value)} />
                </div>
                <div className="mb-3">
                  <textarea className="form-control" rows="5" placeholder="Write your content here..." 
                    value={desc} onChange={e => setDesc(e.target.value)}></textarea>
                </div>
                <button className="btn btn-primary w-100 fw-bold">Publish Post</button>
              </form>
            </div>
          </div>

          <div className="col-md-8">
            <h4 className="mb-3 text-secondary">Recent Posts ({posts.length})</h4>
            {posts.length === 0 ? <p className="text-muted">No blogs yet. Be the first to write!</p> : null}
            
            {posts.map(post => (
              <div className="card shadow-sm border-0 mb-3" key={post._id} style={{transition: '0.3s'}}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title fw-bold text-dark">{post.title}</h5>
                    <button onClick={() => handleDelete(post._id)} className="btn btn-sm btn-outline-danger border-0">
                      <FaTrash />
                    </button>
                  </div>
                  <h6 className="card-subtitle mb-2 text-muted" style={{fontSize:'0.85rem'}}>
                    By <span className="text-info">{post.author}</span> • {new Date(post.date).toLocaleDateString()}
                  </h6>
                  <p className="card-text mt-3">{post.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;