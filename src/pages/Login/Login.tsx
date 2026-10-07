import { Button, Card, Input } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

function Login() {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const handleLogin = (): void => {
    if (!username.trim()) {
      return;
    }

    login(username);
    navigate('/books');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            LSKK Book Notes
          </h1>

          <p className="mt-2 text-gray-500">
            Login untuk mengakses catatan buku
          </p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Masukkan username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onPressEnter={handleLogin}
          />

          <Button
            type="primary"
            block
            onClick={handleLogin}
            disabled={!username.trim()}
          >
            Login
          </Button>
        </div>
      </Card>
    </main>
  );
}

export default Login;