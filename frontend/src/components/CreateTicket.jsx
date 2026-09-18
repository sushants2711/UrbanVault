import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip, OutlinedInput, Alert, Paper, Grid } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getIssues, getFloors, createTicket } from '../api';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      borderRadius: 12,
      marginTop: 8,
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  },
};

export default function CreateTicket() {
  const navigate = useNavigate();
  const [issuesOptions, setIssuesOptions] = useState([]);
  const [floorsOptions, setFloorsOptions] = useState([]);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [selectedFloors, setSelectedFloors] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getIssues().then(res => setIssuesOptions(res.data)).catch(console.error);
    getFloors().then(res => setFloorsOptions(res.data)).catch(console.error);
  }, []);

  const handleQuickIssue = (issueName) => {
    const issue = issuesOptions.find(i => i.name === issueName);
    if (issue && !selectedIssues.includes(issue.id)) {
      setSelectedIssues([...selectedIssues, issue.id]);
    }
  };

  const handleSubmit = async () => {
    if (selectedIssues.length === 0 || selectedFloors.length === 0) {
      setError("Please select at least one issue and one floor.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await createTicket({
        issues: selectedIssues,
        floors: selectedFloors,
        description
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || "An error occurred while creating the ticket.");
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper elevation={0} sx={{ p: {xs: 3, md: 5}, borderRadius: 4, border: '1px solid', borderColor: 'divider', width: '100%', maxWidth: '800px', bgcolor: 'background.paper' }}>
        
        <Box textAlign="center" mb={5}>
          <Typography variant="h4" fontWeight="800" color="text.primary" mb={1}>Submit a New Request</Typography>
          <Typography variant="body1" color="text.secondary">Provide the details below so we can resolve your issue quickly.</Typography>
        </Box>

        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, bgcolor: '#eff6ff', border: '1px solid', borderColor: '#bfdbfe' }}>
          <Box display="flex" alignItems="center" gap={1} mb={2} color="primary.main">
            <BoltIcon />
            <Typography variant="subtitle2" fontWeight="700" color="primary.dark">
              Quick Issues (Tap to autofill)
            </Typography>
          </Box>
          <Box display="flex" gap={1.5} flexWrap="wrap">
            {['AC not cooling', 'Internet not working', 'Pantry not cleaned', 'Lights flickering'].map(qi => {
              const isSelected = selectedIssues.find(id => issuesOptions.find(opt => opt.id === id)?.name === qi);
              return (
                <Chip 
                  key={qi} 
                  label={qi} 
                  onClick={() => handleQuickIssue(qi)} 
                  color={isSelected ? "primary" : "default"}
                  variant={isSelected ? "filled" : "outlined"}
                  sx={{ fontWeight: 500, borderRadius: 2, '&:hover': { bgcolor: isSelected ? 'primary.main' : 'rgba(0,0,0,0.04)' } }}
                />
              );
            })}
          </Box>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Issue(s) *</InputLabel>
              <Select
                multiple
                value={selectedIssues}
                onChange={(e) => setSelectedIssues(e.target.value)}
                input={<OutlinedInput label="Issue(s) *" sx={{ borderRadius: 2 }} />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const issue = issuesOptions.find(i => i.id === value);
                      return <Chip key={value} label={issue ? issue.name : value} size="small" sx={{ borderRadius: 1 }} />;
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {issuesOptions.map((issue) => (
                  <MenuItem key={issue.id} value={issue.id} sx={{ borderRadius: 1, mx: 1, mb: 0.5 }}>
                    {issue.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Floor(s) *</InputLabel>
              <Select
                multiple
                value={selectedFloors}
                onChange={(e) => setSelectedFloors(e.target.value)}
                input={<OutlinedInput label="Floor(s) *" sx={{ borderRadius: 2 }} />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const floor = floorsOptions.find(f => f.id === value);
                      return <Chip key={value} label={floor ? floor.name : value} size="small" sx={{ borderRadius: 1 }} />;
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {floorsOptions.map((floor) => (
                  <MenuItem key={floor.id} value={floor.id} sx={{ borderRadius: 1, mx: 1, mb: 0.5 }}>
                    {floor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description (Optional)"
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide any additional details that might help our technicians..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
        </Grid>

        <Box display="flex" gap={2} justifyContent="flex-end" mt={5}>
          <Button variant="outlined" color="inherit" onClick={() => navigate('/')} startIcon={<CancelIcon />} sx={{ px: 3, borderRadius: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading} startIcon={<CheckIcon />} sx={{ px: 4, borderRadius: 2, boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)' }}>
            Submit Ticket
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
