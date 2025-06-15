import { useEffect } from 'react';

export function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col">
      <h2>Неожиданная ошибка!</h2>
      <blockquote>
        <code>{error.message}</code>
      </blockquote>
      {reset && <button onClick={() => reset()}>Повторить</button>}
    </div>
  );
}
