import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import Layout from '../../components/Layout/Layout';

interface Props {
  message: string;
}

const Settings: NextPage<Props> = props => {
  const { message } = props;

  return (
    <Layout>
      <div>Settings {message}</div>

      <div>
        <Link href="/settings/url">your url</Link>
      </div>
      <div>
        <Link href="/settings/artists">your artists</Link>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      message: 'hi',
    },
  };
};

export default Settings;
