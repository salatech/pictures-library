import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const useInfiniteScroll = (callback, options = {}) => {
  const [isFetching, setIsFetching] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
    ...options,
  });
  
  useEffect(() => {
    if (inView && !isFetching) {
      setIsFetching(true);
      callback().finally(() => {
        setIsFetching(false);
      });
    }
  }, [inView, callback, isFetching]);

  return { ref, isFetching };
};

export default useInfiniteScroll; 