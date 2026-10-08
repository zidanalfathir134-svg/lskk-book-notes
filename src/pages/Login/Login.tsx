import { Button, Card, Form, Input, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { login } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import { loginSchema, type LoginFormValues } from './LoginSchema';

function Login() {
  const navigate = useNavigate();

  const loginToStore = useAuthStore((state) => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    try {
      const response = await login(values.username, values.password);

      if (!response.status || !response.data) {
        message.error(response.message || 'Login gagal');

        return;
      }

      loginToStore(response.data.user, response.data.token);

      message.success(response.message);

      navigate('/books', {
        replace: true,
      });
    } catch {
      message.error('Terjadi kesalahan saat login');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card title="LSKK Book Notes" className="w-full max-w-md">
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Username"
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Masukkan username"
                  autoComplete="username"
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                />
              )}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={isSubmitting}>
            Login
          </Button>
        </Form>
      </Card>
    </main>
  );
}

export default Login;
