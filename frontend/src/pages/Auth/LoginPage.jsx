import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent-amber/10 via-bg-primary to-bg-primary" />
      
      <Card className="w-full max-w-md p-8 relative z-10 border-border-subtle backdrop-blur-xl bg-bg-secondary/80">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-amber to-accent-rose flex items-center justify-center font-bold text-white shadow-glow-amber mx-auto mb-4">
            HF
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-text-muted text-sm mt-2">Log in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            placeholder="hero@habitforge.com"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            placeholder="••••••••"
          />
          
          {error && <p className="text-accent-rose text-sm text-center">{error}</p>}
          
          <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Don't have an account? <Link to="/register" className="text-accent-amber hover:underline font-medium">Create one</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
