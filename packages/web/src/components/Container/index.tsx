import { memo, useRef, useCallback, useState } from 'react';
import { Story } from '@inkweave/react';
import '@inkweave/react/react.css';
import { Image } from '@inkweave/plugins';
import '@inkweave/plugins/plugins.css';
import type { ContainerProps } from '../../types';
import Menu from '../Menu';
import SaveModal from '../SaveModal';
import styles from './styles.module.css';

const Container: React.FC<ContainerProps> = ({ ink, title }) => {
  const [modalType, setModalType] = useState<'save' | 'restore'>('save');
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const openModal = useCallback((type: 'save' | 'restore') => {
    setModalType(type);
    modalRef.current?.showModal();
  }, []);

  const handleSave = useCallback(() => {
    openModal('save');
  }, [openModal]);

  const handleRestore = useCallback(() => {
    openModal('restore');
  }, [openModal]);

  const handleRestart = useCallback(() => {
    ink.restart();
  }, [ink]);

  const storyTitle = ink.title || title || '';

  return (
    <div className={styles.container}>
      <Menu onSave={handleSave} onRestore={handleRestore} onRestart={handleRestart} />
      <Story ink={ink}>
        <Image />
      </Story>
      <SaveModal modalRef={modalRef} type={modalType} title={storyTitle} ink={ink} />
    </div>
  );
};

export default memo(Container);
