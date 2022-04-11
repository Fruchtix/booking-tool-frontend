import Link from 'next/link';
import style from './sidebar.module.css';

const Sidebar = () => {
  return (
    <nav className={style['sidebar']}>
      <ul className={style['list']}>
        <div className={style['top-section']}>
          <li>
            <Link href="/dashboard">dashboard</Link>
          </li>
          <li>
            <Link href="/calender">Calender</Link>
          </li>
          <li>
            <Link href="/requests">requests</Link>
          </li>
        </div>
        <div className={style['bottom-section']}>
          <li>
            <Link href="/settings">Settings</Link>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Sidebar;
