class PostItem extends React.Component {
  handleVote = async (action) => {
    const { post } = this.props;
    try {
      const res = await fetch(`/api/vote/${post.id}/${action}`, { method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      if (res.ok) {
        const data = await res.json();
        this.props.onUpdateScore(post.id, data.score);
      } else if (res.status === 401) {
        window.location.href = '/login';
      }
    } catch (err) { console.error(err); }
  };

  render() {
    const { post, currentUser, isAdmin } = this.props;
    return (
      <div className="list-group-item bg-white rounded shadow-sm mb-3">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <p className="mb-1 fw-semibold">{post.content}</p>
            <small className="text-muted">by {post.author} - score <span>{post.score}</span></small>
          </div>
          <div className="ms-3 text-end flex-shrink-0">
            {currentUser && (
              <>
                <a className="btn btn-sm btn-outline-success me-1" href="#" onClick={(e) => {e.preventDefault(); this.handleVote('up');}}>▲</a>
                <a className="btn btn-sm btn-outline-danger" href="#" onClick={(e) => {e.preventDefault(); this.handleVote('down');}}>▼</a>
              </>
            )}
            {isAdmin && (<a className="btn btn-sm btn-danger ms-1" href={`/delete/${post.id}`}>Delete</a>)}
          </div>
        </div>
      </div>
    );
  }
}

class PostList extends React.Component {
  state = { posts: [] };

  componentDidMount() {
    this.fetchPosts();
  }

  fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      this.setState({ posts: data.posts });
    } catch (err) { console.error(err); }
  };

  updateScore = (id, score) => {
    this.setState(prev => ({
      posts: prev.posts.map(p => p.id === id ? { ...p, score } : p)
    }));
  };

  render() {
    const { currentUser, isAdmin } = this.props;
    return (
      <div className="list-group">
        {this.state.posts.map(p => (
          <PostItem key={p.id} post={p} currentUser={currentUser} isAdmin={isAdmin} onUpdateScore={this.updateScore} />
        ))}
        {this.state.posts.length === 0 && <p>No posts yet.</p>}
      </div>
    );
  }
}

function initReactFeed() {
  const container = document.getElementById('react-feed');
  if (!container) return;
  const props = {
    currentUser: container.dataset.user || '',
    isAdmin: container.dataset.admin === '1',
  };
  ReactDOM.render(<PostList {...props} />, container);
}

document.addEventListener('DOMContentLoaded', initReactFeed);
