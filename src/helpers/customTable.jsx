import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Button, Select, FormControl, MenuItem, Grid, } from '@mui/material';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'id',
        numeric: true,
        disablePadding: true,
        label: 'ID',
    },
    {
        id: 'title',
        numeric: true,
        disablePadding: false,
        label: 'Title',
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'Price',
    },
    {
        id: 'discountPercentage',
        numeric: true,
        disablePadding: false,
        label: 'Discount %',
    },
    {
        id: 'rating',
        numeric: true,
        disablePadding: false,
        label: 'Rating',
    },
    // {
    //     id: 'description',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Description',
    // },

    {
        id: 'brand',
        numeric: true,
        disablePadding: false,
        label: 'Brand',
    },
    {
        id: 'category',
        numeric: true,
        disablePadding: false,
        label: 'Category',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead >
            <TableRow >
                <TableCell sx={{ backgroundColor: 'rgba(25, 118, 210, 0.05)' }} padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        sx={{ backgroundColor: 'rgba(25, 118, 210, 0.05)' }}
                        key={headCell.id}
                        align={headCell.numeric ? 'left' : 'right'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const CustomTable = React.memo(({ products, isLoading }) => {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = products.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(products, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, products],
    );

    const pages = Math.ceil(products.length / rowsPerPage);

    // custom function for page buttons
    const renderPageButtons = React.useMemo(() => {
        const buttons = [];

        // Show all page buttons if the number of pages is less than or equal to 5
        if (pages <= 5) {
            for (let i = 1; i <= pages; i++) {
                buttons.push(
                    <IconButton
                        key={i}
                        onClick={() => handleChangePage(null, i - 1)}
                        disabled={i === page + 1}
                        style={{
                            margin: 0,
                            width: '28px',
                            height: '28px',
                            borderRadius: '4px',
                            backgroundColor: i === page + 1 ? '#1976d2' : 'transparent',
                            color: i === page + 1 ? 'white' : 'inherit',
                        }}
                    >
                        <Typography variant="body1">{i}</Typography>
                    </IconButton>
                );
            }
        } else {
            for (let i = 1; i <= 5; i++) {
                buttons.push(
                    <IconButton
                        key={i}
                        onClick={() => handleChangePage(null, i - 1)}
                        disabled={i === page + 1}
                        style={{
                            margin: 0,
                            width: '28px',
                            height: '28px',
                            borderRadius: '4px',
                            backgroundColor: i === page + 1 ? '#1976d2' : 'transparent',
                            color: i === page + 1 ? 'white' : 'inherit',
                        }}
                    >
                        <Typography variant="body1">{i}</Typography>
                    </IconButton>
                );
            }

            // Add the "..." ellipsis
            buttons.push(<Typography key="ellipsis" variant="body1">...</Typography>);

            // Add the last page button
            buttons.push(
                <IconButton
                    key={pages}
                    onClick={() => handleChangePage(null, pages - 1)}
                    disabled={pages === page + 1}
                    style={{
                        margin: 0,
                        width: '28px',
                        height: '28px',
                        borderRadius: '4px',
                        backgroundColor: pages === page + 1 ? '#1976d2' : 'transparent',
                        color: pages === page + 1 ? 'white' : 'inherit',
                    }}
                >
                    <Typography variant="body1">{pages}</Typography>
                </IconButton>
            );
        }

        return buttons;
    }, [pages, page, handleChangePage]);

    const handleDispatchSelected = () => {
        const selectedData = products.filter(product => selected.includes(product.id));
        console.log(selectedData);
    }

    return (
        <Box sx={{ width: '100%', flex: 1 }}>
            <Paper sx={{ width: '100%', height: '100%', borderRadius: '15px' }}>
                {isLoading ? (
                    // Render loading component if data is being fetched
                    <Box sx={{ p: 2, textAlign: 'center' }}>Loading...</Box>
                ) :
                    <>
                        {/* 1st row */}
                        <Grid container justifyContent="space-between" alignItems="center" sx={{ padding: '10px 15px' }}>
                            <Grid item xs={12} sm={12} md={6}>

                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Product Summary</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} container spacing={1} alignItems="center">
                                <Grid item xs={12} sm={6} md={6} display="flex" alignItems="center" flexDirection="row">
                                    <Typography variant="body1" style={{ paddingRight: '5px' }}>Show</Typography>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={1}
                                            sx={{ borderRadius: '8px', fontSize: 13 }}
                                        >
                                            <MenuItem value={1}>All Columns</MenuItem>
                                            <MenuItem value={2}>All Columns</MenuItem>
                                            <MenuItem value={3}>All Columns</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ borderRadius: '10px', whiteSpace: 'nowrap', fontSize: 12 }}
                                        onClick={handleDispatchSelected}
                                    >
                                        DISPATCH SELECTED
                                    </Button>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={2}>
                                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" style={{ padding: '10px' }}>
                                    <IconButton
                                        onClick={() => handleChangePage(null, page - 1)}
                                        disabled={page === 0}
                                        sx={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        <KeyboardArrowLeftIcon />
                                    </IconButton>
                                    {renderPageButtons}
                                    <IconButton
                                        onClick={() => handleChangePage(null, page + 1)}
                                        disabled={page === pages - 1}
                                        sx={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        <KeyboardArrowRightIcon />
                                    </IconButton>
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* 2nd row*/}
                        <TableContainer sx={{ maxHeight: '62vh' }}>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size={'medium'}
                            >
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={products.length}
                                />
                                <TableBody sx={{ overflowY: 'auto' }}>
                                    {visibleRows && visibleRows.map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleClick(event, row.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    align="left"
                                                >
                                                    {row.id}
                                                </TableCell>
                                                <TableCell align="left">{row.title}</TableCell>
                                                <TableCell align="left">{row.price}</TableCell>
                                                <TableCell align="left">{row.discountPercentage}</TableCell>
                                                <TableCell align="left">{row.rating}</TableCell>
                                                {/* <TableCell align="left">{row.description}</TableCell> */}
                                                <TableCell align="left">{row.brand}</TableCell>
                                                <TableCell align="left">{row.category}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: (53) * emptyRows,
                                            }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                }
            </Paper>
        </Box>
    )
})

export default CustomTable;