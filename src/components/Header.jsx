import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import '../styles/components/header.css';
import logo from '../assets/images/kalolyticLogo.svg';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenu, setSubmenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();

  const handleMenuOpen = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setSubmenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSubmenu(null);
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const menus = {
    Loans: ['Home Loan', 'Personal Loan', 'Vehicle Loan', 'Education Loan'],
    Services: ['Online Banking', 'Deposits', 'Insurance'],
    'About Us': ['Company', 'Board Members', 'Careers']
  };

  return (
    <>
      <AppBar position="static" color="primary" className="header-appbar">
        <Toolbar className="header-toolbar">
          {/* Left: Hamburger Menu for small screens */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => toggleDrawer(true)}
              className='navbar-icon' 
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Logo */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={logo} className="header-logo" alt="Logo" onClick={() => navigate('/')} />
          </Typography>

          {/* Desktop menus */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {Object.keys(menus).map((menu) => (
              <div key={menu} className="header-menu-item">
                <Button
                  color="inherit"
                  onClick={(e) => handleMenuOpen(e, menu)}
                  className="header-menu-item-button"
                >
                  {menu}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={submenu === menu}
                  onClose={handleMenuClose}
                  keepMounted
                >
                  {menus[menu].map((sub) => (
                    <MenuItem key={sub} onClick={handleMenuClose}>
                      {sub}
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            ))}

            {/* Search icon */}
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile menu */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)}>
          <List>
            {Object.keys(menus).map((menu) => (
              <React.Fragment key={menu}>
                <ListItem>
                  <ListItemText primary={menu} />
                </ListItem>
                {menus[menu].map((sub) => (
                  <ListItem button key={sub}>
                    <ListItemText primary={sub} />
                  </ListItem>
                ))}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
