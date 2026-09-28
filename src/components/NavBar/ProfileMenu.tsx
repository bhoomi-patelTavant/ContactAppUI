import React, { useState } from 'react';
import {
    Avatar,
    Box,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useTranslation } from 'react-i18next';

interface ProfileMenuProps {
    userName: string;
    userEmail: string;
    onViewProfile: () => void;
    onLogout: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
    userName,
    userEmail,
    onViewProfile,
    onLogout,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const initials = userName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase() || 'U';

    const handleClose = () => setAnchorEl(null);
    const { t } = useTranslation();

    return (
        <>
            <IconButton
                onClick={(event) => setAnchorEl(event.currentTarget)}
                aria-controls={open ? 'profile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{
                    p: 0.5,
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                }}
            >
                <Avatar
                    sx={{
                        width: 34,
                        height: 34,
                        bgcolor: '#1976d2',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 700,
                    }}
                >
                    {initials}
                </Avatar>
            </IconButton>

            <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1.5,
                            minWidth: 220,
                            borderRadius: 2,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                        },
                    },
                }}
            >
                <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e5e7eb' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>
                        {userName}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            color: '#6b7280',
                            maxWidth: 180,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {userEmail}
                    </Typography>
                </Box>

                <MenuItem
                    onClick={() => {
                        handleClose();
                        onViewProfile();
                    }}
                >
                    <ListItemIcon>
                        <PersonOutlineOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    {t("profile.view_profile")}
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        handleClose();
                        onLogout();
                    }}
                >
                    <ListItemIcon>
                        <LogoutRoundedIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    {t("nav_links.logout_link")}
                </MenuItem>
            </Menu>
        </>
    );
};
