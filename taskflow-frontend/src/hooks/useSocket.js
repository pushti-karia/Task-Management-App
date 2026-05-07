import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';
import { socketTaskCreated, socketTaskUpdated, socketTaskDeleted, socketTaskMoved } from '../store/slices/taskSlice';
import { addNotification } from '../store/slices/notificationSlice';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    socket.on('task_created', (task) => dispatch(socketTaskCreated(task)));
    socket.on('task_updated', (task) => dispatch(socketTaskUpdated(task)));
    socket.on('task_deleted', (taskId) => dispatch(socketTaskDeleted(taskId)));
    socket.on('task_moved', (data) => dispatch(socketTaskMoved(data)));
    socket.on('notification', (notification) => dispatch(addNotification(notification)));

    return () => disconnectSocket();
  }, [token, dispatch]);
};

export const useBoardSocket = (boardId) => {
  useEffect(() => {
    if (!boardId) return;
    const socket = getSocket();
    if (!socket) return;
    socket.emit('join_board', boardId);
    return () => socket.emit('leave_board', boardId);
  }, [boardId]);
};
