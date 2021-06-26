import Head from 'next/head';
import NavigationBar from 'components/NavigationBar';

export default function Layout({ title, description, keywords, children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
          crossorigin="anonymous"
        />
      </Head>

      <NavigationBar />
      <div className="container">{children}</div>
    </>
  );
}

Layout.defaultProps = {
  title: 'Project Manager',
  description: 'Project management application',
  keywords: 'project, tasks, members, duration, deadline',
};
