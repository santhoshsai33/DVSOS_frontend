# DVSOS UI Standards & Patterns

This document serves as the standard reference for building Form pages and Data Table List pages in the DVSOS frontend. Following this pattern ensures a consistent, clean, and premium look across the entire application.

---

## PART 1: FORM UI PATTERN (Add / Edit Pages)

### 1. Outer Container Layout
Do not use `Card` or custom nested padding blocks. Instead, use a single `Box` with the `background.paper` color, generous padding, and a border radius.

```jsx
<Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>
  {/* Form Content Goes Here */}
</Box>
```

### 2. Page Header & Back Button
The header should use a flexbox layout to align the Title to the left and the Back Button to the right. Use the custom `<BackButton>` component instead of manually building an arrow link.

```jsx
import BackButton from '../../components/common/BackButton';

{/* Page Header */}
<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
  <Typography variant="h5" fontWeight={700}>
    {isEdit ? 'Edit' : 'Add'} Entity Name
  </Typography>
  <BackButton 
    to={ROUTES.TARGET_LIST_ROUTE} 
    label="Back to List" 
  />
</Box>
```

### 3. Form Grid Structure
Always wrap your form fields inside Material UI `<Grid>` components. For standard text inputs, use `xs={12} md={6}` so they take up half the width on desktop and full width on mobile. Stack multiple grids vertically with margin-bottom (`mb: 3`).

```jsx
<FormProvider {...methods}>
  <form onSubmit={handleSubmit(onSubmit)}>
    
    {/* First Row of Inputs */}
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="name"
          label="Name"
          placeholder="Enter name"
          required
        />
      </Grid>
    </Grid>
  </form>
</FormProvider>
```

### 4. Footer Actions (Buttons)
The footer should have a subtle top border acting as a divider, and the buttons should be aligned to the right. Always include a Secondary "Cancel" button and a Primary "Submit" button with a loading state.

```jsx
{/* Footer Actions */}
<Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
  <Button variant="secondary" onClick={() => navigate(ROUTES.TARGET_LIST_ROUTE)}>
    Cancel
  </Button>
  <Button variant="primary" type="submit" isLoading={saving}>
    {isEdit ? 'Save Changes' : 'Create Entity'}
  </Button>
</Box>
```

---

## PART 2: DATA TABLE UI PATTERN (List Pages)

### 1. Page Header & Add Button
Use the standard `<PageHeader>` component for list pages. Pass breadcrumbs and an "Add" button as an action to navigate to the Form page.

```jsx
import PageHeader from '../../components/shared/PageHeader';
import { Plus } from 'lucide-react';

<PageHeader
  title="Entity Master"
  breadcrumbs={[{ label: 'Settings' }, { label: 'Entities' }]}
  actions={
    <Button variant="primary" leftIcon={Plus} onClick={() => navigate(ROUTES.TARGET_NEW_ROUTE)}>
      Add Entity
    </Button>
  }
/>
```

### 2. The Data Table Container
Wrap the `<DataTable>` component inside a `<Card>` with a rounded border of 0 so it bleeds cleanly. Pass your `columns` and `data` directly to the `DataTable`.

```jsx
import DataTable from '../../components/common/DataTable';
import { Card } from '@mui/material';

<Card sx={{ borderRadius: 0 }}>
  <DataTable
    columns={columns}
    data={entitiesList || []}
    emptyMessage="No entities found"
  />
</Card>
```

### 3. Action Menus (Edit & Delete)
Inside your columns array, create an "Actions" column that triggers an MUI `<Menu>`.
**Crucial:** The "Edit" button inside the menu must explicitly navigate to the edit route.

```jsx
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

// Inside your columns definition:
{
  header: 'Actions',
  render: (row) => (
    <IconButton size="small" onClick={(e) => handleMenuClick(e, row)}>
      <MoreVertical size={18} />
    </IconButton>
  )
}

// Below the Card, define your Menu:
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
>
  {/* Edit Navigation */}
  <MenuItem onClick={() => { 
    handleMenuClose(); 
    navigate(ROUTES.TARGET_EDIT_ROUTE.replace(':id', selectedRow?.id)); 
  }}>
    <Edit size={16} className="mr-3 text-primary" />
    Edit Entity
  </MenuItem>

  {/* Delete Action */}
  <MenuItem onClick={() => { 
    handleMenuClose(); 
    handleDelete(selectedRow); 
  }} sx={{ color: 'error.main' }}>
    <Trash2 size={16} className="mr-3" />
    Delete Entity
  </MenuItem>
</Menu>
```

## Full Example References
If you need to view complete files implementing these exact standards, refer to:
- **Forms:** `src/pages/Masters/StateForm.jsx`
- **Tables:** `src/pages/Masters/StateList.jsx`
