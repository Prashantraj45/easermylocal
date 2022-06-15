import { Grid, Link } from '@mui/material';
import MuiTypography from '@mui/material/Typography';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import BusinessCategoryTable from 'views/businessCategory/BusinessCategory';

// ==============================|| TYPOGRAPHY ||============================== //

const Typography = () => (
    <MainCard title="Business Category">
        <BusinessCategoryTable />
    </MainCard>
);

export default Typography;
