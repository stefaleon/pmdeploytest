import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import NavigationBar from 'components/NavigationBar';
import { Card, Carousel, Button } from 'react-bootstrap';

export default function Home({ title, description, keywords }) {
  const router = useRouter();

  const handleSignUp = () => {
    router.push('/register');
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>

      <header className="nav_header">
        <NavigationBar />
      </header>

      <section className="hero">
        <h1 className="hero_title">Project Manager</h1>
        <i className="fas fa-project-diagram fa-6x"></i>
        <h2 className="hero_subtitle">
          a web application for management of projects and tasks
        </h2>
      </section>

      <section className="two_cols">
        <div className="features">
          <div>
            <p>- create and manage projects </p>
            <p>- create reusable tasks </p>
            <p>- organize tasks in categories</p>
            <p>- add/remove tasks to/from a project</p>
            <p>- add/remove members to/from a project </p>
            <p>- assign members to a project task</p>
            <p>- manage the tasks of a project with an interactive graph</p>
          </div>
        </div>
        <Card className="p-5 bg-dark ">
          <Carousel>
            <Carousel.Item>
              <Image
                src={'/images/1.png'}
                width={1920}
                height={1080}
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>Update Project View</h3>
                <p>Edit the various project parameters</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <Image
                src={'/images/2.png'}
                width={1920}
                height={1080}
                alt="Second slide"
              />
              <Carousel.Caption>
                <h3>Manage Project View</h3>
                <p>Manage the tasks of a project with an interactive graph</p>
              </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
              <Image
                src={'/images/3.png'}
                width={1920}
                height={1080}
                alt="Third slide"
              />
              <Carousel.Caption>
                <h3>Manage Task View</h3>
                <p>Set the task status and assign the task to members</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Card>
      </section>

      <section className="call_to_action two_cols">
        <div className="call">
          <Card className="p-5">
            <Card.Title>
              <h1>Sign Up Now!</h1>
              <h2>and start managing your projects</h2>
            </Card.Title>
          </Card>
        </div>
        <Button
          variant="success"
          className="signup_button"
          size="lg"
          block
          onClick={handleSignUp}
        >
          REGISTER!
        </Button>
      </section>

      <footer>
        <p>&copy; Project Manager - {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}

Home.defaultProps = {
  title: 'Project Manager',
  description: 'Project management application',
  keywords: 'projects, tasks, categories, members',
};
