import React from 'react';
import { Link } from 'react-router-dom';

interface Styles {
  container: React.CSSProperties;
  errorText: React.CSSProperties;
  link: React.CSSProperties;
}

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    fontFamily: 'Roboto, sans-serif',
  },
  errorText: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  link: {
    color: 'var(--color-accent)',
    textDecoration: 'none',
    fontSize: '16px',
  },
};

function RouteError() {
  return (
    <div style={styles.container}>
      <p style={styles.errorText}>Error: Page not found</p>
      <Link to={'/listProducts'} style={styles.link}>
        Back to Home
      </Link>
    </div>
  );
}

export default RouteError;
