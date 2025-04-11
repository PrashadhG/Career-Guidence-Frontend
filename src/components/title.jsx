import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | CareerPulse Ai`;
  }, [title]);
};

export default useDocumentTitle;