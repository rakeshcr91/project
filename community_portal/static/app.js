// Simple AJAX voting for a smoother experience
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const postId = btn.dataset.post;
      const action = btn.dataset.action;
      try {
        const res = await fetch(`/api/vote/${postId}/${action}`, {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (res.ok) {
          const data = await res.json();
          const scoreEl = document.getElementById(`score-${postId}`);
          if (scoreEl) {
            scoreEl.textContent = data.score;
          }
        } else if (res.status === 401) {
          window.location.href = '/login';
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
});
