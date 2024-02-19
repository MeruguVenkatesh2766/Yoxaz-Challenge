import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

export default function CustomSelect({ data, label, value, handleChange }) {

    return (
        <>
            <Typography sx={{ fontSize: 13, fontWeight: 'bold', paddingBottom: '2px' }}>
                {label}
            </Typography>
            <FormControl fullWidth size="small">
                <Select
                    sx={{ borderRadius: '8px', fontSize: 13 }}
                    id="demo-select-small"
                    value={value}
                    onChange={handleChange}
                >
                    <MenuItem value="all">All</MenuItem>
                    {data.map((item) => (
                        <MenuItem key={item} value={item} sx={{ fontSize: 13 }}>
                            {item}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}
