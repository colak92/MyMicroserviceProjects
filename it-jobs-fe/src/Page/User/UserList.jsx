import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserList } from '../../ReduxToolkit/AuthSlice';
import { USER_ROLE_OPTIONS } from '../../constants/userRole';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  outline: 'none',
  boxShadow: 24,
  p: 2,
};

export default function UserList({ handleClose, open }) {
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  const token = localStorage.getItem('jwt');
  
  const getRoleLabel = (roleValue) => {
  const roleOption = USER_ROLE_OPTIONS.find((option) => option.value === roleValue);
    return roleOption ? roleOption.label : roleValue;
  };

  const getRoleIcon = (roleValue) => {
  const roleOption = USER_ROLE_OPTIONS.find((option) => option.value === roleValue);
    return roleOption ? roleOption.icon : null;
  };

  useEffect(() => {
    if (open) {
      dispatch(getUserList(token));
    }
  }, [dispatch, open, token]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {auth.users && auth.users.length > 0 ? (
          auth.users.map((user) => (
            <ListItem key={user.id} divider>
              <ListItemAvatar>
              <Avatar sx={{ bgcolor: '#4d7fd0' }}>
                {getRoleIcon(user.role)}
              </Avatar>
            </ListItemAvatar>
              <ListItemText
                primary={user.fullName}
                secondary={
                  <>
                    <div>@{user.fullName.split(' ').join('_').toLowerCase()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#666' }}>
                      <span>{getRoleLabel(user.role)}</span>
                    </div>
                  </>
                }
              />
            </ListItem>
          ))
        ) : (
          <div>No users found.</div>
        )}
      </Box>
    </Modal>
  );
}