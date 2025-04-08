import { useEffect } from 'react';

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | Career PathFinder`;
  }, [title]);
};

export default useDocumentTitle;