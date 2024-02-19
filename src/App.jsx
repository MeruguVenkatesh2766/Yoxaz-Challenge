import React, { useState, useEffect } from 'react';
import { Container, Typography, Input, Select, FormControl, InputLabel, InputAdornment, Button, Card, TextField, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Checkbox, IconButton, Menu, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import CustomSelect from './helpers/customSelect';
import CustomTable from './helpers/customTable';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [productsData, setProductsData] = useState([]);
  const [products, setProducts] = useState([]);

  // Considered the below 3 for search and these will be used in Dropdowns as options
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [ids, setIds] = useState([]);

  // Params for search 
  const [searchText, setSearchText] = useState('');
  const [selectedId, setSelectedId] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Function to filter products based on search
  const filterProducts = (products, searchText, selectedId, selectedBrand, selectedCategory) => {
    return products.filter(product => {
      // Filter by title
      const titleMatch = searchText === '' || product.title.toLowerCase().includes(searchText.toLowerCase());

      // Filter by ID
      const idMatch = selectedId === 'all' || product.id === parseInt(selectedId);

      // Filter by Brand
      const brandMatch = selectedBrand === 'all' || product.brand === selectedBrand;

      // Filter by Category
      const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;

      // Return true if all conditions match
      return titleMatch && idMatch && brandMatch && categoryMatch;
    });
  };

  // Function to handle search button click
  const handleSearch = () => {
    const filteredProducts = filterProducts(productsData, searchText, selectedId, selectedBrand, selectedCategory);
    setProducts(filteredProducts);
  };

  useEffect(() => {
    // Fetch data from the API
    fetch('https://dummyjson.com/products')
      .then(response => response.json())
      .then(data => {
        setProductsData(data.products)
        setProducts(data.products);
        const uniqueCategories = new Set();
        const uniqueBrands = new Set();
        const uniqueIds = new Set();

        data.products.forEach(item => {
          uniqueCategories.add(item.category);
          uniqueBrands.add(item.brand);
          uniqueIds.add(item.id);
        });

        setCategories([...uniqueCategories]);
        setBrands([...uniqueBrands]);
        setIds([...uniqueIds]);
        setIsLoading(false);
      });
  }, []);
  return (
    <div style={{ height: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: 'rgba(25, 118, 210, 0.04)' }}>
      {/* 1st row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 22, fontWeight: 'bold' }}>Orders</Typography>
        <Button variant="contained" color="primary" style={{ borderRadius: '10px', fontSize: 12 }}>CREATE NEW</Button>
      </div>

      {/* 2nd row */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card style={{ padding: '20px', display: 'flex', alignItems: 'center', borderRadius: '15px' }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} sm={6} md={5}>
                <Typography sx={{ fontSize: 13, fontWeight: 'bold', paddingBottom: '2px' }}>
                  {'What are you looking for ?'}
                </Typography>
                <TextField
                  id="input-with-icon-textfield"
                  InputProps={{
                    style: { borderRadius: '8px' },
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  style={{ backgroundColor: 'rgba(25, 118, 210, 0.05)' }}
                  placeholder='Search for title'
                  variant="outlined"
                  size='small'
                  fullWidth
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />

              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <CustomSelect data={ids} label={'ID'} value={selectedId} handleChange={(e) => setSelectedId((e.target.value).toString())} />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <CustomSelect data={brands} label={'Brand'} value={selectedBrand} handleChange={(e) => setSelectedBrand(e.target.value)} />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <CustomSelect data={categories} label={'Category'} value={selectedCategory} handleChange={(e) => setSelectedCategory(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={4} md={1} sx={{ alignSelf: 'end', padding: "5px" }}>
                <Button variant="contained" color="primary" style={{ borderRadius: '10px', fontSize: 12 }} onClick={handleSearch}>SEARCH</Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
      {/* 3rd row */}
      <CustomTable products={products} isLoading={isLoading} />
    </div>
  );
}

export default App;
