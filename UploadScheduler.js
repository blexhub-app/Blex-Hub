import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UploadScheduler() {
  const [caption, setCaption] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');
  const [media, setMedia] = useState(null);
  const [status, setStatus] = useState('');
  const [posts, setPosts] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!caption || !platform || !date || !email || !media) {
      setStatus('Please fill all fields and attach media.');
      return;
    }
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('platform', platform);
    formData.append('date', date);
    formData.append('notifyEmail', email);
    formData.append('media', media);

    try {
      const res = await axios.post('http://localhost:4000/upload-post', formData);
      setStatus('✅ Post scheduled successfully!');
      setCaption(''); setPlatform('TikTok'); setDate(''); setEmail(''); setMedia(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      setStatus('❌ Upload failed. Check console.');
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:4000/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 480, margin: 'auto', background: '#fff', borderRadius: 10 }}>
      <h2>📤 Schedule a Post</h2>
      <form onSubmit={handleUpload}>
        <input type="text" placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} /><br />
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="TikTok">TikTok</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
        </select><br />
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} /><br />
        <input type="email" placeholder="Notification Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input type="file" accept="video/*,image/*" onChange={(e) => setMedia(e.target.files[0])} /><br />
        <button type="submit">Upload</button>
      </form>
      <p>{status}</p>
      <div>
        <h3>Scheduled Posts</h3>
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <strong>{post.caption}</strong><br />
              {post.platform} — {new Date(post.date).toLocaleString()}<br />
              {post.videoUrl && <a href={post.videoUrl} target="_blank">Media</a>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
