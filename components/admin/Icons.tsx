// Line icons for the admin panel (24px grid, stroke follows currentColor)

const Svg = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const HomeIcon = () => (
  <Svg>
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
  </Svg>
);

export const PotIcon = () => (
  <Svg>
    <path d="M4 10h16v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zM2 10h2M20 10h2M8 10V8a4 4 0 0 1 8 0v2" />
  </Svg>
);

export const BookIcon = () => (
  <Svg>
    <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5zM4 19.5A1.5 1.5 0 0 0 5.5 21H20M8 7h8M8 11h6" />
  </Svg>
);

export const ExternalIcon = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Svg>
);

export const LogoutIcon = () => (
  <Svg>
    <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11" />
  </Svg>
);

export const MenuIcon = () => (
  <Svg size={24}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Svg>
);

export const CloseIcon = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const PlusIcon = () => (
  <Svg>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const EditIcon = () => (
  <Svg size={18}>
    <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />
  </Svg>
);

export const TrashIcon = () => (
  <Svg size={18}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </Svg>
);

export const UpIcon = () => (
  <Svg size={18}>
    <path d="m6 15 6-6 6 6" />
  </Svg>
);

export const DownIcon = () => (
  <Svg size={18}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const SearchIcon = () => (
  <Svg size={18}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const AlertIcon = () => (
  <Svg>
    <path d="M12 3 2 20h20zM12 10v4M12 17.5v.5" />
  </Svg>
);

export const CheckIcon = () => (
  <Svg size={16}>
    <path d="m5 12 5 5 9-10" />
  </Svg>
);

export const ImageIcon = () => (
  <Svg size={28}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="2" />
    <path d="m21 16-5-5-9 9" />
  </Svg>
);
