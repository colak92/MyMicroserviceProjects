import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUserList } from '../../ReduxToolkit/AuthSlice';

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

  useEffect(() => {
    dispatch(getUserList(localStorage.getItem('jwt')));
  }, [dispatch]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {auth.users.map((item) => (
            <>
              <div className="flex items-center justify-between w-full">
                <div>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src="https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.fullName}
                      secondary={`@${item.fullName.split(' ').join('_').toLowerCase()}`}
                    />
                  </ListItem>
                </div>
              </div>
            </>
          ))}
        </Box>
      </Modal>
    </div>
  );
}
