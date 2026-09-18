import { AppBar, Toolbar, Typography, Container, Box, Select, MenuItem, FormControl, InputLabel, Paper } from '@mui/material';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';

export default function Layout({ children, simulateUser, setSimulateUser }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <AppBar 
        position="sticky" 
        color="inherit" 
        elevation={0}
        sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          width: '100%',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
            <Box display="flex" alignItems="center" gap={1}>
              <ConfirmationNumberOutlinedIcon color="primary" fontSize="large" />
              <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                UrbanVault <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>Tickets</Box>
              </Typography>
            </Box>

            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="role-select-label">Simulate Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={simulateUser}
                label="Simulate Role"
                onChange={(e) => setSimulateUser(e.target.value)}
                sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
              >
                <MenuItem value="Client">Client</MenuItem>
                <MenuItem value="Department POC">Department POC</MenuItem>
                <MenuItem value="Worker/Technician">Worker/Technician</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 4, width: '100%' }}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
