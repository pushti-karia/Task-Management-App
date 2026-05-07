import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) dispatch(fetchMe());
  }, [token, user, dispatch]);

  return { user, token, loading, error, isAuthenticated: !!user };
};
