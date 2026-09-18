import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Paper, Divider, Select, MenuItem, FormControl, InputLabel, CircularProgress, Chip, Grid, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/CheckCircleOutlined';
import AssignIcon from '@mui/icons-material/AssignmentIndOutlined';
import { getTicket, performTicketAction, getUsers } from '../api';

export default function TicketDetail({ simulateUser }) {
  const { id: ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTicket = async () => {
    try {
      const res = await getTicket(ticketId);
      setTicket(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    getUsers().then(res => {
      setUsers(res.data.filter(u => u.role === 'WORKER'));
    });
  }, [ticketId]);

  const handleAction = async (actionType) => {
    setActionLoading(true);
    try {
      const data = { action: actionType, actor_name: simulateUser, comment: '' };
      if (actionType === 'ASSIGN_WORKER') data.assignee_id = selectedWorker;
      await performTicketAction(ticketId, data);
      fetchTicket(); 
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setActionLoading(true);
    try {
      const api = (await import('../api')).default;
      await api.post('activities/', {
        ticket: ticketId,
        type: 'COMMENT',
        actor_name: simulateUser,
        text: comment
      });
      setComment('');
      fetchTicket();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" p={8}><CircularProgress /></Box>;
  if (!ticket) return <Typography>Ticket not found</Typography>;

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING_ASSIGNMENT': return 'error';
      case 'PENDING_ASSESSMENT': return 'warning';
      case 'PENDING_REVIEW': return 'info';
      case 'CLOSED': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 4, color: 'text.secondary' }}>
        Back to Tickets
      </Button>
      
      <Grid container spacing={4}>
        {/* Left Column: Info & Actions */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
              <Box>
                <Typography variant="h5" fontWeight="800" mb={1}>
                  {ticket.issues_detail.map(i => i.name).join(', ')}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" fontWeight="500">
                  📍 {ticket.floors_detail.map(f => f.name).join(', ')}
                </Typography>
              </Box>
              <Chip label={ticket.status.replace(/_/g, ' ')} color={getStatusColor(ticket.status)} sx={{ fontWeight: 600 }} />
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="overline" color="text.disabled" fontWeight="700">DESCRIPTION</Typography>
            <Typography variant="body1" mt={1} sx={{ whiteSpace: 'pre-line', color: 'text.primary', lineHeight: 1.6 }}>
              {ticket.description || 'No detailed description provided by the client.'}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="overline" color="text.disabled" fontWeight="700">CREATED</Typography>
                <Typography variant="body2" fontWeight="600">{new Date(ticket.created_at).toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="overline" color="text.disabled" fontWeight="700">ASSIGNEE</Typography>
                <Typography variant="body2" fontWeight="600">{ticket.assignee_detail ? ticket.assignee_detail.name : 'Unassigned'}</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Action CTA Panel based on status and role */}
          {ticket.status === 'PENDING_ASSIGNMENT' && simulateUser === 'Department POC' && (
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'primary.light', bgcolor: 'primary.50' }}>
              <Typography variant="subtitle1" fontWeight="700" color="primary.dark" mb={2}>Action Required: Assign Technician</Typography>
              <Box display="flex" gap={2}>
                <FormControl size="small" fullWidth sx={{ bgcolor: 'white', borderRadius: 1 }}>
                  <InputLabel>Select Worker</InputLabel>
                  <Select value={selectedWorker} label="Select Worker" onChange={(e) => setSelectedWorker(e.target.value)}>
                    {users.map(u => (
                      <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={() => handleAction('ASSIGN_WORKER')} disabled={!selectedWorker || actionLoading} startIcon={<AssignIcon />}>
                  Assign
                </Button>
              </Box>
            </Paper>
          )}

          {ticket.status === 'PENDING_ASSESSMENT' && simulateUser === 'Worker/Technician' && (
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'warning.light', bgcolor: 'warning.50' }}>
              <Typography variant="subtitle1" fontWeight="700" color="warning.dark" mb={2}>You are assigned to this ticket.</Typography>
              <Button variant="contained" color="warning" onClick={() => handleAction('SUBMIT_ASSESSMENT')} disabled={actionLoading} startIcon={<CheckIcon />}>
                Submit Assessment
              </Button>
            </Paper>
          )}
          
          {ticket.status === 'PENDING_REVIEW' && simulateUser === 'Department POC' && (
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid', borderColor: 'info.light', bgcolor: 'info.50' }}>
              <Typography variant="subtitle1" fontWeight="700" color="info.dark" mb={2}>Assessment submitted. Review and resolve.</Typography>
              <Button variant="contained" color="info" onClick={() => handleAction('MARK_RESOLVED')} disabled={actionLoading} startIcon={<CheckIcon />}>
                Mark Resolved
              </Button>
            </Paper>
          )}
        </Grid>

        {/* Right Column: Activity Feed */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box p={3} bgcolor="background.paper" borderBottom="1px solid" borderColor="divider">
              <Typography variant="h6" fontWeight="700">Activity History</Typography>
            </Box>
            
            <Box p={3} sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '500px', bgcolor: '#f8fafc' }}>
              {ticket.activities.map((act, index) => (
                <Box key={act.id} display="flex" gap={2} mb={3} position="relative">
                  {/* Timeline connecting line */}
                  {index !== ticket.activities.length - 1 && (
                    <Box sx={{ position: 'absolute', top: 40, left: 19, width: '2px', height: 'calc(100% - 10px)', bgcolor: 'divider' }} />
                  )}
                  <Avatar sx={{ bgcolor: act.type === 'EVENT' ? 'primary.main' : 'secondary.main', width: 40, height: 40, fontSize: '1rem', fontWeight: 700 }}>
                    {act.actor_name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ pt: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.4 }}>
                      <Box component="span" fontWeight="700">{act.actor_name}</Box> 
                      {act.type === 'EVENT' ? ' ' : ' commented: '}
                      {act.type === 'EVENT' ? <Box component="span" color="text.secondary">{act.text}</Box> : act.text}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" fontWeight="500">
                      {new Date(act.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            
            <Box p={2} bgcolor="background.paper" borderTop="1px solid" borderColor="divider">
              <TextField 
                fullWidth 
                size="medium" 
                placeholder="Write a comment..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
                maxRows={3}
                sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={handleComment} disabled={actionLoading || !comment.trim()} sx={{ borderRadius: 2 }}>
                  Post Comment
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
