import { type PropsWithChildren } from 'react';

export default function DefaultLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div>
      <header
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: '#24292e',
          color: 'white',
        }}
      >
        React Enterprise Boilerplate
      </header>

      <main
        style={{
          padding: 24,
        }}
      >
        {children}
      </main>
    </div>
  );
}
