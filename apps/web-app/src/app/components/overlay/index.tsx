import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styles from './Overlay.module.css';

interface OverlayProps {
  children: ReactNode;
  hideOverlay?: () => void;
}
export const Overlay = (props: OverlayProps) => {
  const hideOverlay = () => {
    if (props.hideOverlay) {
      props.hideOverlay();
    }
  };
  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={hideOverlay}>
      {props.children}
    </div>,
    document.getElementById('overlay')!
  );
};
