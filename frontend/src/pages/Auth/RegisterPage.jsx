import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const { register, loginWithGoogle, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleError = () => {
    useAuthStore.setState({ error: 'Google signup was unsuccessful. Please try again.' });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent-emerald/10 via-bg-primary to-bg-primary" />
      
      <Card className="w-full max-w-md p-8 relative z-10 border-border-subtle backdrop-blur-xl bg-bg-secondary/80">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Start Your Journey</h1>
          <p className="text-text-muted text-sm mt-2">Create an account to begin leveling up your life.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <Input 
            label="Username" 
            type="text" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            name="password"
            value={formData.password}
            onChange={handleChange}
            required 
          />
          
          {error && <p className="text-accent-rose text-sm text-center">{error}</p>}
          
          <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-subtle"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-bg-secondary/80 text-text-muted">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="pill"
              size="large"
              text="signup_with"
            />
          </div>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account? <Link to="/login" className="text-accent-amber hover:underline font-medium">Log in</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
