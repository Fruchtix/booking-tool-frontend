import style from './SignIn.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';

const SignIn = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <h2>Signed in as {session.user?.email}</h2>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Not signed in</h2>
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
};

export default SignIn;
