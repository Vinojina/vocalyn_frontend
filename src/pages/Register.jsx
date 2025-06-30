import { useState } from 'react';
import Logo from '/src/assets/logo.png';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

const Register = () => {
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
});
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
    }));
};

const handleRoleChange = (e) => {
    setForm((prev) => ({
        ...prev,
        role: e.target.value,
    }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.name || !form.email || !form.password ) {
      alert('Please fill all fields.');
      return;
  }

  setLoading(true);

  try {
      const { data } = await axios.post('/api/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password,
      });

      alert('Registration successful!');
      setForm({
          name: '',
          email: '',
          password: '',
      });
      navigate('/');


  } catch (error) {
    const errMsg = error.response?.data?.error || 'Registration failed.';
    alert(errMsg);
  } finally {
      setLoading(false);
  }
};


  return (
    <div className="bg-white min-h-screen  w-full flex items-center justify-center">
      <div className="bg-white bg-opacity-80 p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mx-4">
        <div className="mb-6 md:mb-0 md:mr-6 w-full md:w-1/2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent m-5">AI Voice Trainer</h1>
          <p className="text-gray-500">Improve your voice with our Advance AI technology.Perfect for professional singers and public speakers.</p>
          <ul className="text-gray-500 list-disc list-inside">
            <li>Personalized Voice analysis</li>
            <li>Real time feedback</li>
            <li>Custom training exercise</li>
            <li>Progress tracking</li>
          </ul>
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-gray-300 p-6 rounded-lg shadow-md">
            <img src={Logo} alt="Logo" className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text- bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4 text-center">Create your Account</h2>
            <p className="text-gray-600 text-center mb-4">Start your Journey a better control today</p>
            <form className="space-y-4" onSubmit={handleSubmit }>
              <div>
                <label className="block text-white">Name</label>
                <input type="text" name="name" placeholder="yourName" className="w-full p-2 border rounded" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-white">Email</label>
                <input type="email" name="email" placeholder="your@email.com" className="w-full p-2 border rounded" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-white">Password</label>
                <input type="password" name="password" placeholder="At least 8 characters" className="w-full p-2 border rounded" onChange={handleChange} />
              </div>
              <button type="submit" className="w-full bg-pink-600 text-white p-2 rounded hover:bg-pink-700" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
              <p className="text-center text-gray-500">You already have an account? <a href="/login" className="text-pink-600">Sign in</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
};


export default Register;
