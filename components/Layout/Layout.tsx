import Sidebar from '../Sidebar/Sidebar';
import style from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={style.layout}>
      <Sidebar />
      <div className={style.children}>{children}</div>
    </div>
  );
};

export default Layout;
