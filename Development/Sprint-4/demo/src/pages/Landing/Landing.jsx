import { Box, Button, Typography } from '@mui/material'
import { Background } from '../../utils/ImageExport'
import { useNavigate } from 'react-router-dom'
// used to defer state updates
import { startTransition, useCallback } from 'react'

const Landing = () => {
    const navigate = useNavigate();

    const handleClick = useCallback(() => {
        startTransition(() => {
            navigate('/homepage')
        })
    }, [navigate])

    return (
        <Box sx={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100%', backgroundImage: `url(${Background['background']})` }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: 40, p: 5 }}>Welcome to The Store</Typography>
                <Button onClick={handleClick} variant='contained' sx={{ backgroundColor: '#FFC947', color: '#000000', fontSize: '2rem', fontWeight: 'bold', padding: '1rem 2rem', borderRadius: '2rem' }}>Click Here</Button>
            </Box>
        </Box>
    );
}

export default Landing;