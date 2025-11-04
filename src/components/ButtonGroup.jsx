import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import '../styles/global.css';
import { iconMap } from './Icons';

const ButtonGroup = ({ title, items, selectedValue, onSelect, iconSize = 22 }) => {
  if (!items?.length) return null;

  return (
    <Box className="button-group-container">
      <Typography variant="subtitle1" className="button-group-title">
        {title}
      </Typography>

      <Grid container spacing={1} className="button-grid">
        {items.map((item) => {
          // Fetch component and color from centralized iconMap
          const { component: IconComponent, color } = iconMap[item.icon] || iconMap.default;
          const isSelected = selectedValue === item.value;

          return (
            <Grid item key={item.value} xs={12} sm={6} md="auto">
              <Button
                onClick={() => onSelect(item.value)}
                variant={isSelected ? 'contained' : 'outlined'}
                className={`custom-button ${isSelected ? 'selected' : ''}`}
                startIcon={<IconComponent size={iconSize} color={isSelected ? "#f5f0f0" : color} />}
              >
                {item.label}
              </Button>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ButtonGroup;
