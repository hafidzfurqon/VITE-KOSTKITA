import { Button } from '@mui/material';

export function BadgeComponent({ title }) {
  const statusColors = {
    approved: {
      backgroundColor: '#DCFCE7',
      color: '#15803D',
    },
    pending: {
      backgroundColor: '#FEF9C3',
      color: '#A16207',
    },
    rejected: {
      backgroundColor: '#F8D7DA',
      color: '#721C24',
    },
    info: {
      backgroundColor: '#CCE5FF',
      color: '#004085',
    },
  };

  const statusKey = title?.toLowerCase() || 'info';
  const { backgroundColor, color } = statusColors[statusKey] || statusColors.info;

  return (
    <Button
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '6px',
        px: '8px',
        py: '4px',
        fontSize: '12px',
        lineHeight: '1rem',
        fontWeight: 500,
        textTransform: 'capitalize',
        backgroundColor,
        color,
        cursor: 'default',
        pointerEvents: 'none', // biar ga bisa diklik
      }}
    >
      {title || 'Info'}
    </Button>
  );
}
