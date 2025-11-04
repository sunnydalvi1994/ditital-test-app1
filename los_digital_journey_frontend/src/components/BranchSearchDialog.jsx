import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Button,
  Tabs,
  Tab,
  Box,
  Checkbox,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  RadioGroup,
  Radio,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import '../styles/components/dialogBox.css';
import '../styles/components/formAndButtons.css';

export default function BranchSearchDialog({ open, onClose, onConfirm }) {
  const [tab, setTab] = useState(0);
  const [branchAddress, setBranchAddress] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');

  // Mock data for demo
  const branches = [
    {
      id: 1,
      name: 'Ahmedabad Branch',
      address:
        'Shop No. 4 and 5, Ground Floor, Opp. Bank of Baroda, Near Central Mall, Panchvati, Ambawadi, Ahmedabad - 380015, Gujarat'
    },
    {
      id: 2,
      name: 'Bengaluru Branch',
      address:
        'Aloka Mansion, No.19, 3rd Block, 10th B Main Road, Jayanagar, Bengaluru - 560011, Karnataka'
    },
    {
      id: 3,
      name: 'Belgaum Branch',
      address:
        'Gr. Floor, Anandi Shankar Heritage, Kali Ambrai, College Road, Belgaum, Karnataka - 590001, Karnataka'
    },
    {
      id: 4,
      name: 'Hubli Branch',
      address:
        'Tirumala Trade Centre, Neeligin Road, Traffic Island, Hubli, Dharwad - 580029, Karnataka'
    },
    {
      id: 5,
      name: 'Indore Branch',
      address:
        'G-1, Ground Floor, G K House, Municipal House No. 582, Opp. Bansi Trade Centre, M.G. Road, Indore - 452001, Madhya Pradesh'
    },
    {
      id: 6,
      name: 'Main Branch',
      address:
        'Ground and First floor, Mumbadevi Apartment, Tika No.13, City Survey No. 291, 292, Joshiwada, Charai, Thane- 400601, Maharashtra'
    },
    {
      id: 7,
      name: 'Mapusa Branch',
      address:
        'Shop No. S/1 and C1, Block A Chandranath Apts. CHS Ltd., Opp. Police St., Mapusa, Bardez, Goa - 403507, Goa'
    },
    {
      id: 8,
      name: 'Madgaon Branch',
      address: 'Ground Floor, Shop No.S1/S2/S3/S4, R.D. Lotus Tower, Margao, Goa - 403601, Goa'
    },
    {
      id: 9,
      name: 'Naupada Branch',
      address:
        'Anant Laxmi Chambers, Shivajinagar, Off Gokhale Road, Naupada Branch, Thane - 400602, Maharashtra'
    },
    {
      id: 10,
      name: 'Panjim Branch',
      address:
        '001, Ground Floor, Nova Goa Building, Dr. Atmaram Borkar Road, Panaji, Goa - 403001, Goa'
    },
    {
      id: 11,
      name: 'Ponda Branch',
      address:
        'Shop No.20 and 21, Ground Floor, Rajdeep Galleria Sadar, Durgabhat, Ponda, Goa - 403401, Goa'
    },
    {
      id: 12,
      name: 'Rajaji Nagar Branch',
      address:
        'Property No. 6, Municipal No. 6/112, 1st Main, 1st Block, Ward No.14, Rajaji Nagar, Dr. Rajkumar Road, Bengaluru East - 560010, Karnataka'
    },
    {
      id: 13,
      name: 'Rajkot Branch',
      address:
        'Shop No. 4,5,6, Business Bay, Royal Park, Street No. 6, Kalawad Road, Rajkot, Gujarat - 360001, Gujarat'
    },
    {
      id: 14,
      name: 'Surat Branch',
      address: 'G-1/A, ITC Building, Majura Gate Crossing, Ring Road, Surat - 395002, Gujarat'
    },
    {
      id: 15,
      name: 'Surat RTM Branch',
      address:
        'Shop No. 4, Shri Raghunandan Textile Market, Ring Road, Surat, Gujarat - 395002, Gujarat'
    },
    {
      id: 16,
      name: 'Vadodara Branch',
      address:
        'Ground Floor, Riya Plex Plot No.80, Urmi Society, BPC Road, Vadodara - 390007, Gujarat'
    },
    {
      id: 17,
      name: 'Wagle Estate Branch',
      address:
        'Shop No.1, Centrum, Plot No.3 Ground Floor, S.G. Barve Road, Wagle Estate, Thane (W)-400604, Maharashtra'
    }
  ];

  const handleConfirm = () => {
    onConfirm(selectedBranches);
  };

  // const toggleBranchSelection = (id) => {
  //   setSelectedBranches((prev) =>
  //     prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
  //   );
  // };

  const filteredBranches = branches.filter((b) => {
    const matchesSearch = b.address.toLowerCase().includes(branchAddress.toLowerCase());

    if (filter === 'all') {
      return matchesSearch;
    }

    return matchesSearch && b.address.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <Dialog className="address-search dialog" open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <div class="section-title branch-address-title">Branch Locator</div>
      </DialogTitle>

      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        className="branch-add-tabs"
      >
        <Tab label="Branch Search" />
        <Tab label="Branch Near You" />
      </Tabs>

      <DialogContent>
        {tab === 0 && (
          <>
            <Box className="consent-section">
              {/* Search and Filter Row */}
              <Box mb={2}>
                <Grid container>
                  <Grid item size={{ xs: 12, sm: 8, md: 10 }}>
                    <TextField
                      fullWidth
                      variant="standard"
                      placeholder="Search branch"
                      value={branchAddress}
                      onChange={(e) => setBranchAddress(e.target.value)}
                      className="custom-textfield"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item  marginTop={{ xs: 3, sm: 10, md: 0 }} size={{ xs: 12, sm: 4, md: 2 }}>
                    <FormControl
                      variant="standard"
                      className="custom-textfield branch-selector"
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      <label htmlFor="" className="branch-add-selct-label">
                        Select State
                      </label>
                      <Select
                        value={filter}
                        className="branch-add-filter"
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ marginTop: '3px' }}
                      >
                        <MenuItem value="all">All </MenuItem>
                        <MenuItem value="Goa">Goa</MenuItem>
                        <MenuItem value="Gujarat">Gujarat </MenuItem>
                        <MenuItem value="Karnataka">Karnataka</MenuItem>
                        <MenuItem value="Madhya Pradesh">Madhya Pradesh </MenuItem>
                        <MenuItem value="Maharashtra">Maharashtra </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Branch List */}
              <List>
                <RadioGroup
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <List style={{ padding: '0px' }}>
                    {filteredBranches.map((branch, index) => (
                      <ListItem
                        key={branch.id}
                        className="branch-add-list"
                        divider={index !== filteredBranches.length - 1}
                      >
                        <Radio value={branch.id} />

                        {/* <ListItemText className="branch-add-list-item" primary={branch.address} /> */}
                        <ListItemText
                          className="branch-add-list-item"
                          primary={branch.name}
                          secondary={branch.address}
                        />
                      </ListItem>
                    ))}
                  </List>
                </RadioGroup>
                {filteredBranches.length === 0 && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    No branches found.
                  </Typography>
                )}
              </List>
            </Box>
          </>
        )}

        {tab === 1 && (
          <>
            <Box className="consent-section">
              <Typography className="branch-near-title">
                We found {branches.length} branch near you
              </Typography>

              <RadioGroup
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <List sx={{ padding: 0 }}>
                  {filteredBranches.map((branch, index) => (
                    <ListItem
                      key={branch.id}
                      className="branch-add-list"
                      divider={index !== filteredBranches.length - 1}
                    >
                      <Radio value={branch.id} />
                      <ListItemText
                        className="branch-add-list-item"
                        primary={branch.name}
                        secondary={branch.address}
                      />
                    </ListItem>
                  ))}
                </List>
              </RadioGroup>

              {filteredBranches.length === 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                  No branches found.
                </Typography>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        {/* {tab === 0 && ( */}
        <Button onClick={handleConfirm} className="next-btn" variant="contained" color="primary">
          OK
        </Button>
        {/* )} */}
      </DialogActions>
    </Dialog>
  );
}
