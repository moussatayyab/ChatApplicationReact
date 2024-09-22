import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Card, CardContent, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Avatar, IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';
import { getChatboxesByUser, getAllMessagesOfChatBoxApi, sendMessage, updateChatBoxName, addUserInChatBox } from '../../service/customer';
import "./chatcomponent.css";
import { getUsers } from "../../service/customer";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import { getUserId } from '../../../auth/service/storage/storage';



const ChatComponent = () => {

    const [messages, setMessages] = useState([]);

    const { enqueueSnackbar } = useSnackbar();
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [selectedChatUsers, setSelectedChatUsers] = useState([]);
    const [chatBoxes, setChatBoxes] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [open, setOpen] = React.useState(false);
    const [openName, setOpenName] = React.useState(false);

    const [selectedChatForNameUpdate, setSelectedChatForNameUpdate] = useState(null);


    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseName = () => {
        setOpenName(false);
    };

    useEffect(() => {
        getCart();
    }, []);

    const openModel = () => {
        setOpen(true);
        getAllUsers();
    };

    const getCart = () => {
        getChatboxesByUser(getUserId()).then(res => {
            setChatBoxes(res.data);

            console.log("we have seltced chat", selectedChatId != null);
            if (selectedChatId != null) {
                res.data.map(box => {
                    if (box.id == selectedChatId) {
                        console.log("true", box.userNames)
                        setSelectedChatUsers(box.userNames);
                        console.log("in users function")
                    }
                })
            }
        });
    };

    const getAllMessagesOfChatBox = (id) => {
        getAllMessagesOfChatBoxApi(id).then(res => {
            setMessages(res.data);
            setSelectedChatId(id);

        });
    };

    const selectChat = (id, users) => {
        setSelectedChatUsers(users);
        getAllMessagesOfChatBox(id);
    }

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return; // Prevent sending empty messages

        const data = {
            chatBox: selectedChatId,
            sender: getUserId(),
            content: newMessage
        }
        sendMessage(data) // Use API to send message
            .then(() => {
                getAllMessagesOfChatBox(selectedChatId); // Refresh messages after sending
                setNewMessage(''); // Clear input field
                enqueueSnackbar('Message sent successfully', { variant: 'success', autoHideDuration: 5000 });
            })
            .catch(error => {
                enqueueSnackbar('Failed to send message', { variant: 'error', autoHideDuration: 5000 });
            });
    };

    const getMessageClassName = (senderId) => {
        return `message ${senderId === getUserId() ? 'sent' : 'received'}`;
    };

    // Utility function to format date using Intl.DateTimeFormat
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',   // Display month as a short name
            day: '2-digit',   // Display day as two digits
            hour: '2-digit',  // Display hour in two digits
            minute: '2-digit', // Display minute in two digits
            hour12: true      // Use 12-hour clock format
        }).format(date);
    };

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const getAllUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsers();
            console.log(response)
            if (response.status === 200)
                setUsers(response.data);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = async (id) => {
        setSelectedChatForNameUpdate(id);
        setOpenName(true);
    }

    const addUserInChat = async (userId) => {
        addUserInChatBox(selectedChatId, userId).then(res => {
            enqueueSnackbar("User Added in Successfully", { variant: 'success', autoHideDuration: 5000 });
            getCart();
            getAllMessagesOfChatBox(selectedChatId);
            handleClose();
        }).catch(error => {
            enqueueSnackbar(error.response.data, { variant: 'error', autoHideDuration: 5000 });
        });

    };

    const refresh = async () => {
            getCart();
            if(selectedChatId!=null){
                getAllMessagesOfChatBox(selectedChatId);
            }
    };

    return (
        <>
            <Box display="flex" p={2} style={{ width:'90%', }}>
            <Button variant="contained" color="primary"  style={{ marginLeft: '10px', float: 'right' }}
            onClick={refresh} >
                                Refresh
                            </Button>
            </Box>
            <Box display="flex" height="70vh" p={2}>
                {/* Chat List on the Left Side */}
                <Box flex={1} mr={2} className="inbox-chat-list" style={{ overflowY: 'auto', borderRight: '1px solid #ccc' }}>
                    {chatBoxes.length > 0 ? (
                        chatBoxes.map(chatBox => (
                            <Card
                                key={chatBox.id}
                                className={`inbox-item ${selectedChatId === chatBox.id ? 'selected' : ''}`}
                                onClick={() => selectChat(chatBox.id, chatBox.userNames)}
                            >

                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="h6" className="chat-title">
                                                {chatBox.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {chatBox.lastMessage}
                                            </Typography>
                                        </Box>
                                        {/* Icon Button */}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent the card click event
                                                handleEditClick(chatBox.id); // Call the edit function
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="h6" className="empty-inbox">
                            No messages available.
                        </Typography>
                    )}
                </Box>


                {/* Messages on the Right Side */}
                <Box flex={3} className="inbox-messages" style={{ padding: '10px', overflowY: 'auto' }}>
                    {selectedChatId ? (
                        messages.length > 0 ? (
                            messages.map((message, index) => (
                                <div key={index} className={getMessageClassName(message.sender)}>
                                    <Typography variant="body1">{message.content}</Typography>
                                    <Typography variant="caption" color="textSecondary">{formatDate(message.createdAt)}</Typography>
                                </div>
                            ))


                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                No messages in this conversation.
                            </Typography>
                        )
                    ) : (
                        <Typography variant="h6" color="textSecondary">
                            Select a chat to view messages.
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {selectedChatUsers.map((user) => (
                            <Avatar key={user} sx={{ width: 60, height: 20, borderRadius: '4px', padding: '5px' }}>{user}</Avatar>
                        ))}
                    </Box>

                    {selectedChatId && (
                        <Box display="flex" alignItems="center" mt={2}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Type a message"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginLeft: '10px' }}>
                                Send
                            </Button>
                            <Button variant="contained" color="primary" onClick={openModel} style={{ marginLeft: '10px' }}>
                                Add
                            </Button>
                        </Box>
                    )}
                </Box>


            </Box>

            {/* <div className="cart-container">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        {order?.data?.couponName == null && (
                            <div className="container">
                                <form onSubmit={applyCoupon}>
                                    <TextField
                                        label="Code"
                                        variant="outlined"
                                        fullWidth
                                        value={couponForm.code}
                                        onChange={(e) => setCouponForm({ code: e.target.value })}
                                        required
                                    />
                                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={applyCoupon}>Apply Coupon</Button>
                                </form>
                            </div>
                        )}
                    </Grid>
                </Grid>
            </div> */}
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',

                }}
            >
                <DialogTitle>Add User in Chat</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        Place your order by adding any special instruction in description and address.
                    </DialogContentText> */}

                    <Box
                        sx={{
                            marginTop: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >

                        <TableContainer component={Paper} sx={{ width: "100%" }}>
                            <Table sx={{ minWidth: 550 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Name</TableCell>
                                        <TableCell align="center">Email</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >

                                            <TableCell align="center">{row.name}</TableCell>
                                            <TableCell align="center">{row.email}</TableCell>
                                            <TableCell align="center">
                                                <Button disabled={getUserId() === row.id} variant="contained" onClick={() => addUserInChat(row.id)}>Add in Chat</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    {/* <Button type="submit">Place Order</Button> */}
                </DialogActions>
            </Dialog>




            {/* Name Model */}

            <Dialog sx={{ minWidth: 550 }}
                open={openName}
                onClose={handleCloseName}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const name = formJson.name;
                        // formJson.userId = getUser().id;
                        // console.log(formJson);
                        console.log(name);

                        updateChatBoxName(selectedChatForNameUpdate, name).then(res => {
                            enqueueSnackbar("Chat Name Updated Successfully", { variant: 'success', autoHideDuration: 5000 });
                            handleCloseName();
                            getCart()

                        }).catch(error => {
                            enqueueSnackbar(error.response.data, { variant: 'error', autoHideDuration: 5000 });
                        });

                    },
                }}
            >
                <DialogTitle>Update Chatbox Name</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="New Name"
                        type="text"
                        multiline
                        maxRows={4}
                        sx={{ minWidth: 550 }}
                        fullWidth
                        variant="standard"
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseName}>Cancel</Button>
                    <Button type="submit">Update Chat Name</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ChatComponent;