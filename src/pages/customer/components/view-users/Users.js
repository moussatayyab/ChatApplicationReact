import { createChatBoxApi, getUsers } from "../../service/customer";
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Backdrop, Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { getUserId } from "../../../auth/service/storage/storage";
import { useSnackbar } from "notistack";

export default function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchPlaceOrders = async () => {
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
        fetchPlaceOrders();
    }, []);

    const createChatBox = async (userId) => {
        setLoading(true);
        console.log(userId)
        try {
            const data = {
                participant1: getUserId(),
                participant2 : userId
            }
            const response = await createChatBoxApi(data);
            console.log(response, data)
            if (response.status === 201) {
                navigate("/user/chat");
                enqueueSnackbar('Review posted successfully', { variant: 'success', autoHideDuration: 5000 });
            }
        } catch (error) {
            enqueueSnackbar('Getting error while starting chat', { variant: 'error', autoHideDuration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                sx={{
                    marginTop: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Users
                </Typography>
                <TableContainer component={Paper} sx={{ width: "80%", mt: 3 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                                        <Button disabled={getUserId() === row.id} variant="contained" onClick={()=>createChatBox(row.id)}>Start Chat</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="success" />
            </Backdrop>
        </>
    )
};