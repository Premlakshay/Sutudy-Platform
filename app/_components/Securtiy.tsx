'use client';
import { useEffect } from 'react';
const Security = () => {
  useEffect(() => {
    const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', disableContextMenu);
    const disableShortcuts = (e: KeyboardEvent) => {
      if ((e.ctrlKey && (e.key === 'u' || e.key === 'i' || e.key === 's')) || e.key === 'F12' ||(e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', disableShortcuts);
    const element = new Image();
    Object.defineProperty(element, 'id', {
    get: function () {
      document.body.innerHTML = '';
      alert('Developer tools are disabled.');
    },
    });
    console.log(element);
    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableShortcuts);
    };
  }, []);
  // useEffect(()=>{
  //   document.addEventListener('selectstart', (e) => e.preventDefault());
  // },[]);
  return null;
};
export default Security;
