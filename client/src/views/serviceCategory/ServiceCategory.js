import { styled } from '@mui/material/styles';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ServicesCategoryTable from 'views/serviceCategory/ServiceCategoryTable';

// styles
const IFrameWrapper = styled('iframe')(({ theme }) => ({
    height: 'calc(100vh - 210px)',
    border: '1px solid',
    borderColor: theme.palette.primary.light
}));

// ============================|| MATERIAL ICONS ||============================ //

const MaterialIcons = () => (
    <MainCard title="Service Category">
        <ServicesCategoryTable />
    </MainCard>
);

export default MaterialIcons;
